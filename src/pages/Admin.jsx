import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, Package, Users, ShoppingBag, DollarSign, TrendingUp, ArrowDown, Download, RefreshCw, RotateCcw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';
import { useOrders } from '../contexts/OrderContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { formatPrice, formatDate, cn } from '../lib/utils';

const orderStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
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

export function Admin() {
  const { user, logout } = useAuth();
  const { products, categories } = useProducts();
  const { orders, updateOrderStatus, returnRequests, updateReturnStatus } = useOrders();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf7f2]">
        <div className="text-center p-8 bg-white border border-stone-200 rounded-xs shadow-md">
          <h1 className="font-serif text-2xl font-bold mb-3">Access Restricted</h1>
          <p className="text-stone-500 text-xs mb-6">You need administrative privileges to view this portal.</p>
          <Button onClick={() => navigate('/')} className="bg-[#721224] text-white text-xs uppercase tracking-wider">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => ['pending', 'confirmed', 'processing'].includes(o.status)).length;
  const totalProducts = products.filter(p => p.isActive).length;
  const lowStockProducts = products.filter(p => p.isActive && p.stock > 0 && p.stock <= 10).length;
  const pendingReturns = returnRequests.filter(r => r.status === 'requested').length;

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* Admin Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/admin" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#721224] rounded-xs flex items-center justify-center border border-[#c5a059]/40">
                  <Package className="w-4 h-4 text-[#f5eedf]" />
                </div>
                <span className="text-base font-bold text-[#721224] font-serif tracking-wider">SLSH Admin Portal</span>
              </Link>
              <nav className="hidden md:flex items-center gap-1 bg-stone-100 rounded-xs p-1">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
                  { id: 'products', label: 'Products', icon: Package },
                  { id: 'orders', label: 'Orders', icon: ShoppingBag },
                  { id: 'returns', label: 'Returns', icon: RotateCcw },
                  { id: 'users', label: 'Users', icon: Users },
                  { id: 'categories', label: 'Categories', icon: Package },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-xs font-semibold uppercase tracking-wider transition-colors',
                        activeTab === tab.id
                          ? 'bg-white text-[#721224] shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      )}
                    >
                      <Icon className="w-3.5 h-3.5 text-[#c5a059]" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-stone-500 hidden sm:block">Welcome, {user.name}</span>
              <Button variant="ghost" size="sm" onClick={logout} className="text-xs uppercase tracking-wider text-red-700">Sign Out</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#c5a059]">Management Overview</span>
                <h1 className="font-serif text-3xl font-normal text-stone-900 mt-1">Dashboard</h1>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs"><RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh</Button>
                <Button variant="outline" size="sm" className="text-xs"><Download className="w-3.5 h-3.5 mr-1.5" /> Export</Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Revenue" value={formatPrice(totalRevenue)} icon={DollarSign} color="green" trend="+12.5% this month" />
              <StatCard title="Total Orders" value={totalOrders} icon={ShoppingBag} color="blue" trend="+8.2% vs last month" />
              <StatCard title="Pending Orders" value={pendingOrders} icon={Package} color="yellow" trend="Awaiting dispatch" />
              <StatCard title="Active Weaves" value={totalProducts} icon={Package} color="purple" trend="In catalogue" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StatCard title="Low Stock Alerts" value={lowStockProducts} icon={ArrowDown} color="red" trend={lowStockProducts > 0 ? 'Urgent loom re-order' : 'Healthy inventory'} />
              <StatCard title="Pending Returns" value={pendingReturns} icon={RotateCcw} color="orange" trend={pendingReturns > 0 ? 'Requires inspection' : 'Zero pending returns'} />
            </div>

            {/* Recent Orders */}
            <Card className="border-stone-200 rounded-xs shadow-xs">
              <div className="p-5 border-b border-stone-200 flex items-center justify-between">
                <h2 className="font-serif text-xl font-bold text-stone-900">Recent Customer Orders</h2>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('orders')} className="text-xs text-[#721224]">View All</Button>
              </div>
              <div className="divide-y divide-stone-100 text-xs">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="p-4 flex items-center justify-between hover:bg-stone-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#721224]/10 rounded-xs flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 text-[#721224]" />
                      </div>
                      <div>
                        <p className="font-bold text-stone-900">Order #{order.id}</p>
                        <p className="text-[11px] text-stone-500">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={statusColors[order.status]}>{statusLabels[order.status]}</Badge>
                      <span className="font-bold text-[#721224]">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <ProductManagement
            products={products}
            onAdd={() => { setEditingProduct(null); setShowProductModal(true); }}
            onEdit={setEditingProduct}
            onDelete={async (id) => {
              if (confirm('Delete this product?')) {
                alert('Product deleted (mock)');
              }
            }}
          />
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <OrderManagement
            orders={orders}
            onUpdateStatus={updateOrderStatus}
          />
        )}

        {/* Returns Tab */}
        {activeTab === 'returns' && (
          <ReturnManagement
            returns={returnRequests}
            onUpdateStatus={updateReturnStatus}
          />
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="p-6 bg-white border border-stone-200 rounded-xs">
            <h1 className="font-serif text-2xl font-normal text-stone-900 mb-2">Registered Patrons</h1>
            <p className="text-stone-500 text-xs">User patron profiles are active and synced with database.</p>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <CategoryManagement
            categories={categories}
            onAdd={() => { setEditingCategory(null); setShowCategoryModal(true); }}
            onEdit={setEditingCategory}
            onDelete={async (id) => {
              if (confirm('Delete this category?')) {
                alert('Category deleted (mock)');
              }
            }}
          />
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={showProductModal}
        onClose={() => { setShowProductModal(false); setEditingProduct(null); }}
        product={editingProduct}
        categories={categories}
      />

      {/* Category Modal */}
      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => { setShowCategoryModal(false); setEditingCategory(null); }}
        category={editingCategory}
      />
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend }) {
  return (
    <Card className="p-5 border-stone-200 rounded-xs shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase font-bold tracking-wider text-stone-500 mb-1">{title}</p>
          <p className="font-serif text-2xl font-bold text-stone-900">{value}</p>
          <p className="text-[11px] text-stone-500 mt-1">{trend}</p>
        </div>
        <div className="w-10 h-10 rounded-xs bg-[#721224]/10 text-[#721224] flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#c5a059]" />
        </div>
      </div>
    </Card>
  );
}

