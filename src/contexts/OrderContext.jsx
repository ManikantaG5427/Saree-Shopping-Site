import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateOrderId, formatDate } from '../lib/utils';
import { orderService } from '../api';

const OrderContext = createContext(undefined);
const ORDERS_STORAGE_KEY = 'saree_web_orders';
const RETURNS_STORAGE_KEY = 'saree_web_returns';

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [returnRequests, setReturnRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        // Try fetching orders from MERN backend
        const serverOrders = await orderService.getMyOrders();
        if (serverOrders && Array.isArray(serverOrders) && serverOrders.length > 0) {
          setOrders(serverOrders);
          setIsLoading(false);
          return;
        }
      } catch {
        // Backend not reachable or unauthenticated, fall back to localStorage
      }

      const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      const storedReturns = localStorage.getItem(RETURNS_STORAGE_KEY);
      
      if (storedOrders) {
        try {
          setOrders(JSON.parse(storedOrders));
        } catch {
          localStorage.removeItem(ORDERS_STORAGE_KEY);
        }
      }
      
      if (storedReturns) {
        try {
          setReturnRequests(JSON.parse(storedReturns));
        } catch {
          localStorage.removeItem(RETURNS_STORAGE_KEY);
        }
      }
      
      setIsLoading(false);
    };

    loadOrders();
  }, []);

  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(RETURNS_STORAGE_KEY, JSON.stringify(returnRequests));
  }, [returnRequests]);

  const createOrder = (items, shippingAddress, paymentId) => {
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const shipping = subtotal >= 5000 ? 0 : 199;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + shipping + tax;

    const newOrder = {
      id: generateOrderId(),
      userId: 'current_user',
      items,
      shippingAddress,
      subtotal,
      shipping,
      tax,
      total,
      status: paymentId ? 'confirmed' : 'pending',
      paymentStatus: paymentId ? 'paid' : 'pending',
      paymentId,
      createdAt: formatDate(new Date().toISOString()),
      updatedAt: formatDate(new Date().toISOString()),
    };

    setOrders(prev => [newOrder, ...prev]);

    // Async attempt to persist to MERN backend
    orderService.createOrder({
      items: items.map(item => ({ product: item.product.id || item.product._id, quantity: item.quantity })),
      shippingAddress,
      paymentMethod: paymentId ? 'card' : 'cod',
      paymentId
    }).catch(() => {
      // Offline fallback already stored locally
    });

    return newOrder;
  };

  const getOrderById = (id) => {
    return orders.find(order => order.id === id);
  };

  const getUserOrders = (userId) => {
    return orders.filter(order => order.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const cancelOrder = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (!order || ['shipped', 'delivered', 'cancelled'].includes(order.status)) {
      return false;
    }

    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: 'cancelled', updatedAt: formatDate(new Date().toISOString()) } : o
    ));

    orderService.cancelOrder(orderId).catch(() => {});
    return true;
  };

  const requestReturn = (orderId, productId, reason) => {
    const newReturn = {
      id: 'ret_' + Date.now(),
      orderId,
      productId,
      reason,
      status: 'requested',
      createdAt: formatDate(new Date().toISOString()),
    };

    setReturnRequests(prev => [newReturn, ...prev]);
    return newReturn;
  };

  const getReturnRequest = (id) => {
    return returnRequests.find(r => r.id === id);
  };

  const cancelReturnRequest = (returnId) => {
    const returnReq = returnRequests.find(r => r.id === returnId);
    if (!returnReq || returnReq.status !== 'requested') {
      return false;
    }

    setReturnRequests(prev => prev.filter(r => r.id !== returnId));
    return true;
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status, updatedAt: formatDate(new Date().toISOString()) } : o
    ));
  };

  const updatePaymentStatus = (orderId, paymentStatus) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, paymentStatus, updatedAt: formatDate(new Date().toISOString()) } : o
    ));
  };

  const updateReturnStatus = (returnId, status) => {
    setReturnRequests(prev => prev.map(r => 
      r.id === returnId ? { ...r, status } : r
    ));
  };

  return (
    <OrderContext.Provider value={{
      orders,
      returnRequests,
      isLoading,
      createOrder,
      getOrderById,
      getUserOrders,
      cancelOrder,
      requestReturn,
      getReturnRequest,
      cancelReturnRequest,
      updateOrderStatus,
      updatePaymentStatus,
      updateReturnStatus,
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
