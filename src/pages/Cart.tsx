import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, Truck, Shield, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { CartItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  total: number;
}

export const Cart: React.FC<CartProps> = ({ items = [], onUpdateQuantity, onRemoveItem, total }) => {
  const { t, formatCurrency } = useLanguage();
  const safeItems = Array.isArray(items) ? items : [];

  if (!safeItems.length) {
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
            {t('cart.emptyMessage')}
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Danh sách sản phẩm trong giỏ */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white border rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">{t('cart.title')}</h1>
            <div className="divide-y">
              {safeItems.map((item, idx) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 py-4">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-24 h-24 object-cover rounded border" />
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="font-semibold text-lg">{item.product.name}</h2>
                        <div className="text-sm text-gray-500 mb-1">{t(`categories.${item.product.category.toLowerCase()}`)}</div>
                        {item.selectedColor && <span className="text-xs text-gray-400 mr-2">{t('products.color')}: {item.selectedColor}</span>}
                        {item.selectedSize && <span className="text-xs text-gray-400">{t('products.size')}: {item.selectedSize}</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 border rounded text-lg">-</button>
                        <span className="px-3 py-1 border border-gray-300 rounded min-w-[3rem] text-center">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 border rounded text-lg">+</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-semibold text-red-600">{formatCurrency(item.product.price * item.quantity)}</span>
                      <button onClick={() => onRemoveItem(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link to="/products" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                ← {t('cart.continueShopping')}
              </Link>
            </div>
          </div>
        </div>
        {/* Tóm tắt đơn hàng */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white border rounded-lg p-6 sticky top-4">
            <h2 className="text-lg font-semibold mb-4">{t('checkout.orderSummary')}</h2>
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
              className="block w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold text-center text-lg mb-2"
            >
              {t('cart.checkout')}
            </Link>
            <div className="flex flex-wrap gap-3 text-sm mt-4">
              <span className="flex items-center gap-1 text-green-600"><Truck className="w-4 h-4" /> Giao hàng nhanh</span>
              <span className="flex items-center gap-1 text-blue-600"><Shield className="w-4 h-4" /> Bảo hành chính hãng</span>
              <span className="flex items-center gap-1 text-yellow-600"><RotateCcw className="w-4 h-4" /> Đổi trả 7 ngày</span>
            </div>
            {total < 100 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  {t('cart.freeShippingThreshold', { amount: formatCurrency(100 - total) })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};