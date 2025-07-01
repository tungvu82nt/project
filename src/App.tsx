import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { AdminLayout } from './admin/AdminLayout';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { AdminDashboard } from './admin/pages/AdminDashboard';
import { ProductManagement } from './admin/pages/ProductManagement';
import { CategoryManagement } from './admin/pages/CategoryManagement';
import { OrderManagement } from './admin/pages/OrderManagement';
import { CustomerManagement } from './admin/pages/CustomerManagement';
import { AnalyticsPage } from './admin/pages/AnalyticsPage';
import { ContentManagement } from './admin/pages/ContentManagement';
import { MarketingTools } from './admin/pages/MarketingTools';
import { SettingsPage } from './admin/pages/SettingsPage';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { NotificationSystem } from './components/Notifications/NotificationSystem';
import { useCart } from './hooks/useCart';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';
import Account from './pages/Account';
import Login from './pages/Login';

function PublicLayout() {
  const { items, updateQuantity, removeItem, total, addItem } = useCart();
  const { itemCount } = useCart();
  
  return (
    <>
      <Header cartItemCount={itemCount} />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home onAddToCart={addItem} />} />
          <Route path="/products" element={<Products onAddToCart={addItem} />} />
          <Route path="/products/:productId" element={<ProductDetail onAddToCart={addItem} />} />
          <Route path="/cart" element={<Cart items={items} onUpdateQuantity={updateQuantity} onRemoveItem={removeItem} total={total} />} />
          <Route path="/checkout" element={<Checkout items={items} total={total} onPlaceOrder={() => {}} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/account" element={<Account />} />
          <Route path="/account/profile" element={<Account activeTab='profile' />} />
          <Route path="/account/orders" element={<Account activeTab='orders' />} />
          <Route path="/account/wishlist" element={<Account activeTab='wishlist' />} />
          <Route path="/account/settings" element={<Account activeTab='settings' />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<div className="p-8 text-center">Page Not Found</div>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <NotificationSystem />
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
              <AnimatePresence mode="wait">
                <Routes>
                  {/* Admin Routes */}
                  <Route path="/admin/*" element={<PrivateRoute isAdmin={true}><AdminLayout /></PrivateRoute>}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="products" element={<ProductManagement />} />
                    <Route path="categories" element={<CategoryManagement />} />
                    <Route path="orders" element={<OrderManagement />} />
                    <Route path="customers" element={<CustomerManagement />} />
                    <Route path="analytics" element={<AnalyticsPage />} />
                    <Route path="content" element={<ContentManagement />} />
                    <Route path="marketing" element={<MarketingTools />} />
                    <Route path="settings" element={<SettingsPage />} />
                  </Route>

                  {/* Public Routes */}
                  <Route path="/*" element={<PublicLayout />} />
                </Routes>
              </AnimatePresence>
            </Suspense>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

const PrivateRoute: React.FC<{ isAdmin?: boolean; children: JSX.Element }> = ({ isAdmin, children }) => {
  const { user } = useAuth();
  if (!user || (isAdmin && user.role !== 'admin')) {
    return <Navigate to="/" />;
  }
  return children;
};

export default App;