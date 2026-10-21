import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Bell, ExternalLink, AlertTriangle } from 'lucide-react';
import { useProducts } from '../../contexts/ProductContext.jsx';
import { useOrders } from '../../contexts/OrderContext.jsx';

export function AdminTopbar() {
  const location = useLocation();
  const { products = [] } = useProducts();
  const { orders = [] } = useOrders();

  const lowStockCount = products.filter((p) => p.isActive && p.stock <= 5).length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('products')) return 'Product Catalog Management';
    if (path.includes('categories')) return 'Category Management';
    if (path.includes('inventory')) return 'Inventory & Stock Movements';
    if (path.includes('orders')) return 'Customer Order Fulfillment';
    if (path.includes('payments')) return 'Payment Records & Reconciliation';
    if (path.includes('returns')) return 'Returns & Refund Requests';
    if (path.includes('users')) return 'Customer Account Management';
    return 'Store Operations Overview';
  };

  return (
    <header className="h-16 bg-white border-b border-[#e2e8f0] px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-base font-bold text-[#0f172a] tracking-tight">
          {getPageTitle()}
        </h1>
        <span className="hidden sm:inline-block text-slate-300">|</span>
        <span className="hidden sm:inline-block text-xs font-medium text-slate-500">
          MERN Console
        </span>
      </div>

      {/* Right: Operational Alerts */}
      <div className="flex items-center gap-4">
        {lowStockCount > 0 && (
          <Link
            to="/admin/inventory"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-md hover:bg-amber-100 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>{lowStockCount} Low Stock</span>
          </Link>
        )}

        {pendingOrdersCount > 0 && (
          <Link
            to="/admin/orders"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold rounded-md hover:bg-blue-100 transition-colors"
          >
            <Bell className="w-3.5 h-3.5 text-[#2563eb]" />
            <span>{pendingOrdersCount} Unfulfilled</span>
          </Link>
        )}

        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        <Link
          to="/"
          target="_blank"
          className="text-xs font-medium text-slate-600 hover:text-[#2563eb] flex items-center gap-1.5 transition-colors"
          title="Open customer storefront in new tab"
        >
          <span>Live Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </header>
  );
}
