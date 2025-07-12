# Component Improvements với Data-TestId Attributes

## 1. ProductCard Component Improvements

### File: `src/components/Product/ProductCard.tsx`

```typescript
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
      data-testid={`product-card-${product.id}`}
      data-product-id={product.id}
      data-product-name={getLocalizedName()}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative overflow-hidden">
        <Link 
          to={`/product/${product.id}`}
          data-testid={`product-link-${product.id}`}
        >
          <img
            src={product.images[0]}
            alt={getLocalizedName()}
            className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            data-testid={`product-image-${product.id}`}
          />
        </Link>
        
        {discountPercentage > 0 && (
          <div 
            className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs sm:text-sm font-medium"
            data-testid={`discount-badge-${product.id}`}
          >
            -{discountPercentage}%
          </div>
        )}
        
        <button 
          className="absolute top-2 sm:top-3 right-2 sm:right-3 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50"
          data-testid={`wishlist-button-${product.id}`}
          aria-label="Add to wishlist"
        >
          <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
        </button>
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <span 
            className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide font-medium"
            data-testid={`product-category-${product.id}`}
          >
            {t(`categories.${product.category.toLowerCase()}`)}
          </span>
          <div 
            className="flex items-center space-x-1"
            data-testid={`product-rating-${product.id}`}
          >
            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
            <span className="text-xs sm:text-sm text-gray-600">
              {product.rating} ({product.reviews})
            </span>
          </div>
        </div>

        <Link 
          to={`/product/${product.id}`}
          data-testid={`product-title-link-${product.id}`}
        >
          <h3 
            className="text-base sm:text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2"
            data-testid={`product-title-${product.id}`}
          >
            {getLocalizedName()}
          </h3>
        </Link>

        <p 
          className="text-gray-600 text-xs sm:text-sm mb-4 line-clamp-2"
          data-testid={`product-description-${product.id}`}
        >
          {getLocalizedDescription()}
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div 
            className="flex items-center space-x-2"
            data-testid={`product-price-${product.id}`}
          >
            <span 
              className="text-lg sm:text-xl font-bold text-gray-900"
              data-testid={`product-current-price-${product.id}`}
            >
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span 
                className="text-xs sm:text-sm text-gray-500 line-through"
                data-testid={`product-original-price-${product.id}`}
              >
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          <motion.button
            onClick={() => onAddToCart(product)}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
            data-testid={`add-to-cart-button-${product.id}`}
            data-product-id={product.id}
            data-product-name={getLocalizedName()}
            data-product-price={product.price}
            aria-label={`Add ${getLocalizedName()} to cart`}
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
```

## 2. Contact Form Improvements

### File: `src/pages/Contact.tsx` (Form Section)

```typescript
{/* Contact Form */}
<motion.div
  initial={{ opacity: 0, x: -30 }}
  whileInView={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.8 }}
  className="bg-white p-8 rounded-lg shadow-lg"
  data-testid="contact-form-container"
>
  <h2 
    className="text-2xl font-bold text-gray-900 mb-6"
    data-testid="contact-form-title"
  >
    {content.form.title}
  </h2>
  
  {submitted && (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg"
      data-testid="contact-form-success-message"
    >
      {content.form.success}
    </motion.div>
  )}
  
  <form 
    onSubmit={handleSubmit} 
    className="space-y-6"
    data-testid="contact-form"
    noValidate
  >
    <div data-testid="contact-name-field">
      <label 
        htmlFor="name" 
        className="block text-sm font-medium text-gray-700 mb-2"
        data-testid="contact-name-label"
      >
        {content.form.name}
      </label>
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        data-testid="contact-name-input"
        data-field="name"
        aria-label="Full name"
        placeholder="Enter your full name"
      />
    </div>
    
    <div data-testid="contact-email-field">
      <label 
        htmlFor="email" 
        className="block text-sm font-medium text-gray-700 mb-2"
        data-testid="contact-email-label"
      >
        {content.form.email}
      </label>
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        data-testid="contact-email-input"
        data-field="email"
        aria-label="Email address"
        placeholder="Enter your email address"
      />
    </div>
    
    <div data-testid="contact-subject-field">
      <label 
        htmlFor="subject" 
        className="block text-sm font-medium text-gray-700 mb-2"
        data-testid="contact-subject-label"
      >
        {content.form.subject}
      </label>
      <input
        type="text"
        id="subject"
        name="subject"
        value={formData.subject}
        onChange={handleChange}
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        data-testid="contact-subject-input"
        data-field="subject"
        aria-label="Subject"
        placeholder="Enter message subject"
      />
    </div>
    
    <div data-testid="contact-message-field">
      <label 
        htmlFor="message" 
        className="block text-sm font-medium text-gray-700 mb-2"
        data-testid="contact-message-label"
      >
        {content.form.message}
      </label>
      <textarea
        id="message"
        name="message"
        value={formData.message}
        onChange={handleChange}
        required
        rows={5}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        data-testid="contact-message-textarea"
        data-field="message"
        aria-label="Message"
        placeholder="Enter your message"
      ></textarea>
    </div>
    
    <motion.button
      type="submit"
      disabled={isSubmitting}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      data-testid="contact-submit-button"
      data-form="contact"
      aria-label="Send message"
    >
      {isSubmitting ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          <span data-testid="contact-submit-loading-text">{content.form.sending}</span>
        </>
      ) : (
        <>
          <Send className="h-5 w-5 mr-2" />
          <span data-testid="contact-submit-text">{content.form.send}</span>
        </>
      )}
    </motion.button>
  </form>
</motion.div>
```

