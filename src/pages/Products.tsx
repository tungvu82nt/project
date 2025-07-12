import React, { useState, useMemo } from 'react';
import { Search, Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from '../components';
import { products } from '../data/products';
import { Product } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface ProductsProps {
  onAddToCart: (product: Product) => void;
}

export const Products: React.FC<ProductsProps> = ({ onAddToCart }) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [searchTerm, selectedCategory, priceRange, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Header */}
      <motion.div
        className="mb-6 sm:mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
          {t('products.title')}
        </h1>
        <p className="text-base sm:text-xl text-gray-600">
          Discover our complete collection of premium electronics and accessories.
        </p>
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div
        className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6 sm:mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Top Row - Search and Mobile Filter Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4 sm:mb-0">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('products.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Desktop Filters */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'All' ? t('common.all') : t(`categories.${category.toLowerCase()}`)}
              </option>
            ))}
          </select>

          {/* Price Range */}
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="flex-1"
            />
            <span className="text-sm text-gray-600 whitespace-nowrap">
              ${priceRange[0]} - ${priceRange[1]}
            </span>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="name">{t('products.sortByName')}</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">{t('products.sortByRating')}</option>
          </select>

          {/* Results Count */}
          <div className="flex items-center text-sm text-gray-600">
            {filteredAndSortedProducts.length} of {products.length} products
          </div>
        </div>

        {/* Mobile Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="sm:hidden mt-4 space-y-4"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Category */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'All' ? t('common.all') : t(`categories.${category.toLowerCase()}`)}
                  </option>
                ))}
              </select>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">{t('products.sortByName')}</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">{t('products.sortByRating')}</option>
              </select>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Results Count - Mobile */}
      <motion.div
        className="sm:hidden mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <p className="text-sm text-gray-600">
          Showing {filteredAndSortedProducts.length} of {products.length} products
        </p>
      </motion.div>

      {/* Products Grid */}
      <motion.div
        className={`grid gap-4 sm:gap-6 lg:gap-8 ${
          viewMode === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {filteredAndSortedProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <ProductCard product={product} onAddToCart={onAddToCart} />
          </motion.div>
        ))}
      </motion.div>

      {/* No Results */}
      {filteredAndSortedProducts.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('products.noResults')}</h3>
          <p className="text-gray-600">Try adjusting your filters or search terms.</p>
        </motion.div>
      )}
    </div>
  );
};