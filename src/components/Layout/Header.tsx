import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { UserMenu } from './UserMenu';
import { LoginModal } from '../Auth/LoginModal';
import LanguageSelector from './LanguageSelector';
import { normalizeText, ensureDisplaySafe, fixVietnameseEncoding } from '../../utils/encoding';

interface HeaderProps {
  cartItemCount: number;
}

export const Header: React.FC<HeaderProps> = ({ cartItemCount }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Handle search input with encoding safety
  const handleSearchChange = (value: string) => {
    let processedValue = normalizeText(value);
    if (language === 'vi') {
      processedValue = fixVietnameseEncoding(processedValue);
    }
    setSearchTerm(ensureDisplaySafe(processedValue));
  };

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { path: '/', label: t('nav.home') },
    { path: '/products', label: t('nav.products') },
    { path: '/about', label: t('nav.about') },
    { path: '/contact', label: t('nav.contact') },
    { path: '/database-demo', label: 'Database Demo' }
  ];

  return (
    <>
      <motion.header 
        className="bg-white shadow-sm border-b sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">Y</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">Yapee</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`text-gray-700 hover:text-blue-600 transition-colors font-medium ${
                    isActive(item.path) ? 'text-blue-600' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Search Bar */}
            <div className="hidden xl:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={t('products.searchPlaceholder')}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile Search Toggle */}
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-400 hover:text-gray-500 xl:hidden"
              >
                <Search className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              
              {/* Cart */}
              <Link to="/cart" className="relative p-2 text-gray-400 hover:text-gray-500">
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                {cartItemCount > 0 && (
                  <motion.span 
                    className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </motion.span>
                )}
              </Link>

              {/* Language Selector - Hidden on small screens */}
              <div className="hidden sm:block">
                <LanguageSelector />
              </div>

              {/* User Menu / Login */}
              {user ? (
                <UserMenu />
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:block">{t('auth.signIn')}</span>
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-400 hover:text-gray-500 lg:hidden"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                className="xl:hidden pb-4"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder={t('products.searchPlaceholder')}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="lg:hidden bg-white border-t border-gray-200"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-4 space-y-4">
                {/* Navigation Links */}
                <div className="space-y-2">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                        isActive(item.path)
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                {/* Language Selector for Mobile */}
                <div className="sm:hidden pt-4 border-t border-gray-200">
                  <LanguageSelector />
                </div>

                {/* User Actions for Mobile */}
                {!user && (
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setShowLoginModal(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      <span>{t('auth.signIn')}</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
};
