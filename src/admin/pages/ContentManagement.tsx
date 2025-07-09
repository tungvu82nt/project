import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Upload, Save, X, Image, Type, Layout, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContentItem {
  id: string;
  title: string;
  type: 'banner' | 'page' | 'blog' | 'faq';
  status: 'published' | 'draft' | 'archived';
  lastModified: string;
  author: string;
}

const contentItems: ContentItem[] = [
  {
    id: '1',
    title: 'Homepage Hero Banner',
    type: 'banner',
    status: 'published',
    lastModified: '2024-01-15',
    author: 'Admin User'
  },
  {
    id: '2',
    title: 'About Us Page',
    type: 'page',
    status: 'published',
    lastModified: '2024-01-14',
    author: 'Content Manager'
  },
  {
    id: '3',
    title: 'New Product Launch Blog',
    type: 'blog',
    status: 'draft',
    lastModified: '2024-01-13',
    author: 'Marketing Team'
  },
  {
    id: '4',
    title: 'Shipping FAQ',
    type: 'faq',
    status: 'published',
    lastModified: '2024-01-12',
    author: 'Support Team'
  }
];

export const ContentManagement: React.FC = () => {
  const [selectedType, setSelectedType] = useState('all');
  const [showEditor, setShowEditor] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [editorContent, setEditorContent] = useState('');

  const contentTypes = ['all', 'banner', 'page', 'blog', 'faq'];

  const filteredContent = contentItems.filter(item => 
    selectedType === 'all' || item.type === selectedType
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'banner': return <Image className="h-4 w-4" />;
      case 'page': return <Layout className="h-4 w-4" />;
      case 'blog': return <Type className="h-4 w-4" />;
      case 'faq': return <Settings className="h-4 w-4" />;
      default: return <Layout className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleEdit = (item: ContentItem) => {
    setEditingItem(item);
    setEditorContent(`# ${item.title}\n\nContent for ${item.title}...`);
    setShowEditor(true);
  };

  const handleSave = () => {
    // Save content logic here
    console.log('Saving content:', editorContent);
    setShowEditor(false);
    setEditingItem(null);
  };

  const contentStats = [
    { label: 'Total Content', value: contentItems.length, color: 'blue' },
    { label: 'Published', value: contentItems.filter(c => c.status === 'published').length, color: 'green' },
    { label: 'Drafts', value: contentItems.filter(c => c.status === 'draft').length, color: 'yellow' },
    { label: 'This Month', value: 8, color: 'purple' }
  ];

  if (showEditor) {
    return (
      <div className="space-y-6">
        {/* Editor Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {editingItem ? 'Edit Content' : 'Create Content'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {editingItem ? `Editing: ${editingItem.title}` : 'Create new content'}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowEditor(false)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* Content Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center space-x-4">
                  <button className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm font-medium">
                    Visual
                  </button>
                  <button className="px-3 py-1 text-gray-600 dark:text-gray-400 rounded text-sm">
                    HTML
                  </button>
                  <div className="flex items-center space-x-2 ml-auto">
                    <button className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                      <Upload className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <textarea
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                  className="w-full h-96 border-0 resize-none focus:ring-0 dark:bg-gray-900 dark:text-white"
                  placeholder="Start writing your content..."
                />
              </div>
            </div>
          </div>

          {/* Settings Panel */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Publish Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Publish Date
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">SEO Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    placeholder="SEO title..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    placeholder="SEO description..."
                  />
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Featured Image</h3>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click to upload or drag and drop
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your website content and pages</p>
        </div>
        <button
          onClick={() => setShowEditor(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create Content</span>
        </button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {contentStats.map((stat, index) => (
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
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          >
            {contentTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Content' : type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Content List */}
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
                <th className="px-6 py-3">Content</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Author</th>
                <th className="px-6 py-3">Last Modified</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContent.map((item) => (
                <tr key={item.id} className="bg-white dark:bg-gray-900 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-gray-600 dark:text-gray-400">
                        {getTypeIcon(item.type)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{item.title}</div>
                        <div className="text-gray-500 dark:text-gray-400 text-sm">ID: {item.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs capitalize">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 dark:text-white">{item.author}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 dark:text-white">
                      {new Date(item.lastModified).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded"
                      >
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
      </motion.div>
    </div>
  );
};