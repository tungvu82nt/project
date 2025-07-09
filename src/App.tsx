import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { AdminLayout } from './admin/AdminLayout';
import { NotificationSystem, useNotifications } from './components/Notifications/NotificationSystem';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { AdminDashboard } from './admin/pages/AdminDashboard';
import { ProductManagement } from './admin/pages/ProductManagement';
import { OrderManagement } from './admin/pages/OrderManagement';
import { CustomerManagement } from './admin/pages/CustomerManagement';
import { AnalyticsPage } from './admin/pages/AnalyticsPage';
import { ContentManagement } from './admin/pages/ContentManagement';
import { MarketingTools } from './admin/pages/MarketingTools';
import { useCart } from './hooks/useCart';
import DatabaseDemo from './components/DatabaseDemo';

function App() {
  const { items, addItem, removeItem, updateQuantity, total, itemCount, clearCart } = useCart();
  const { notifications, addNotification, removeNotification } = useNotifications();

  const handleAddToCart = (product: any, quantity = 1, color?: string, size?: string) => {
    addItem(product, quantity, color, size);
    addNotification({
      type: 'success',
      title: 'Added to Cart',
      message: `${product.name} has been added to your cart.`,
      duration: 3000
    });
  };

  const handlePlaceOrder = (orderData: any) => {
    // Simulate order processing
    console.log('Order placed:', orderData);
    clearCart();
    addNotification({
      type: 'success',
      title: 'Order Placed Successfully',
      message: 'Your order has been confirmed and will be processed shortly.',
      duration: 5000
    });
  };

  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin/*" element={
                <AdminLayout>
                  <Routes>
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<ProductManagement />} />
                    <Route path="orders" element={<OrderManagement />} />
                    <Route path="customers" element={<CustomerManagement />} />
                    <Route path="analytics" element={<AnalyticsPage />} />
                    <Route path="content" element={<ContentManagement />} />
                    <Route path="marketing" element={<MarketingTools />} />
                    <Route path="settings" element={<div>Settings</div>} />
                  </Routes>
                </AdminLayout>
              } />
              
              {/* Public Routes */}
              <Route path="/*" element={
                <>
                  <Header cartItemCount={itemCount} />
                  <main className="flex-1">
                    <Routes>
                      <Route index element={<Home onAddToCart={handleAddToCart} />} />
                      <Route path="products" element={<Products onAddToCart={handleAddToCart} />} />
                      <Route path="product/:id" element={<ProductDetail onAddToCart={handleAddToCart} />} />
                      <Route path="cart" element={
                        <Cart 
                          items={items}
                          onUpdateQuantity={updateQuantity}
                          onRemoveItem={removeItem}
                          total={total}
                        />
                      } />
                      <Route path="checkout" element={
                        <Checkout 
                          items={items}
                          total={total}
                          onPlaceOrder={handlePlaceOrder}
                        />
                      } />
                      <Route path="about" element={<div className="p-8 text-center">About Page</div>} />
                      <Route path="contact" element={<div className="p-8 text-center">Contact Page</div>} />
                      <Route path="database-demo" element={<DatabaseDemo />} />
                    </Routes>
                  </main>
                  <Footer />
                </>
              } />
            </Routes>
            
            {/* Global Notification System */}
            <NotificationSystem 
              notifications={notifications}
              onRemove={removeNotification}
            />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;