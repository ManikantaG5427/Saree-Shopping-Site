import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(undefined);
const CART_STORAGE_KEY = 'saree_web_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart));
      } catch {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1) => {
    if (!product) return;
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        const newQuantity = Math.min(existingItem.quantity + quantity, product.stock || 99);
        if (newQuantity === existingItem.quantity) return prevItems;
        
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      
      if ((product.stock || 0) <= 0 && product.stock !== undefined) return prevItems;
      
      return [...prevItems, { product, quantity: Math.min(quantity, product.stock || 99) }];
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setItems(prevItems => {
      const item = prevItems.find(i => i.product.id === productId);
      if (!item) return prevItems;
      
      const newQuantity = Math.min(quantity, item.product.stock || 99);
      return prevItems.map(i =>
        i.product.id === productId ? { ...i, quantity: newQuantity } : i
      );
    });
  };

  const removeFromCart = (productId) => {
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (productId) => {
    return items.some(item => item.product.id === productId);
  };

  const getCartQuantity = (productId) => {
    const item = items.find(item => item.product.id === productId);
    return item?.quantity || 0;
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      itemCount,
      subtotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      isInCart,
      getCartQuantity,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