## 3. Header Search Improvements

### File: `src/components/Layout/Header.tsx` (Search Section)

```typescript
{/* Desktop Search Bar */}
<div className="hidden xl:flex items-center flex-1 max-w-md mx-8">
  <div 
    className="relative w-full"
    data-testid="header-search-container"
  >
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => handleSearchChange(e.target.value)}
      placeholder={t('products.searchPlaceholder')}
      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      data-testid="header-search-input"
      data-search-type="header"
      aria-label="Search products"
      onKeyPress={(e) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
          // Navigate to products page with search
          window.location.href = `/products?search=${encodeURIComponent(searchTerm)}`;
        }
      }}
    />
  </div>
</div>

{/* Actions */}
<div className="flex items-center space-x-2 sm:space-x-4">
  {/* Mobile Search Toggle */}
  <button 
    onClick={() => setIsSearchOpen(!isSearchOpen)}
    className="p-2 text-gray-400 hover:text-gray-500 xl:hidden"
    data-testid="mobile-search-toggle"
    aria-label="Toggle search"
  >
    <Search className="h-5 w-5 sm:h-6 sm:w-6" />
  </button>
  
  {/* Cart */}
  <Link 
    to="/cart" 
    className="relative p-2 text-gray-400 hover:text-gray-500"
    data-testid="cart-link"
    aria-label={`Shopping cart with ${cartItemCount} items`}
  >
    <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
    {cartItemCount > 0 && (
      <motion.span 
        className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
        data-testid="cart-badge"
        data-cart-count={cartItemCount}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {cartItemCount > 99 ? '99+' : cartItemCount}
      </motion.span>
    )}
  </Link>

  {/* Mobile Search Bar */}
  <AnimatePresence>
    {isSearchOpen && (
      <motion.div
        className="xl:hidden pb-4"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        data-testid="mobile-search-container"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={t('products.searchPlaceholder')}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            data-testid="mobile-search-input"
            data-search-type="mobile"
            aria-label="Search products"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && searchTerm.trim()) {
                window.location.href = `/products?search=${encodeURIComponent(searchTerm)}`;
              }
            }}
          />
        </div>
      </motion.div>
    )}
  </AnimatePresence>
```

## 4. Products Page Search Improvements

### File: `src/pages/Products.tsx` (Search Section)

