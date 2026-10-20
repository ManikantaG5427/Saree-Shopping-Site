import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ProductProvider } from './contexts/ProductContext';
import { OrderProvider } from './contexts/OrderContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { LocationProvider } from './contexts/LocationContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Auth } from './pages/Auth';
import { Profile } from './pages/Profile';
import { Orders } from './pages/Orders';
import { Wishlist } from './pages/Wishlist';
import { Admin } from './pages/Admin';
import './index.css';

function PrivateRoute({ children }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf7f2]">
        <div className="w-8 h-8 border-4 border-[#721224] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" state={{ from: window.location }} replace />;
}

function AdminRoute({ children }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="w-8 h-8 border-4 border-[#721224] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  return user?.role === 'admin' ? <>{children}</> : <Navigate to="/" replace />;
}

function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <Header />
      <main id="MainContent" tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <ProductProvider>
            <OrderProvider>
              <LocationProvider>
                <BrowserRouter>
                  <Routes>
                    {/* Customer Storefront Routes */}
                    <Route element={<CustomerLayout />}>
                      <Route path="/" element={<Home />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/login" element={<Auth />} />
                      <Route path="/register" element={<Auth />} />
                      
                      <Route
                        path="/profile/*"
                        element={
                          <PrivateRoute>
                            <Profile />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/orders"
                        element={
                          <PrivateRoute>
                            <Orders />
                          </PrivateRoute>
                        }
                      />
                    </Route>

                    {/* Admin Console */}
                    <Route
                      path="/admin/*"
                      element={
                        <AdminRoute>
                          <Admin />
                        </AdminRoute>
                      }
                    />

                    {/* Catch-all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </BrowserRouter>
              </LocationProvider>
            </OrderProvider>
          </ProductProvider>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
