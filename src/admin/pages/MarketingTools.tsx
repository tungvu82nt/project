import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Mail, Percent, Tag, TrendingUp, Users, Calendar, Search, Filter, Download, BarChart, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'expired';
}

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'banner' | 'social';
  status: 'active' | 'paused' | 'completed';
  startDate: string;
  endDate: string;
  reach: number;
  clicks: number;
  conversions: number;
  budget: number;
  spent: number;
}

const coupons: Coupon[] = [
  {
    id: '1',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minOrder: 50,
    maxUses: 100,
    usedCount: 45,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active'
  },
  {
    id: '2',
    code: 'FREESHIP',
    type: 'fixed',
    value: 15,
    minOrder: 100,
    maxUses: 500,
    usedCount: 234,
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    status: 'active'
  }
];

const campaigns: Campaign[] = [
  {
    id: '1',
    name: 'New Year Sale',
    type: 'email',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    reach: 5000,
    clicks: 750,
    conversions: 125,
    budget: 5000,
    spent: 3200
  },
  {
    id: '2',
    name: 'Product Launch Banner',
    type: 'banner',
    status: 'completed',
    startDate: '2024-01-15',
    endDate: '2024-01-22',
    reach: 12000,
    clicks: 1200,
    conversions: 89,
    budget: 7500,
    spent: 0
  },
  {
    id: '3',
    name: 'Summer Sale 2023',
    type: 'email',
    status: 'active',
    startDate: '2023-06-01',
    endDate: '2023-06-30',
    reach: 10000,
    clicks: 12500,
    conversions: 450,
    budget: 5000,
    spent: 3200
  },
  {
    id: '4',
    name: 'New Collection Launch',
    type: 'social',
    status: 'scheduled',
    startDate: '2023-07-15',
    endDate: '2023-07-30',
    reach: 0,
    clicks: 0,
    conversions: 0,
    budget: 7500,
    spent: 0
  },
  {
    id: '5',
    name: 'Holiday Season Promotion',
    type: 'email',
    status: 'draft',
    startDate: null,
    endDate: null,
    reach: 0,
    clicks: 0,
    conversions: 0,
    budget: 10000,
    spent: 0
  },
  {
    id: '6',
    name: 'Back to School Campaign',
    type: 'social',
    status: 'completed',
    startDate: '2023-08-01',
    endDate: '2023-08-15',
    reach: 9800,
    clicks: 4000,
    conversions: 320,
    budget: 4000,
    spent: 4000
  },
  {
    id: '7',
    name: 'Flash Sale Weekend',
    type: 'email',
    status: 'active',
    startDate: '2023-06-10',
    endDate: '2023-06-12',
    reach: 6200,
    clicks: 2500,
    conversions: 210,
    budget: 2500,
    spent: 1800
  }
];

