import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings,
  Menu,
  X,
  Moon,
  Sun,
  FileText,
  Megaphone,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from '../components/Layout/LanguageSelector';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: t('admin.dashboard'), href: '/admin', icon: LayoutDashboard },
    { name: t('admin.products'), href: '/admin/products', icon: Package },
    { name: t('admin.orders'), href: '/admin/orders', icon: ShoppingCart },
    { name: t('admin.customers'), href: '/admin/customers', icon: Users },
    { name: t('admin.analytics'), href: '/admin/analytics', icon: BarChart3 },
    { name: t('admin.content'), href: '/admin/content', icon: FileText },
    { name: t('admin.marketing'), href: '/admin/marketing', icon: Megaphone },
    { name: t('admin.settings'), href: '/admin/settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`h-screen flex ${darkMode ? 'dark' : ''}`}>
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-900 shadow-lg transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'} w-64`}
        initial={false}
        animate={{ 
          width: sidebarCollapsed ? 64 : 256,
          x: sidebarOpen ? 0 : -256 
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            {!sidebarCollapsed && (
              <span className="text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
                {t('nav.admin')}
              </span>
            )}
          </div>
          
          {/* Mobile close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Desktop collapse button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:block p-1 text-gray-400 hover:text-gray-500"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors group ${
                  isActive(item.href)
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
                onClick={() => setSidebarOpen(false)}
                title={sidebarCollapsed ? item.name : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="ml-3 whitespace-nowrap">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-2 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
            title={sidebarCollapsed ? (darkMode ? 'Light Mode' : 'Dark Mode') : undefined}
          >
            {darkMode ? (
              <Sun className="h-5 w-5 flex-shrink-0" />
            ) : (
              <Moon className="h-5 w-5 flex-shrink-0" />
            )}
            {!sidebarCollapsed && (
              <span className="ml-3 whitespace-nowrap">
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </span>
            )}
          </button>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-500"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Page title - hidden on small screens */}
              <h1 className="hidden sm:block text-lg font-semibold text-gray-900 dark:text-white">
                {navigation.find(item => isActive(item.href))?.name || t('admin.dashboard')}
              </h1>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Language Selector */}
              <div className="hidden sm:block">
                <LanguageSelector />
              </div>

              {/* User Profile */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Admin User
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-800">
          <div className="p-4 sm:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};