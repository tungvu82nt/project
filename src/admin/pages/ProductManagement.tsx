import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Upload, Download, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../../types';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { productService } from '../../services/ProductService';

export const ProductManagement: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    images: [''],
    inStock: true,
    featured: false,
    tags: [] as string[],
    specifications: {} as Record<string, string>
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Load products from service
  const loadProducts = async () => {
    try {
      setIsLoadingData(true);
      const data = await productService.getAllProducts();
      setProductsList(data);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error(t('admin.productLoadError'));
    } finally {
      setIsLoadingData(false);
    }
  };

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  const categories = ['All', ...Array.from(new Set(productsList.map(p => p.category)))];

  const filteredProducts = productsList.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const handleViewProduct = async (productId: string) => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Viewing product:', productId);
      // Navigate to product detail or open modal
      window.open(`/products/${productId}`, '_blank');
    } catch (error) {
      console.error('Error viewing product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = async (productId: string) => {
    const product = productsList.find(p => p.id === productId);
    if (product) {
      handleEdit(product);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const product = await productService.getProductById(productId);
      if (!product) {
        toast.error(t('admin.productNotFound'));
        return;
      }
      
      const confirmed = window.confirm(
        `${t('admin.confirmDeleteProduct')} "${product.name}"?\n${t('admin.actionCannotBeUndone')}`
      );
      if (!confirmed) return;
      
      setIsLoading(true);
      await productService.deleteProduct(productId);
      
      toast.success(t('admin.productDeletedSuccess'));
      await loadProducts(); // Refresh products list
      
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(t('admin.productDeleteError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleStockToggle = async (productId: string) => {
    try {
      const product = await productService.getProductById(productId);
      if (!product) {
        toast.error(t('admin.productNotFound'));
        return;
      }
      
      setIsLoading(true);
      await productService.updateProduct(productId, { inStock: !product.inStock });
      
      toast.success(
        product.inStock 
          ? t('admin.productMarkedOutOfStock') 
          : t('admin.productMarkedInStock')
      );
      
      await loadProducts(); // Refresh products list
      
    } catch (error) {
      console.error('Error updating product stock:', error);
      toast.error(t('admin.productStockUpdateError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeaturedToggle = async (productId: string) => {
    try {
      const product = await productService.getProductById(productId);
      if (!product) {
        toast.error(t('admin.productNotFound'));
        return;
      }
      
      setIsLoading(true);
      await productService.updateProduct(productId, { featured: !product.featured });
      
      toast.success(
        product.featured 
          ? t('admin.productRemovedFromFeatured') 
          : t('admin.productAddedToFeatured')
      );
      
      await loadProducts(); // Refresh products list
      
    } catch (error) {
      console.error('Error updating product featured status:', error);
      toast.error(t('admin.productFeaturedUpdateError'));
    } finally {
      setIsLoading(false);
    }
  };

  // Form handling functions
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: '',
      images: [''],
      inStock: true,
      featured: false,
      tags: [],
      specifications: {}
    });
    setFormErrors({});
    setEditingProduct(null);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = t('admin.productNameRequired');
    }
    
    if (!formData.description.trim()) {
      errors.description = t('admin.productDescriptionRequired');
    }
    
    if (!formData.price.trim()) {
      errors.price = t('admin.productPriceRequired');
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      errors.price = t('admin.productPriceInvalid');
    }
    
    if (!formData.category.trim()) {
      errors.category = t('admin.productCategoryRequired');
    }
    
    if (!formData.images[0]?.trim()) {
      errors.images = t('admin.productImageRequired');
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index: number) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, images: newImages }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);
      
      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        category: formData.category,
        images: formData.images.filter(img => img.trim()),
        inStock: formData.inStock,
        featured: formData.featured,
        tags: formData.tags,
        specifications: formData.specifications
      };
      
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, productData);
        toast.success(t('admin.productUpdatedSuccess'));
      } else {
        await productService.createProduct(productData);
        toast.success(t('admin.productCreatedSuccess'));
      }
      
      await loadProducts(); // Refresh products list
      handleCloseModal();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(t('admin.productSaveError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      category: product.category,
      images: product.images.length > 0 ? product.images : [''],
      inStock: product.inStock,
      featured: product.featured || false,
      tags: product.tags || [],
      specifications: product.specifications || {}
    });
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Product Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your product catalog and inventory</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Upload className="h-4 w-4" />
            <span>Import</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button 
            onClick={handleAddNew}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Products', value: productsList.length, color: 'blue' },
          { label: 'In Stock', value: productsList.filter(p => p.inStock).length, color: 'green' },
          { label: 'Out of Stock', value: productsList.filter(p => !p.inStock).length, color: 'red' },
          { label: 'Categories', value: categories.length - 1, color: 'purple' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900 rounded-full flex items-center justify-center`}>
                <div className={`w-6 h-6 bg-${stat.color}-600 rounded`}></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Filter className="h-4 w-4" />
            <span>More Filters</span>
          </button>
        </div>
      </motion.div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <motion.div
          className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg border border-blue-200 dark:border-blue-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-blue-800 dark:text-blue-200">
              {selectedProducts.length} product(s) selected
            </span>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                Bulk Edit
              </button>
              <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                Delete Selected
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Products Table */}
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3">Rating</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingData ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <p className="text-gray-500 dark:text-gray-400">{t('admin.loadingProducts')}</p>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400">{t('admin.noProductsFound')}</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                <tr key={product.id} className="bg-white dark:bg-gray-900 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                        <div className="text-gray-500 dark:text-gray-400 text-sm">ID: {product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">${product.price}</div>
                    {product.originalPrice && (
                      <div className="text-gray-500 dark:text-gray-400 text-sm line-through">
                        ${product.originalPrice}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.inStock 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-gray-900 dark:text-white">{product.rating}</span>
                      <span className="text-gray-500 dark:text-gray-400">({product.reviews})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        data-testid={`view-product-${product.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors duration-200"
                        title="View Product"
                        onClick={() => handleViewProduct(product.id)}
                        disabled={isLoading}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        data-testid={`edit-product-${product.id}`}
                        className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg transition-colors duration-200"
                        title="Edit Product"
                        onClick={() => handleEditProduct(product.id)}
                        disabled={isLoading}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        data-testid={`toggle-stock-${product.id}`}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                          product.inStock
                            ? 'text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-900'
                            : 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900'
                        }`}
                        title={product.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
                        onClick={() => handleStockToggle(product.id)}
                        disabled={isLoading}
                      >
                        {product.inStock ? (
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        )}
                      </button>
                      <button 
                        data-testid={`toggle-featured-${product.id}`}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                          product.featured
                            ? 'text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900'
                            : 'text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-900'
                        }`}
                        title={product.featured ? 'Remove from Featured' : 'Add to Featured'}
                        onClick={() => handleFeaturedToggle(product.id)}
                        disabled={isLoading}
                      >
                        {product.featured ? (
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        )}
                      </button>
                      <button 
                        data-testid={`delete-product-${product.id}`}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors duration-200"
                        title="Delete Product"
                        onClick={() => handleDeleteProduct(product.id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing {filteredProducts.length} of {productsList.length} products
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Previous
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingProduct ? t('admin.editProduct') : t('admin.addProduct')}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.productName')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t('admin.enterProductName')}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.category')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">{t('admin.selectCategory')}</option>
                    {categories.filter(cat => cat !== 'All').map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {formErrors.category && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.price')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                  {formErrors.price && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
                  )}
                </div>

                {/* Original Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.originalPrice')}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {t('admin.originalPriceHint')}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('admin.description')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('admin.enterProductDescription')}
                />
                {formErrors.description && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                )}
              </div>

              {/* Product Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('admin.productImages')} <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      {image && (
                        <img
                          src={image}
                          alt={`Product preview ${index + 1}`}
                          className="h-16 w-16 rounded-lg object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="flex-1">
                        <input
                          type="url"
                          value={image}
                          onChange={(e) => handleImageChange(index, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`${t('admin.imageUrl')} ${index + 1}`}
                        />
                      </div>
                      {formData.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageField(index)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addImageField}
                    className="flex items-center space-x-2 px-3 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t('admin.addImage')}</span>
                  </button>
                </div>
                {formErrors.images && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.images}</p>
                )}
              </div>

              {/* Stock Status and Featured */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => handleInputChange('inStock', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {t('admin.inStock')}
                    </span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => handleInputChange('featured', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {t('admin.featuredProduct')}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleCloseModal}
                disabled={isLoading}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {t('common.cancel')}
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                )}
                {isLoading
                  ? t('common.saving')
                  : editingProduct
                  ? t('admin.updateProduct')
                  : t('admin.createProduct')
                }
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};