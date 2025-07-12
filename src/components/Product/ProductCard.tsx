import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { normalizeText, ensureDisplaySafe, fixVietnameseEncoding } from '../../utils/encoding';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { t, formatCurrency, language } = useLanguage();
  
  const discountPercentage = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

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

  return (
    <motion.div 
      className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative overflow-hidden">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.images[0]}
            alt={getLocalizedName()}
            className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        {discountPercentage > 0 && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs sm:text-sm font-medium">
            -{discountPercentage}%
          </div>
        )}
        
        <button className="absolute top-2 sm:top-3 right-2 sm:right-3 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50">
          <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
        </button>
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide font-medium">
            {t(`categories.${product.category.toLowerCase()}`)}
          </span>
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
            <span className="text-xs sm:text-sm text-gray-600">
              {product.rating} ({product.reviews})
            </span>
          </div>
        </div>

        <Link to={`/product/${product.id}`}>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {getLocalizedName()}
          </h3>
        </Link>

        <p className="text-gray-600 text-xs sm:text-sm mb-4 line-clamp-2">
          {getLocalizedDescription()}
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="text-lg sm:text-xl font-bold text-gray-900">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs sm:text-sm text-gray-500 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          <motion.button
            onClick={() => onAddToCart(product)}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="whitespace-nowrap">{t('products.addToCart')}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
