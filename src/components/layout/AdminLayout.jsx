import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar.jsx';
import { AdminTopbar } from './AdminTopbar.jsx';

export function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans antialiased">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <AdminTopbar />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
