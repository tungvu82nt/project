import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { CartItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface CheckoutProps {
  items: CartItem[];
  total: number;
  onPlaceOrder: (orderData: any) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ items, total, onPlaceOrder }) => {
  const { t, formatCurrency } = useLanguage();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Vietnam',
    
    // Payment Information
    paymentMethod: 'vnpay',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    
    // Order Notes
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (stepNumber: number) => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!formData.firstName) newErrors.firstName = t('auth.emailRequired');
      if (!formData.lastName) newErrors.lastName = t('auth.emailRequired');
      if (!formData.email) newErrors.email = t('auth.emailRequired');
      if (!formData.phone) newErrors.phone = t('auth.emailRequired');
      if (!formData.address) newErrors.address = t('auth.emailRequired');
      if (!formData.city) newErrors.city = t('auth.emailRequired');
      if (!formData.postalCode) newErrors.postalCode = t('auth.emailRequired');
    }

    if (stepNumber === 2 && formData.paymentMethod === 'card') {
      if (!formData.cardNumber) newErrors.cardNumber = t('auth.emailRequired');
      if (!formData.expiryDate) newErrors.expiryDate = t('auth.emailRequired');
      if (!formData.cvv) newErrors.cvv = t('auth.emailRequired');
      if (!formData.cardName) newErrors.cardName = t('auth.emailRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePlaceOrder = () => {
    if (validateStep(2)) {
      const orderData = {
        items,
        total: total * 1.08, // Including tax
        shippingInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod === 'cod' ? 'cash_on_delivery' : formData.paymentMethod,
        notes: formData.notes
      };
      
      onPlaceOrder(orderData);
      setStep(3);
    }
  };

  const shippingCost = total > 100 ? 0 : 15;
  const tax = total * 0.08;
  const finalTotal = total + shippingCost + tax;

  if (step === 3) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('checkout.orderConfirmed')}</h1>
          <p className="text-xl text-gray-600 mb-8">
            {t('checkout.orderSuccess')}
          </p>
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('checkout.orderSummary')}</h3>
            <p className="text-gray-600">{t('checkout.orderNumber')}: #ORD-{Date.now()}</p>
            <p className="text-gray-600">{t('cart.total')}: {formatCurrency(finalTotal)}</p>
            <p className="text-gray-600">{t('checkout.paymentMethod')}: {
              formData.paymentMethod === 'cod' ? t('checkout.cashOnDelivery') : 
              formData.paymentMethod === 'vnpay' ? 'VNPAY' :
              formData.paymentMethod === 'momo' ? 'MoMo' :
              formData.paymentMethod === 'card' ? t('checkout.creditCard') :
              formData.paymentMethod === 'bank' ? t('checkout.bankTransfer') :
              formData.paymentMethod.toUpperCase()
            }</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('checkout.continueShoppingBtn')}
            </Link>
            <Link
              to="/account/orders"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('checkout.viewOrdersBtn')}
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          to="/cart"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back')} {t('nav.cart')}
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{t('checkout.title')}</h1>
      </motion.div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-8">
          {[
            { number: 1, title: t('checkout.shippingInfo'), icon: Truck },
            { number: 2, title: t('checkout.paymentInfo'), icon: CreditCard },
            { number: 3, title: t('checkout.orderConfirmation'), icon: CheckCircle }
          ].map((stepItem) => (
            <div key={stepItem.number} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= stepItem.number 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                <stepItem.icon className="h-5 w-5" />
              </div>
              <span className={`ml-2 font-medium ${
                step >= stepItem.number ? 'text-blue-600' : 'text-gray-600'
              }`}>
                {stepItem.title}
              </span>
              {stepItem.number < 3 && (
                <div className={`w-16 h-1 mx-4 ${
                  step > stepItem.number ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <motion.div
              className="bg-white rounded-lg shadow-sm border p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('checkout.shippingInfo')}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('checkout.firstName')} *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.firstName ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('checkout.lastName')} *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.lastName ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('checkout.email')} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('checkout.phone')} *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('checkout.address')} *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.address ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('checkout.city')} *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.city ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('checkout.zipCode')} *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.postalCode ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleNextStep}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('common.continue')} {t('checkout.paymentInfo')}
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              className="bg-white rounded-lg shadow-sm border p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('checkout.paymentInfo')}</h2>
              
              {/* Payment Methods */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  {t('checkout.paymentMethod')}
                </label>
                <div className="space-y-3">
                  {[
                    { id: 'vnpay', name: 'VNPAY', description: 'Pay with VNPAY gateway' },
                { id: 'momo', name: 'MoMo', description: 'Pay with MoMo e-wallet' },
                { id: 'card', name: t('checkout.creditCard'), description: 'Pay with your card' },
                { id: 'bank', name: t('checkout.bankTransfer'), description: 'Direct bank transfer' },
                { id: 'cod', name: t('checkout.cashOnDelivery'), description: t('checkout.codDescription') }
                  ].map((method) => (
                    <label key={method.id} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={formData.paymentMethod === method.id}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{method.name}</div>
                        <div className="text-sm text-gray-600">{method.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Order Notes */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('checkout.orderNotes')} ({t('common.optional')})
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any special instructions for your order..."
                />
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t('common.back')} {t('checkout.shippingInfo')}
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('checkout.placeOrder')}
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <motion.div
            className="bg-white rounded-lg shadow-sm border p-6 sticky top-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('checkout.orderSummary')}</h3>
            
            {/* Items */}
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.nameTranslations?.vi || item.product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {item.product.nameTranslations?.vi || item.product.name}
                    </h4>
                    <p className="text-sm text-gray-600">{t('products.quantity')}: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('cart.subtotal')}</span>
                <span className="font-medium">{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('cart.shipping')}</span>
                <span className="font-medium">
                  {shippingCost === 0 ? t('cart.freeShipping') : formatCurrency(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('cart.tax')}</span>
                <span className="font-medium">{formatCurrency(tax)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">{t('cart.total')}</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {formatCurrency(finalTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Shield className="h-4 w-4" />
              <span>{t('cart.secureCheckout')}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};