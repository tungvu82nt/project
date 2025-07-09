import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Upload, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { products } from '../../data/products';
import { Product } from '../../types';

export const ProductManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
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
            onClick={() => setShowAddModal(true)}
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
          { label: 'Total Products', value: products.length, color: 'blue' },
          { label: 'In Stock', value: products.filter(p => p.inStock).length, color: 'green' },
          { label: 'Out of Stock', value: products.filter(p => !p.inStock).length, color: 'red' },
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
              {filteredProducts.map((product) => (
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
                      <button className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing {filteredProducts.length} of {products.length} products
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
    </div>
  );
};