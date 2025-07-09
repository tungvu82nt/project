import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { CartItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  total: number;
}

export const Cart: React.FC<CartProps> = ({ items, onUpdateQuantity, onRemoveItem, total }) => {
  const { t, formatCurrency } = useLanguage();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ShoppingBag className="h-16 w-16 sm:h-24 sm:w-24 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{t('cart.empty')}</h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {t('cart.continueShopping')}
          </Link>
        </motion.div>
      </div>
    );
  }

  const shippingCost = total > 100 ? 0 : 15;
  const tax = total * 0.08;
  const finalTotal = total + shippingCost + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">{t('cart.title')}</h1>
          <Link
            to="/products"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base"
          >
            {t('cart.continueShopping')}
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <motion.div
            className="bg-white rounded-lg shadow-sm border"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t('cart.items')} ({items.length})
              </h2>
              
              <div className="space-y-4 sm:space-y-6">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 border border-gray-200 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full sm:w-20 h-48 sm:h-20 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                        {item.product.name}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        {t(`categories.${item.product.category.toLowerCase()}`)}
                      </p>
                      
                      {item.selectedColor && (
                        <p className="text-sm text-gray-500">{t('products.color')}: {item.selectedColor}</p>
                      )}
                      {item.selectedSize && (
                        <p className="text-sm text-gray-500">{t('products.size')}: {item.selectedSize}</p>
                      )}
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 space-y-3 sm:space-y-0">
                        <div className="flex items-center justify-center sm:justify-start space-x-2">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-3 py-1 border border-gray-300 rounded min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-end space-x-4">
                          <span className="text-lg font-semibold text-gray-900">
                            {formatCurrency(item.product.price * item.quantity)}
                          </span>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Order Summary */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 sticky top-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('checkout.orderSummary')}</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('cart.subtotal')}</span>
                <span className="font-medium">{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('cart.shipping')}</span>
                <span className="font-medium text-green-600">
                  {shippingCost === 0 ? t('cart.freeShipping') : formatCurrency(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('cart.tax')}</span>
                <span className="font-medium">{formatCurrency(tax)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">{t('cart.total')}</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {formatCurrency(finalTotal)}
                  </span>
                </div>
              </div>
            </div>
            
            <Link
              to="/checkout"
              className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
            >
              {t('cart.checkout')}
            </Link>
            
            <p className="text-sm text-gray-500 text-center mt-4">
              Secure checkout with SSL encryption
            </p>
            
            {total < 100 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  {t('cart.freeShippingThreshold', { amount: formatCurrency(100 - total) })}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};