import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Truck, RotateCcw, Eye, FileText, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrderContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { formatPrice, formatDate, cn } from '../lib/utils';

const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const statusLabels = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
};

const paymentStatusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-emerald-100 text-emerald-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-blue-100 text-blue-800',
};

export function Orders() {
  const { user } = useAuth();
  const { orders, cancelOrder, requestReturn, cancelReturnRequest, returnRequests } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(null);
  const [returnReason, setReturnReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  const userOrders = orders.filter(o => o.userId === (user?.id || 'current_user'));
  
  const filteredOrders = userOrders.filter(order => {
    if (filter === 'active') return !['delivered', 'cancelled'].includes(order.status);
    if (filter === 'past') return ['delivered', 'cancelled'].includes(order.status);
    return true;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const canCancel = (order) => !['shipped', 'delivered', 'cancelled'].includes(order.status);
  const canReturn = (order) => order.status === 'delivered' && order.paymentStatus === 'paid';
  const hasReturnRequest = (orderId, productId) => 
    returnRequests.some(r => r.orderId === orderId && r.productId === productId && r.status !== 'refunded');

  const handleCancelOrder = async (orderId) => {
    setIsLoading(true);
    const success = cancelOrder(orderId);
    setIsLoading(false);
    setShowCancelModal(false);
    if (success) alert('Order cancelled successfully');
    else alert('Cannot cancel this order');
  };

  const handleRequestReturn = async () => {
    if (!showReturnModal || !returnReason.trim()) return;
    setIsLoading(true);
    requestReturn(showReturnModal.order.id, showReturnModal.productId, returnReason);
    setIsLoading(false);
    setShowReturnModal(null);
    setReturnReason('');
    alert('Return request submitted successfully');
  };

  const getReturnForOrder = (orderId, productId) => 
    returnRequests.find(r => r.orderId === orderId && r.productId === productId);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf7f2]">
        <div className="text-center p-8 bg-white border border-stone-200 rounded-xs shadow-md">
          <h1 className="font-serif text-2xl font-bold mb-3">Please sign in to view your orders</h1>
          <Link to="/auth">
            <Button className="bg-[#721224] text-white text-xs uppercase tracking-wider">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#c5a059]">
            Account Management
          </span>
          <h1 className="font-serif text-3xl font-normal text-stone-900 mt-1">My Orders</h1>
          <p className="text-stone-600 text-xs mt-1">Track drapes, dispatch status, and download tax invoices.</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 border-b border-stone-200">
          {['all', 'active', 'past'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-2 text-xs uppercase tracking-wider font-semibold border-b-2 transition-colors',
                filter === f ? 'border-[#721224] text-[#721224]' : 'border-transparent text-stone-500 hover:text-stone-900'
              )}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} {f !== 'all' && `(${userOrders.filter(o => f === 'active' ? !['delivered', 'cancelled'].includes(o.status) : f === 'past' ? ['delivered', 'cancelled'].includes(o.status) : true).length})`}
            </button>
          ))}
        </div>

        {sortedOrders.length === 0 ? (
          <Card className="p-12 text-center border-stone-200 rounded-xs">
            <Truck className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="font-serif text-xl font-medium text-stone-900 mb-1">No orders found</h3>
            <p className="text-stone-500 text-xs mb-6">
              {filter === 'active' ? 'You have no active orders in transit.' : filter === 'past' ? 'No past orders yet.' : "You haven't placed any orders yet."}
            </p>
            <Link to="/products">
              <Button className="bg-[#721224] text-white text-xs uppercase tracking-wider">Start Shopping</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewDetails={() => setSelectedOrder(order)}
                onCancel={() => { setShowCancelModal(true); setSelectedOrder(order); }}
                onRequestReturn={(productId) => { setShowReturnModal({ order, productId }); }}
                canCancel={canCancel(order)}
                canReturn={canReturn(order)}
                hasReturnRequest={(productId) => hasReturnRequest(order.id, productId)}
                getReturnForOrder={(productId) => getReturnForOrder(order.id, productId)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Order"
        description="Are you sure you want to cancel this order?"
      >
        <div className="space-y-4 text-xs">
          <p className="text-stone-600">The drape order will be cancelled and any payment refunded directly to your original source.</p>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => setShowCancelModal(false)} className="text-xs">Keep Order</Button>
            <Button className="bg-red-700 hover:bg-red-800 text-white text-xs" onClick={() => selectedOrder && handleCancelOrder(selectedOrder.id)} isLoading={isLoading}>
              Confirm Cancellation
            </Button>
          </div>
        </div>
      </Modal>

      {/* Return Request Modal */}
      {showReturnModal && (
        <Modal
          isOpen={!!showReturnModal}
          onClose={() => setShowReturnModal(null)}
          title="Artisan Inspection & Return Request"
          size="md"
        >
          <div className="space-y-4 text-xs">
            <p className="text-stone-600">Please let us know your reason for requesting a return or exchange:</p>
            <select
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-xs bg-white text-xs focus:outline-none focus:border-[#721224]"
            >
              <option value="">Select a reason</option>
              <option value="weave_variance">Zari / color shade variance from natural light</option>
              <option value="fabric_texture">Fabric thickness / texture preference</option>
              <option value="damaged">Damage or flaw in weaving</option>
              <option value="wrong_item">Received incorrect saree SKU</option>
              <option value="other">Other reason</option>
            </select>
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="outline" onClick={() => setShowReturnModal(null)} className="text-xs">Cancel</Button>
              <Button onClick={handleRequestReturn} isLoading={isLoading} className="bg-[#721224] text-white text-xs uppercase tracking-wider">
                Submit Request
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function OrderCard({ order, onViewDetails, onCancel, onRequestReturn, canCancel, canReturn, hasReturnRequest, getReturnForOrder }) {
  return (
    <Card className="overflow-hidden border-stone-200 rounded-xs shadow-xs">
      <div className="p-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#721224]/10 rounded-xs flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#721224]" />
            </div>
            <div>
              <p className="font-bold text-stone-900 text-xs">Order #{order.id}</p>
              <p className="text-[11px] text-stone-500">Placed on {formatDate(order.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge className={cn('text-[10px] uppercase font-bold tracking-wider', statusColors[order.status])}>{statusLabels[order.status]}</Badge>
            <Badge className={cn('text-[10px] uppercase font-bold tracking-wider', paymentStatusColors[order.paymentStatus])}>{order.paymentStatus}</Badge>
          </div>
        </div>

        <div className="border-t border-stone-100 pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={order.items[0].product.images[0]} alt={order.items[0].product.name} className="w-12 h-16 object-cover rounded-xs border border-stone-200" />
              <div>
                <p className="font-serif font-semibold text-sm text-stone-900 line-clamp-1">{order.items[0].product.name}</p>
                {order.items.length > 1 && <p className="text-xs text-stone-500">+ {order.items.length - 1} more item(s)</p>}
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-[#721224] text-sm">{formatPrice(order.total)}</p>
              <p className="text-xs text-stone-500">{order.items.reduce((sum, item) => sum + item.quantity, 0)} pieces</p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 pt-3 border-t border-stone-100 text-xs">
          <Button variant="outline" size="sm" onClick={onViewDetails} className="flex-1 text-xs">
            <Eye className="w-3.5 h-3.5 mr-1" />
            View Details
          </Button>
          <Button variant="outline" size="sm" className="flex-1 text-xs">
            <Download className="w-3.5 h-3.5 mr-1" />
            Invoice
          </Button>
          {canCancel && (
            <Button variant="outline" size="sm" className="text-red-700 border-red-300 hover:bg-red-50 flex-1 text-xs" onClick={() => onCancel(order.id)}>
              Cancel Order
            </Button>
          )}
          {order.items.map((item) => 
            canReturn && !hasReturnRequest(item.product.id) && !getReturnForOrder(item.product.id) && (
              <Button key={item.product.id} variant="outline" size="sm" className="flex-1 text-xs" onClick={() => onRequestReturn(item.product.id)}>
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Return
              </Button>
            )
          )}
        </div>
      </div>
    </Card>
  );
}

function OrderDetailModal({ order, isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Order Reference #${order.id}`}
      size="xl"
    >
      <div className="space-y-6 text-xs">
        <div className="bg-stone-50 rounded-xs p-5 border border-stone-200">
          <h3 className="font-serif text-base font-bold text-stone-900 mb-3">Order Status Progression</h3>
          <div className="flex flex-wrap gap-2">
            {statusOrder.map((status, index) => {
              const isCompleted = statusOrder.indexOf(order.status) >= index;
              return (
                <span
                  key={status}
                  className={cn(
                    'px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-xs border',
                    isCompleted ? 'bg-[#721224] text-white border-[#721224]' : 'bg-white text-stone-400 border-stone-200'
                  )}
                >
                  {statusLabels[status]}
                </span>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white border border-stone-200 rounded-xs space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-stone-700">Shipping Address</h4>
            <p className="font-semibold text-stone-900">{order.shippingAddress.name} ({order.shippingAddress.phone})</p>
            <p className="text-stone-600">
              {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
          </div>

          <div className="p-4 bg-white border border-stone-200 rounded-xs space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-stone-700">Financial Summary</h4>
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping & Insured Transit:</span>
              <span className="font-semibold">{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span>
            </div>
            <div className="flex justify-between border-t border-stone-200 pt-1 text-sm font-bold text-[#721224]">
              <span>Total Paid:</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
