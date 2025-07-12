import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, ShoppingBag, Heart, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

export const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white font-medium text-sm">
            {user.firstName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>
        <span className="hidden md:block text-sm font-medium text-gray-700">
          {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {user.firstName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role === 'admin' ? 'Administrator' : 'Customer'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="py-2">
                {user.role === 'customer' && (
                  <>
                    <Link
                      to="/account/profile"
                      className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      to="/account/orders"
                      className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>My Orders</span>
                    </Link>
                    <Link
                      to="/account/wishlist"
                      className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Heart className="h-4 w-4" />
                      <span>Wishlist</span>
                    </Link>
                    <Link
                      to="/account/settings"
                      className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </>
                )}

                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}

                <div className="border-t border-gray-200 mt-2 pt-2">
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