export const MarketingTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState('coupons');
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const campaignTypes = ['All', ...Array.from(new Set(campaigns.map(campaign => campaign.type)))];
  const campaignStatuses = ['All', ...Array.from(new Set(campaigns.map(campaign => campaign.status)))];

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = 
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'All' || campaign.type === selectedType;
    const matchesStatus = selectedStatus === 'All' || campaign.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCampaigns.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);

  const handleSelectCampaign = (campaignId: string) => {
    setSelectedCampaigns(prev => 
      prev.includes(campaignId) 
        ? prev.filter(id => id !== campaignId)
        : [...prev, campaignId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCampaigns.length === currentItems.length && currentItems.length > 0) {
      setSelectedCampaigns([]);
    } else {
      setSelectedCampaigns(currentItems.map(campaign => campaign.id));
    }
  };

  const handleViewCampaign = (campaignId: string) => {
    console.log('View campaign:', campaignId);
  };

  const handleEditCampaign = (campaignId: string) => {
    console.log('Edit campaign:', campaignId);
  };

  const handleDeleteCampaign = (campaignId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chiến dịch này không?')) {
      console.log('Delete campaign:', campaignId);
    }
  };

  const handleAddCampaign = () => {
    console.log('Add new campaign');
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedCampaigns.length} chiến dịch đã chọn không?`)) {
      console.log('Delete selected campaigns:', selectedCampaigns);
      setSelectedCampaigns([]);
    }
  };

  const handleExportCampaigns = () => {
    console.log('Export campaigns');
  };

  const handleViewAnalytics = (campaignId: string) => {
    console.log('View analytics for campaign:', campaignId);
  };

  const handleShareCampaign = (campaignId: string) => {
    console.log('Share campaign:', campaignId);
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

  const marketingStats = [
    { label: 'Active Campaigns', value: campaigns.filter(c => c.status === 'active').length, color: 'blue', icon: TrendingUp },
    { label: 'Active Coupons', value: coupons.filter(c => c.status === 'active').length, color: 'green', icon: Tag },
    { label: 'Email Subscribers', value: '12,456', color: 'purple', icon: Mail },
    { label: 'Conversion Rate', value: '3.2%', color: 'orange', icon: Percent }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'expired': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Marketing Tools</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your marketing campaigns</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleExportCampaigns}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button 
            onClick={handleAddCampaign}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Campaign</span>
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {marketingStats.map((stat, index) => (
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
              placeholder="Search campaigns..."
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
            {campaignTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          >
            {campaignStatuses.map(status => (
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
                  Date Range
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
                  Budget Range
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sort By
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white">
                  <option value="nameAsc">Name: A to Z</option>
                  <option value="nameDesc">Name: Z to A</option>
                  <option value="dateDesc">Start Date: Newest</option>
                  <option value="dateAsc">Start Date: Oldest</option>
                  <option value="budgetDesc">Budget: High to Low</option>
                  <option value="budgetAsc">Budget: Low to High</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Bulk Actions */}
      {selectedCampaigns.length > 0 && (
        <motion.div
          className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg border border-blue-200 dark:border-blue-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-blue-800 dark:text-blue-200">
              {selectedCampaigns.length} campaign(s) selected
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

      {/* Campaigns Table */}
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
                    checked={selectedCampaigns.length === currentItems.length && currentItems.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3">Campaign</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Dates</th>
                <th className="px-6 py-3">Budget</th>
                <th className="px-6 py-3">Performance</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((campaign) => (
                <tr key={campaign.id} className="bg-white dark:bg-gray-900 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedCampaigns.includes(campaign.id)}
                      onChange={() => handleSelectCampaign(campaign.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{campaign.name}</div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">ID: {campaign.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {campaign.type === 'email' ? (
                        <Mail className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      ) : (
                        <Share2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      )}
                      <span className="text-gray-900 dark:text-white">{campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">
                          {campaign.startDate ? campaign.startDate : 'Not set'}
                        </span>
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs">
                        to {campaign.endDate ? campaign.endDate : 'Not set'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">
                      ${campaign.budget.toLocaleString()}
                    </div>
                    {campaign.spent > 0 && (
                      <div className="text-gray-500 dark:text-gray-400 text-xs">
                        Spent: ${campaign.spent.toLocaleString()} ({Math.round((campaign.spent / campaign.budget) * 100)}%)
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-gray-900 dark:text-white text-xs">
                        Clicks: {campaign.clicks.toLocaleString()}
                      </div>
                      <div className="text-gray-900 dark:text-white text-xs">
                        Conversions: {campaign.conversions.toLocaleString()}
                      </div>
                      {campaign.clicks > 0 && (
                        <div className="text-gray-500 dark:text-gray-400 text-xs">
                          Rate: {((campaign.conversions / campaign.clicks) * 100).toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded"
                        onClick={() => handleViewAnalytics(campaign.id)}
                      >
                        <BarChart className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded"
                        onClick={() => handleEditCampaign(campaign.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-1 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900 rounded"
                        onClick={() => handleShareCampaign(campaign.id)}
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                        onClick={() => handleDeleteCampaign(campaign.id)}
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

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredCampaigns.length)} of {filteredCampaigns.length} campaigns
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