import React, { useState } from 'react';
import { Search, Filter, Edit, Trash2, Eye, Plus, FileText, Calendar, Image, Layout, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContentItem {
  id: string;
  title: string;
  type: 'banner' | 'page' | 'blog' | 'faq' | 'Blog Post' | 'Article' | 'Announcement' | 'Page';
  status: 'published' | 'draft' | 'archived' | 'Scheduled' | 'Published' | 'Draft';
  lastModified: string;
  author: string;
  publishDate?: string | null;
  category?: string;
  views: number;
  likes: number;
}

const contentItems: ContentItem[] = [
  {
    id: '1',
    title: 'Homepage Hero Banner',
    type: 'banner',
    status: 'published',
    lastModified: '2024-01-15',
    author: 'Admin User',
    publishDate: '2023-06-15',
    category: 'Fashion',
    views: 1245,
    likes: 89
  },
  {
    id: '2',
    title: 'About Us Page',
    type: 'page',
    status: 'published',
    lastModified: '2024-01-14',
    author: 'Content Manager',
    publishDate: '2023-05-28',
    category: 'Guides',
    views: 2367,
    likes: 156
  },
  {
    id: '3',
    title: 'New Product Launch Blog',
    type: 'blog',
    status: 'draft',
    lastModified: '2024-01-13',
    author: 'Marketing Team',
    publishDate: null,
    category: 'Fashion',
    views: 0,
    likes: 0
  },
  {
    id: '4',
    title: 'Shipping FAQ',
    type: 'faq',
    status: 'published',
    lastModified: '2024-01-12',
    author: 'Support Team',
    publishDate: '2023-04-10',
    category: 'Help',
    views: 987,
    likes: 42
  },
  {
    id: '5',
    title: 'Summer Sale Announcement',
    type: 'Announcement',
    status: 'Scheduled',
    lastModified: '2024-01-11',
    author: 'David Brown',
    publishDate: '2023-07-01',
    category: 'Promotions',
    views: 0,
    likes: 0
  }
];

export const ContentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedContents, setSelectedContents] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const contentTypes = ['All', ...Array.from(new Set(contentItems.map(item => item.type)))];
  const contentStatuses = ['All', ...Array.from(new Set(contentItems.map(item => item.status)))];

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'All' || item.type === selectedType;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredContent.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredContent.length / itemsPerPage);

  const handleSelectContent = (contentId: string) => {
    setSelectedContents(prev => 
      prev.includes(contentId) 
        ? prev.filter(id => id !== contentId)
        : [...prev, contentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedContents.length === currentItems.length && currentItems.length > 0) {
      setSelectedContents([]);
    } else {
      setSelectedContents(currentItems.map(item => item.id));
    }
  };

  const handleViewContent = (contentId: string) => {
    console.log('View content:', contentId);
  };

  const handleEditContent = (contentId: string) => {
    console.log('Edit content:', contentId);
  };

  const handleDeleteContent = (contentId: string) => {
    console.log('Delete content:', contentId);
  };

  const handleAddContent = () => {
    console.log('Add new content');
  };

  const handleDeleteSelected = () => {
    console.log('Delete selected content:', selectedContents);
    setSelectedContents([]);
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const contentStats = [
    { 
      label: 'Total Content', 
      value: contentItems.length,
      color: 'blue'
    },
    { 
      label: 'Published', 
      value: contentItems.filter(item => item.status === 'published').length,
      color: 'green'
    },
    { 
      label: 'Drafts', 
      value: contentItems.filter(item => item.status === 'draft').length,
      color: 'yellow'
    },
    { 
      label: 'Scheduled', 
      value: contentItems.filter(item => item.status === 'Scheduled').length,
      color: 'purple'
    }
  ];

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'banner': return <Image className="h-4 w-4" />;
      case 'page': return <Layout className="h-4 w-4" />;
      case 'blog': return <FileText className="h-4 w-4" />;
      case 'faq': return <Settings className="h-4 w-4" />;
      case 'Blog Post': return <FileText className="h-4 w-4" />;
      case 'Article': return <FileText className="h-4 w-4" />;
      case 'Page': return <Layout className="h-4 w-4" />;
      case 'Announcement': return <Calendar className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'Scheduled': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your website content</p>
        </div>
        <button 
          onClick={handleAddContent}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Content</span>
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          >
            {contentTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          >
            {contentStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <button 
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            onClick={handleToggleFilters}
          >
            <Filter className="h-4 w-4" />
            <span>More Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Publish Date
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Author
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white">
                  <option value="">All Authors</option>
                  {Array.from(new Set(contentItems.map(item => item.author))).map(author => (
                    <option key={author} value={author}>{author}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white">
                  <option value="">All Categories</option>
                  {Array.from(new Set(contentItems.map(item => item.category))).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {selectedContents.length > 0 && (
        <motion.div
          className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg border border-blue-200 dark:border-blue-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-blue-800 dark:text-blue-200">
              {selectedContents.length} item(s) selected
            </span>
            <div className="flex space-x-2">
              <button 
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                onClick={handleDeleteSelected}
              >
                Delete Selected
              </button>
            </div>
          </div>
        </motion.div>
      )}

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
                    checked={selectedContents.length === currentItems.length && currentItems.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Author</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Stats</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.id} className="bg-white dark:bg-gray-900 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedContents.includes(item.id)}
                      onChange={() => handleSelectContent(item.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{item.title}</div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">ID: {item.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getContentTypeIcon(item.type)}
                      <span className="text-gray-900 dark:text-white">{item.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 dark:text-white">{item.author}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 dark:text-white">
                      {item.publishDate ? item.publishDate : 'Not published'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">{item.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <svg className="h-3 w-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm1-6a1 1 0 11-2 0 1 1 0 012 0zm-1-4a1 1 0 00-1 1v2a1 1 0 102 0V7a1 1 0 00-1-1z" clipRule="evenodd" fillRule="evenodd"></path>
                        </svg>
                        <span className="text-gray-900 dark:text-white">{item.likes}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded"
                        onClick={() => handleViewContent(item.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded"
                        onClick={() => handleEditContent(item.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                        onClick={() => handleDeleteContent(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredContent.length)} of {filteredContent.length} items
            </div>
            <div className="flex space-x-2">
              <button 
                className={`px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                {currentPage}
              </button>
              <button 
                className={`px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};