```typescript
{/* Search and Filter Bar */}
<motion.div
  className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6 sm:mb-8"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.1 }}
  data-testid="products-filter-container"
>
  {/* Top Row - Search and Mobile Filter Toggle */}
  <div className="flex flex-col sm:flex-row gap-4 mb-4 sm:mb-0">
    {/* Search */}
    <div 
      className="relative flex-1"
      data-testid="products-search-container"
    >
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        type="text"
        placeholder={t('products.searchPlaceholder')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
        data-testid="products-search-input"
        data-search-type="products-page"
        aria-label="Search products"
      />
    </div>

    {/* Mobile Filter Toggle */}
    <button
      onClick={() => setShowFilters(!showFilters)}
      className="sm:hidden flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      data-testid="mobile-filter-toggle"
      aria-label="Toggle filters"
    >
      <SlidersHorizontal className="h-4 w-4" />
      <span>Filters</span>
    </button>

    {/* View Mode Toggle */}
    <div 
      className="flex items-center space-x-2"
      data-testid="view-mode-toggle"
    >
      <button
        onClick={() => setViewMode('grid')}
        className={`p-2 rounded-lg ${
          viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
        }`}
        data-testid="grid-view-button"
        aria-label="Grid view"
      >
        <Grid className="h-4 w-4" />
      </button>
      <button
        onClick={() => setViewMode('list')}
        className={`p-2 rounded-lg ${
          viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
        }`}
        data-testid="list-view-button"
        aria-label="List view"
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  </div>

  {/* Desktop Filters */}
  <div 
    className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4"
    data-testid="desktop-filters"
  >
    {/* Category */}
    <select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      data-testid="category-filter"
      aria-label="Filter by category"
    >
      {categories.map(category => (
        <option key={category} value={category}>
          {category === 'All' ? t('common.all') : t(`categories.${category.toLowerCase()}`)}
        </option>
      ))}
    </select>

    {/* Price Range */}
    <div 
      className="flex items-center space-x-2"
      data-testid="price-filter"
    >
      <input
        type="range"
        min="0"
        max="1000"
        value={priceRange[1]}
        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
        className="flex-1"
        data-testid="price-range-slider"
        aria-label="Price range"
      />
      <span 
        className="text-sm text-gray-600 whitespace-nowrap"
        data-testid="price-range-display"
      >
        ${priceRange[0]} - ${priceRange[1]}
      </span>
    </div>

    {/* Sort */}
    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      data-testid="sort-filter"
      aria-label="Sort products"
    >
      <option value="name">{t('products.sortByName')}</option>
      <option value="price-low">Price: Low to High</option>
      <option value="price-high">Price: High to Low</option>
      <option value="rating">{t('products.sortByRating')}</option>
    </select>

    {/* Results Count */}
    <div 
      className="flex items-center text-sm text-gray-600"
      data-testid="results-count"
    >
      {filteredAndSortedProducts.length} of {products.length} products
    </div>
  </div>
```

## 5. Product Grid Improvements

### File: `src/pages/Products.tsx` (Product Grid Section)

```typescript
{/* Products Grid */}
<motion.div
  className={`grid gap-4 sm:gap-6 ${
    viewMode === 'grid' 
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
      : 'grid-cols-1'
  }`}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5, delay: 0.2 }}
  data-testid="products-grid"
  data-view-mode={viewMode}
  data-product-count={filteredAndSortedProducts.length}
>
  {filteredAndSortedProducts.length > 0 ? (
    filteredAndSortedProducts.map((product, index) => (
      <motion.div
        key={product.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        data-testid={`product-grid-item-${product.id}`}
        data-product-index={index}
      >
        <ProductCard 
          product={product} 
          onAddToCart={onAddToCart}
        />
      </motion.div>
    ))
  ) : (
    <motion.div
      className="col-span-full text-center py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      data-testid="no-products-message"
    >
      <div className="text-gray-400 mb-4">
        <Search className="h-16 w-16 mx-auto" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No products found
      </h3>
      <p className="text-gray-600">
        Try adjusting your search or filter criteria
      </p>
    </motion.div>
  )}
</motion.div>
```

## 6. Implementation Checklist

### ✅ Immediate Actions (High Priority)
1. **Add data-testid attributes** to all interactive elements
2. **Implement aria-labels** for accessibility
3. **Add data attributes** for product information
4. **Improve form validation** with better error handling

### ✅ Testing Improvements (Medium Priority)
1. **Create comprehensive test selectors** using multiple strategies
2. **Implement wait strategies** for dynamic content
3. **Add screenshot capabilities** for visual regression testing
4. **Create test data management** system

### ✅ Monitoring & Maintenance (Low Priority)
1. **Set up automated test runs** in CI/CD
2. **Create test reporting dashboard**
3. **Implement performance monitoring**
4. **Add accessibility testing**

## 7. Expected Benefits

### 🎯 Improved Test Reliability
- **95%+ success rate** for automated tests
- **Reduced flaky tests** through stable selectors
- **Better error reporting** with detailed context

### 🚀 Enhanced Development Workflow
- **Faster debugging** with clear element identification
- **Easier maintenance** with consistent naming conventions
- **Better collaboration** between developers and QA

### 📊 Better User Experience
- **Improved accessibility** with proper ARIA labels
- **Consistent interactions** across all components
- **Better error handling** and user feedback

Việc implement những cải thiện này sẽ giúp tăng đáng kể độ tin cậy của testing automation và cải thiện chất lượng tổng thể của website Yapee.