function ProductManagement({ products, onAdd, onEdit, onDelete }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' && p.isActive) || (statusFilter === 'inactive' && !p.isActive);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-normal text-stone-900">Catalogue Management</h1>
        <Button onClick={onAdd} className="bg-[#721224] text-white text-xs uppercase tracking-wider"><Plus className="w-4 h-4 mr-1.5" /> Add Saree</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Input placeholder="Search saree SKU or name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 max-w-md text-xs" />
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={[
          { value: 'all', label: 'All Status' },
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ]} className="w-48 text-xs" />
      </div>

      <div className="overflow-x-auto bg-white border border-stone-200 rounded-xs shadow-xs">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-stone-500 border-b border-stone-200 bg-stone-50">
              <th className="p-3 font-semibold uppercase tracking-wider">Weave</th>
              <th className="p-3 font-semibold uppercase tracking-wider">Category</th>
              <th className="p-3 font-semibold uppercase tracking-wider">Price</th>
              <th className="p-3 font-semibold uppercase tracking-wider">Loom Stock</th>
              <th className="p-3 font-semibold uppercase tracking-wider">Status</th>
              <th className="p-3 font-semibold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-stone-50">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img src={product.images[0]} alt={product.name} className="w-10 h-12 object-cover rounded-xs border border-stone-200" />
                    <div>
                      <p className="font-serif font-bold text-stone-900">{product.name}</p>
                      <p className="text-[11px] text-stone-500">{product.fabric || ''}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3"><Badge variant="default">{product.category}</Badge></td>
                <td className="p-3 font-bold text-[#721224]">{formatPrice(product.price)}</td>
                <td className="p-3">
                  {product.stock <= 0 ? <Badge variant="error">Out of Stock</Badge> : <span className="text-emerald-800 font-semibold">{product.stock} pieces</span>}
                </td>
                <td className="p-3">
                  <Badge variant={product.isActive ? 'success' : 'default'}>{product.isActive ? 'Active' : 'Inactive'}</Badge>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(product)}><Edit2 className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="sm" className="text-red-700" onClick={() => onDelete(product.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrderManagement({ orders, onUpdateStatus }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-normal text-stone-900">Order Dispatch Queue</h1>

      <div className="overflow-x-auto bg-white border border-stone-200 rounded-xs shadow-xs text-xs">
        <table className="w-full">
          <thead>
            <tr className="text-left text-stone-500 border-b border-stone-200 bg-stone-50">
              <th className="p-3 font-semibold uppercase tracking-wider">Order ID</th>
              <th className="p-3 font-semibold uppercase tracking-wider">Customer</th>
              <th className="p-3 font-semibold uppercase tracking-wider">Total</th>
              <th className="p-3 font-semibold uppercase tracking-wider">Status</th>
              <th className="p-3 font-semibold uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-stone-50">
                <td className="p-3 font-mono font-bold text-stone-900">{order.id}</td>
                <td className="p-3">
                  <p className="font-semibold text-stone-900">{order.shippingAddress.name}</p>
                  <p className="text-[11px] text-stone-500">{order.shippingAddress.city}</p>
                </td>
                <td className="p-3 font-bold text-[#721224]">{formatPrice(order.total)}</td>
                <td className="p-3">
                  <select
                    value={order.status}
                    onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                    className={cn('px-2 py-1 rounded-xs text-xs font-semibold', statusColors[order.status])}
                  >
                    {orderStatuses.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
                  </select>
                </td>
                <td className="p-3 text-stone-500">{formatDate(order.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReturnManagement({ returns, onUpdateStatus }) {
  const returnStatuses = ['requested', 'approved', 'rejected', 'received', 'refunded'];
  const returnLabels = {
    requested: 'Requested',
    approved: 'Approved',
    rejected: 'Rejected',
    received: 'Received',
    refunded: 'Refunded',
  };

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-normal text-stone-900">Return & Inspection Requests</h1>

      <div className="overflow-x-auto bg-white border border-stone-200 rounded-xs shadow-xs text-xs">
        <table className="w-full">
          <thead>
            <tr className="text-left text-stone-500 border-b border-stone-200 bg-stone-50">
              <th className="p-3 font-semibold uppercase tracking-wider">Return ID</th>
              <th className="p-3 font-semibold uppercase tracking-wider">Order ID</th>
              <th className="p-3 font-semibold uppercase tracking-wider">Reason</th>
              <th className="p-3 font-semibold uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {returns.map((ret) => (
              <tr key={ret.id} className="hover:bg-stone-50">
                <td className="p-3 font-mono font-bold text-stone-900">{ret.id}</td>
                <td className="p-3 font-mono text-stone-600">{ret.orderId}</td>
                <td className="p-3 text-stone-700">{ret.reason}</td>
                <td className="p-3">
                  <select
                    value={ret.status}
                    onChange={(e) => onUpdateStatus(ret.id, e.target.value)}
                    className="px-2 py-1 rounded-xs text-xs font-semibold bg-stone-100"
                  >
                    {returnStatuses.map(s => <option key={s} value={s}>{returnLabels[s]}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CategoryManagement({ categories, onAdd, onEdit, onDelete }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-normal text-stone-900">Weave Categories</h1>
        <Button onClick={onAdd} className="bg-[#721224] text-white text-xs uppercase tracking-wider"><Plus className="w-4 h-4 mr-1.5" /> Add Category</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category.id} className="p-4 border-stone-200 rounded-xs shadow-xs">
            <div className="flex items-center gap-3 mb-3">
              <img src={category.image} alt={category.name} className="w-14 h-14 object-cover rounded-xs border border-stone-200" />
              <div>
                <h3 className="font-serif font-bold text-stone-900">{category.name}</h3>
                <p className="text-xs text-stone-500">{category.productCount} sarees listed</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
              <Badge variant={category.isActive ? 'success' : 'default'} className="text-[10px] uppercase">
                {category.isActive ? 'Active' : 'Inactive'}
              </Badge>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => onEdit(category)}><Edit2 className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="sm" className="text-red-700" onClick={() => onDelete(category.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProductModal({ isOpen, onClose, product, categories }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    category: '',
    stock: 0,
    images: '',
    fabric: '',
    isActive: true,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice || 0,
        category: product.category,
        stock: product.stock,
        images: (product.images || []).join(', '),
        fabric: product.fabric || '',
        isActive: product.isActive,
      });
    }
  }, [product, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(product ? 'Saree updated (mock)' : 'Saree created (mock)');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product ? 'Edit Saree' : 'Add Saree to Catalogue'} size="xl">
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Saree Name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} required />
          <Select label="Category" value={formData.category} onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))} options={categories.map(c => ({ value: c.name, label: c.name }))} required />
          <Input label="Price (₹)" type="number" value={formData.price} onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))} required />
          <Input label="Original Price (₹)" type="number" value={formData.originalPrice} onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: parseFloat(e.target.value) || 0 }))} />
          <Input label="Loom Stock" type="number" value={formData.stock} onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))} required />
          <Input label="Fabric & Zari" value={formData.fabric} onChange={(e) => setFormData(prev => ({ ...prev, fabric: e.target.value }))} />
        </div>
        <div className="flex gap-3 justify-end pt-4 border-t border-stone-200">
          <Button variant="outline" type="button" onClick={onClose} className="text-xs">Cancel</Button>
          <Button type="submit" className="bg-[#721224] text-white text-xs uppercase tracking-wider">{product ? 'Update Saree' : 'Publish Saree'}</Button>
        </div>
      </form>
    </Modal>
  );
}

function CategoryModal({ isOpen, onClose, category }) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image: '',
    isActive: true,
  });

  useEffect(() => {
    if (category) {
      setFormData(category);
    }
  }, [category, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(category ? 'Category updated (mock)' : 'Category created (mock)');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={category ? 'Edit Category' : 'Add Category'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <Input label="Category Name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} required />
        <Input label="Image URL" value={formData.image} onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))} required />
        <div className="flex gap-3 justify-end pt-4 border-t border-stone-200">
          <Button variant="outline" type="button" onClick={onClose} className="text-xs">Cancel</Button>
          <Button type="submit" className="bg-[#721224] text-white text-xs uppercase tracking-wider">Save</Button>
        </div>
      </form>
    </Modal>
  );
}
