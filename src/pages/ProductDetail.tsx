import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, Shield, Truck, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { products } from '../data/products';
import { Product } from '../types';
import { ProductViewer3D } from '../components/Product/ProductViewer3D';
import { useLanguage } from '../contexts/LanguageContext';
import { normalizeText, ensureDisplaySafe, fixVietnameseEncoding } from '../utils/encoding';

interface ProductDetailProps {
  onAddToCart: (product: Product, quantity: number, color?: string, size?: string) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ onAddToCart }) => {
  const { id } = useParams<{ id: string }>();
  const { t, language, formatCurrency } = useLanguage();
  const product = products.find(p => p.id === id);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('productDetail.productNotFound')}</h2>
          <Link to="/products" className="text-blue-600 hover:text-blue-700">
            ← {t('productDetail.backToProducts')}
          </Link>
        </div>
      </div>
    );
  }

  // Get localized product data with encoding safety
  const getLocalizedName = () => {
    let name = product.nameTranslations?.[language] || product.name;
    name = normalizeText(name);
    if (language === 'vi') {
      name = fixVietnameseEncoding(name);
    }
    return ensureDisplaySafe(name);
  };

  const getLocalizedDescription = () => {
    let description = product.descriptionTranslations?.[language] || product.description;
    description = normalizeText(description);
    if (language === 'vi') {
      description = fixVietnameseEncoding(description);
    }
    return ensureDisplaySafe(description);
  };

  const getLocalizedColors = () => {
    const colors = product.colorsTranslations?.[language] || product.colors;
    return colors.map(color => {
      let processedColor = normalizeText(color);
      if (language === 'vi') {
        processedColor = fixVietnameseEncoding(processedColor);
      }
      return ensureDisplaySafe(processedColor);
    });
  };

  const getLocalizedSizes = () => {
    const sizes = product.sizesTranslations?.[language] || product.sizes;
    return sizes.map(size => {
      let processedSize = normalizeText(size);
      if (language === 'vi') {
        processedSize = fixVietnameseEncoding(processedSize);
      }
      return ensureDisplaySafe(processedSize);
    });
  };

  const getLocalizedFeatures = () => {
    const features = product.featuresTranslations?.[language] || product.features;
    return features.map(feature => {
      let processedFeature = normalizeText(feature);
      if (language === 'vi') {
        processedFeature = fixVietnameseEncoding(processedFeature);
      }
      return ensureDisplaySafe(processedFeature);
    });
  };

  const getLocalizedSpecifications = () => {
    const specs = product.specificationsTranslations?.[language] || product.specifications;
    const processedSpecs: Record<string, string> = {};
    
    Object.entries(specs).forEach(([key, value]) => {
      let processedKey = normalizeText(key);
      let processedValue = normalizeText(value);
      
      if (language === 'vi') {
        processedKey = fixVietnameseEncoding(processedKey);
        processedValue = fixVietnameseEncoding(processedValue);
      }
      
      processedSpecs[ensureDisplaySafe(processedKey)] = ensureDisplaySafe(processedValue);
    });
    
    return processedSpecs;
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedColor, selectedSize);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          to="/products"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('productDetail.backToProducts')}
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={getLocalizedName()}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 3D Viewer */}
            <ProductViewer3D productColor={selectedColor || '#3B82F6'} />

            {/* Thumbnail Images */}
            <div className="flex space-x-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${getLocalizedName()} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Title and Rating */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{getLocalizedName()}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-2">
                  {product.rating} ({product.reviews} {t('products.reviews')})
                </span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-gray-900">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xl text-gray-500 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
            {product.originalPrice && (
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                {t('common.save')} {formatCurrency(product.originalPrice - product.price)}
              </span>
            )}
          </div>

          {/* Color Selection */}
          {getLocalizedColors().length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">{t('products.color')}</h3>
              <div className="flex space-x-3">
                {getLocalizedColors().map((color, index) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border-2 ${
                      selectedColor === color
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {getLocalizedSizes().length > 1 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">{t('products.size')}</h3>
              <div className="flex space-x-3">
                {getLocalizedSizes().map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border-2 ${
                      selectedSize === size
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">{t('products.quantity')}</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-50"
                >
                  -
                </button>
                <span className="px-4 py-2 border-l border-r border-gray-300">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-50"
                >
                  +
                </button>
              </div>
              {product.inStock ? (
                <span className="text-green-600 font-medium">{t('products.inStock')}</span>
              ) : (
                <span className="text-red-600 font-medium">{t('products.outOfStock')}</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <motion.button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              whileTap={{ scale: 0.98 }}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>{t('products.addToCart')}</span>
            </motion.button>
            
            <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Heart className="h-5 w-5 text-gray-600" />
            </button>
            
            <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Share2 className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Features */}
          <div className="border-t pt-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600">{t('productDetail.warranty')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">{t('productDetail.freeShipping')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <RotateCcw className="h-5 w-5 text-orange-600" />
                <span className="text-sm text-gray-600">{t('productDetail.dayReturn')}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Product Details Tabs */}
      <motion.div
        className="mt-16"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'description', label: t('products.description') },
              { id: 'specifications', label: t('products.specifications') },
              { id: 'reviews', label: t('products.reviews') }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="py-8">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-6">{getLocalizedDescription()}</p>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('productDetail.keyFeatures')}</h3>
              <ul className="space-y-2">
                {getLocalizedFeatures().map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(getLocalizedSpecifications()).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-900">{key}</span>
                  <span className="text-gray-600">{value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="text-center py-12">
              <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('productDetail.noReviews')}</h3>
              <p className="text-gray-600">{t('productDetail.beFirstReview')}</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};