import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Mail, Percent, Tag, TrendingUp, Users, Calendar } from 'lucide-react';
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
    conversions: 125
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
    conversions: 89
  }
];

export const MarketingTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState('coupons');
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);

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
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Marketing Tools</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage campaigns, coupons, and promotional activities</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {marketingStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
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
                  <Icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tabs */}
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'coupons', label: 'Coupons & Discounts', icon: Tag },
              { id: 'campaigns', label: 'Marketing Campaigns', icon: TrendingUp },
              { id: 'email', label: 'Email Marketing', icon: Mail },
              { id: 'analytics', label: 'Marketing Analytics', icon: Percent }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Coupons Tab */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Discount Coupons</h3>
                <button
                  onClick={() => setShowCouponModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Coupon</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3">Coupon Code</th>
                      <th className="px-6 py-3">Type</th>
                      <th className="px-6 py-3">Value</th>
                      <th className="px-6 py-3">Usage</th>
                      <th className="px-6 py-3">Valid Until</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((coupon) => (
                      <tr key={coupon.id} className="bg-white dark:bg-gray-900 border-b dark:border-gray-700">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900 dark:text-white">{coupon.code}</div>
                          <div className="text-sm text-gray-500">Min order: ${coupon.minOrder}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="capitalize text-gray-900 dark:text-white">{coupon.type}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-900 dark:text-white">
                            {coupon.usedCount} / {coupon.maxUses}
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(coupon.usedCount / coupon.maxUses) * 100}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-900 dark:text-white">
                            {new Date(coupon.endDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(coupon.status)}`}>
                            {coupon.status.charAt(0).toUpperCase() + coupon.status.slice(1)}
                          </span>
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
            </div>
          )}

          {/* Campaigns Tab */}
          {activeTab === 'campaigns' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Marketing Campaigns</h3>
                <button
                  onClick={() => setShowCampaignModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Campaign</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{campaign.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Type</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                          {campaign.type}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Reach</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {campaign.reach.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Clicks</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {campaign.clicks.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Conversions</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {campaign.conversions}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">CTR</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {((campaign.clicks / campaign.reach) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                        View Details
                      </button>
                      <button className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Email Marketing Tab */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email Marketing</h3>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="h-4 w-4" />
                  <span>Create Email Campaign</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Subscribers</h4>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">12,456</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    +234 new subscribers this month
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Mail className="h-8 w-8 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Open Rate</h4>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">24.5%</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Above industry average
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Click Rate</h4>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">3.2%</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    +0.5% from last month
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Email Campaigns</h4>
                <div className="space-y-3">
                  {[
                    { name: 'Weekly Newsletter #45', sent: '2024-01-15', opens: '1,234', clicks: '89' },
                    { name: 'New Product Announcement', sent: '2024-01-12', opens: '2,456', clicks: '234' },
                    { name: 'Flash Sale Alert', sent: '2024-01-10', opens: '3,789', clicks: '456' }
                  ].map((email, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded">
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white">{email.name}</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Sent: {email.sent}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900 dark:text-white">Opens: {email.opens}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Clicks: {email.clicks}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Marketing Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Campaign Performance</h4>
                  <div className="space-y-4">
                    {campaigns.map((campaign) => (
                      <div key={campaign.id} className="flex items-center justify-between">
                        <span className="text-sm text-gray-900 dark:text-white">{campaign.name}</span>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {((campaign.conversions / campaign.clicks) * 100).toFixed(1)}% CVR
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Coupon Usage</h4>
                  <div className="space-y-4">
                    {coupons.map((coupon) => (
                      <div key={coupon.id} className="flex items-center justify-between">
                        <span className="text-sm text-gray-900 dark:text-white">{coupon.code}</span>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {((coupon.usedCount / coupon.maxUses) * 100).toFixed(0)}% used
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};