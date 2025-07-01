import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageSelector } from './LanguageSelector';
import { User } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: { path: string; label: string }[];
  user: { id: string; email: string } | null;
  t: (key: string) => string;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, navigationItems, user, t }) => {
  return (
    <AnimatePresence>
      {isOpen && (
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
                  onClick={onClose}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    window.location.pathname === item.path ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
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
                    onClose();
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
  );
};