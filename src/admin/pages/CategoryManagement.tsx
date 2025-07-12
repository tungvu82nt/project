import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { categoryService } from '../../services/CategoryService';
import { Category } from '../../types';
import { Plus, Search, Edit, Trash2, Eye, Tag, Grid, X, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';



/**
 * Product category management component in admin panel
 * Provides CRUD functionality for categories
 */
export const CategoryManagement: React.FC = () => {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    parentId: '',
    status: 'active' as 'active' | 'inactive',
    image: ''
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const statusOptions = ['All', 'active', 'inactive'];

  /**
   * Load categories data from service
   */
  const loadCategories = async () => {
    try {
      setIsLoadingData(true);
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error(t('admin.categoryLoadError'));
    } finally {
      setIsLoadingData(false);
    }
  };

  /**
   * Load categories on component mount
   */
  useEffect(() => {
    loadCategories();
  }, []);

  /**
   * Filter categories by search keyword and status
   */
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || category.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  /**
   * Get parent category name
   */
  const getParentCategoryName = (parentId?: string) => {
    if (!parentId) return '-';
    const parent = categories.find(cat => cat.id === parentId);
    return parent ? parent.name : '-';
  };

  /**
   * Reset form data to initial state
   */
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      slug: '',
      parentId: '',
      status: 'active',
      image: ''
    });
    setFormErrors({});
  };

  /**
   * Validate form data
   */
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = t('admin.categoryNameRequired');
    }
    
    if (!formData.description.trim()) {
      errors.description = t('admin.categoryDescriptionRequired');
    }
    
    if (!formData.slug.trim()) {
      errors.slug = t('admin.categorySlugRequired');
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle form input changes
   */
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from name
    if (field === 'name') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      let result;
      
      if (editingCategory) {
        console.log('Updating category:', editingCategory.id, formData);
        result = await categoryService.updateCategory(editingCategory.id, formData);
      } else {
        console.log('Creating category:', formData);
        result = await categoryService.createCategory(formData);
      }
      
      if (result) {
        // Close modal and reset form
        setShowAddModal(false);
        resetForm();
        setEditingCategory(null);
        
        // Show success notification
        toast.success(editingCategory ? t('admin.categoryUpdatedSuccess') : t('admin.categoryCreatedSuccess'));
        
        // Refresh categories data
        await loadCategories();
      } else {
        throw new Error('Failed to save category');
      }
      
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(t('admin.categorySaveError'));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle category editing
   */
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      slug: category.slug,
      parentId: category.parentId || '',
      status: category.status,
      image: category.image || ''
    });
    setShowAddModal(true);
  };

  /**
   * Handle opening add modal
   */
  const handleAddNew = () => {
    setEditingCategory(null);
    resetForm();
    setShowAddModal(true);
  };

  /**
   * Handle modal close
   */
  const handleCloseModal = () => {
    setShowAddModal(false);
    resetForm();
    setEditingCategory(null);
  };

  /**
   * Handle category deletion
   */
  const handleDelete = async (categoryId: string) => {
    const category = await categoryService.getCategoryById(categoryId);
    if (!category) {
      toast.error(t('admin.categoryNotFound'));
      return;
    }
    
    const confirmed = window.confirm(
      `${t('admin.confirmDeleteCategory')} "${category.name}"?\n\n${t('admin.deleteWarning')}`
    );
    
    if (!confirmed) return;
    
    try {
      setIsLoading(true);
      
      console.log('Deleting category:', categoryId);
      const success = await categoryService.deleteCategory(categoryId);
      
      if (success) {
        // Show success message
        toast.success(`${t('admin.categoryDeletedSuccess')}: ${category.name}`);
        
        // Refresh categories data
        await loadCategories();
      } else {
        throw new Error('Failed to delete category');
      }
      
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(t('admin.categoryDeleteError'));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle category status toggle
   */
  const handleStatusToggle = async (categoryId: string) => {
    const category = await categoryService.getCategoryById(categoryId);
    if (!category) {
      toast.error(t('admin.categoryNotFound'));
      return;
    }
    
    const newStatus = category.status === 'active' ? 'inactive' : 'active';
    const confirmed = window.confirm(
      `${t('admin.confirmStatusChange')} "${category.name}" ${t('admin.to')} ${newStatus}?`
    );
    
    if (!confirmed) return;
    
    try {
      setIsLoading(true);
      
      console.log('Toggling status for category:', categoryId, 'to:', newStatus);
      const result = await categoryService.toggleStatus(categoryId);
      
      if (result) {
        // Show success message
        toast.success(`${t('admin.categoryStatusUpdated')}: ${category.name} -> ${newStatus}`);
        
        // Refresh categories data
        await loadCategories();
      } else {
        throw new Error('Failed to toggle category status');
      }
      
    } catch (error) {
      console.error('Error updating category status:', error);
      toast.error(t('admin.categoryStatusError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.categoryManagement')}</h1>
        <p className="text-gray-600">{t('admin.categoryDescription')}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddNew}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          {t('admin.addCategory')}
        </motion.button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
              type="text"
              placeholder={t('admin.searchCategories')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status === 'All' ? t('admin.allStatuses') :
            status === 'active' ? t('admin.active') : t('admin.inactive')}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.category')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.parentCategory')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.productCount')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.lastUpdated')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.map((category) => (
                <motion.tr
                  key={category.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {category.image && (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="h-10 w-10 rounded-lg object-cover mr-3"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {category.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {category.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getParentCategoryName(category.parentId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Grid className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">{category.productCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        category.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {category.status === 'active' ? t('admin.active') : t('admin.inactive')}
                      </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(category.updatedAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => console.log('View category:', category.id)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title={t('admin.viewDetails')}
                      >
                        <Eye className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(category)}
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                        title={t('admin.editCategory')}
                      >
                        <Edit className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleStatusToggle(category.id)}
                        className={`p-1 ${
                          category.status === 'active'
                            ? 'text-orange-600 hover:text-orange-900'
                            : 'text-green-600 hover:text-green-900'
                        }`}
                        title={category.status === 'active' ? t('admin.deactivate') : t('admin.activate')}
                        disabled={isLoading}
                      >
                        {category.status === 'active' ? (
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title={t('admin.deleteCategory')}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <Tag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
               {searchTerm || selectedStatus !== 'All'
                 ? t('admin.noMatchingCategories')
                 : t('admin.noCategories')}
             </h3>
            <p className="mt-1 text-sm text-gray-500">
               {searchTerm || selectedStatus !== 'All'
                 ? t('admin.tryDifferentFilters')
                 : t('admin.createFirstCategory')}
             </p>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Tag className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{t('admin.totalCategories')}</p>
              <p className="text-2xl font-semibold text-gray-900">{mockCategories.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Grid className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{t('admin.active')} {t('admin.categories')}</p>
              <p className="text-2xl font-semibold text-gray-900">
                {mockCategories.filter(cat => cat.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Grid className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{t('admin.totalProducts')}</p>
              <p className="text-2xl font-semibold text-gray-900">
                {mockCategories.reduce((sum, cat) => sum + cat.productCount, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingCategory ? t('admin.editCategory') : t('admin.addCategory')}
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
              {/* Category Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('admin.categoryName')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('admin.enterCategoryName')}
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>

              {/* Category Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('admin.categoryDescription')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('admin.enterCategoryDescription')}
                />
                {formErrors.description && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                )}
              </div>

              {/* Category Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('admin.categorySlug')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.slug ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('admin.enterCategorySlug')}
                />
                {formErrors.slug && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.slug}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {t('admin.slugAutoGenerated')}
                </p>
              </div>

              {/* Parent Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('admin.parentCategory')}
                </label>
                <select
                  value={formData.parentId}
                  onChange={(e) => handleInputChange('parentId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">{t('admin.selectParentCategory')}</option>
                  {mockCategories
                    .filter(cat => cat.id !== editingCategory?.id)
                    .map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('admin.status')}
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as 'active' | 'inactive')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">{t('admin.active')}</option>
                  <option value="inactive">{t('admin.inactive')}</option>
                </select>
              </div>

              {/* Category Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('admin.categoryImage')}
                </label>
                <div className="flex items-center space-x-4">
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Category preview"
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => handleInputChange('image', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={t('admin.enterImageUrl')}
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      {t('admin.imageUrlHint')}
                    </p>
                  </div>
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
                  : editingCategory
                  ? t('admin.updateCategory')
                  : t('admin.createCategory')
                }
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};