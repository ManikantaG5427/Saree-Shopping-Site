import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  Boxes,
  ShoppingBag,
  CreditCard,
  RotateCcw,
  Users,
  Store,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useOrders } from '../../contexts/OrderContext.jsx';
import { useProducts } from '../../contexts/ProductContext.jsx';

const adminNavItems = [
  { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: Layers },
  { label: 'Inventory', href: '/admin/inventory', icon: Boxes },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag, badgeKey: 'orders' },
  { label: 'Payments', href: '/admin/payments', icon: CreditCard },
  { label: 'Returns & Refunds', href: '/admin/returns', icon: RotateCcw, badgeKey: 'returns' },
  { label: 'Customers', href: '/admin/users', icon: Users },
];

export function AdminSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { orders = [], returnRequests = [] } = useOrders();
  const { products = [] } = useProducts();

  const pendingOrdersCount = orders.filter((o) => ['pending', 'confirmed', 'processing'].includes(o.status)).length;
  const pendingReturnsCount = returnRequests.filter((r) => r.status === 'requested').length;

  return (
    <aside className="w-64 bg-[#0f172a] text-slate-300 flex flex-col flex-shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm shadow-sm">
          SL
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm text-white tracking-tight leading-none">
            RETAIL CONTROL
          </span>
          <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-1">
            Operations & Catalog
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] uppercase font-bold tracking-wider text-slate-500">
          Operational Views
        </div>

        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href || 
            (item.href === '/admin/dashboard' && (location.pathname === '/admin' || location.pathname === '/admin/'));

          let badgeValue = null;
          if (item.badgeKey === 'orders' && pendingOrdersCount > 0) badgeValue = pendingOrdersCount;
          if (item.badgeKey === 'returns' && pendingReturnsCount > 0) badgeValue = pendingReturnsCount;

          return (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                isActive
                  ? 'bg-[#2563eb] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {badgeValue !== null && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white text-[#2563eb]' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {badgeValue}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Storefront & User Control */}
      <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-900/60">
        <Link
          to="/"
          className="flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/60"
        >
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-[#2563eb]" />
            <span>Customer Storefront</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        </Link>

        {user && (
          <div className="flex items-center justify-between pt-2 px-1 text-xs">
            <div className="flex flex-col">
              <span className="font-semibold text-white truncate max-w-[120px]">{user.name}</span>
              <span className="text-[10px] text-[#2563eb] uppercase tracking-wider font-semibold">Administrator</span>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
