import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, Users, Download, Calendar, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const salesData = [
  { name: 'Jan', revenue: 45000, orders: 240, customers: 180 },
  { name: 'Feb', revenue: 38000, orders: 198, customers: 165 },
  { name: 'Mar', revenue: 52000, orders: 280, customers: 220 },
  { name: 'Apr', revenue: 48000, orders: 250, customers: 195 },
  { name: 'May', revenue: 61000, orders: 320, customers: 250 },
  { name: 'Jun', revenue: 55000, orders: 290, customers: 230 },
  { name: 'Jul', revenue: 67000, orders: 350, customers: 280 },
  { name: 'Aug', revenue: 59000, orders: 310, customers: 245 },
  { name: 'Sep', revenue: 71000, orders: 380, customers: 300 },
  { name: 'Oct', revenue: 64000, orders: 340, customers: 270 },
  { name: 'Nov', revenue: 78000, orders: 420, customers: 330 },
  { name: 'Dec', revenue: 82000, orders: 450, customers: 350 }
];

const categoryData = [
  { name: 'Electronics', value: 45, color: '#3B82F6', revenue: 125000 },
  { name: 'Wearables', value: 25, color: '#10B981', revenue: 75000 },
  { name: 'Photography', value: 20, color: '#F59E0B', revenue: 60000 },
  { name: 'Gaming', value: 10, color: '#EF4444', revenue: 30000 }
];

const topProducts = [
  { name: 'Premium Wireless Headphones', sales: 156, revenue: 46680, growth: 12.5 },
  { name: 'Smart Fitness Watch', sales: 89, revenue: 22161, growth: 8.2 },
  { name: 'Professional Camera Lens', sales: 67, revenue: 60233, growth: 15.3 },
  { name: 'Gaming Mechanical Keyboard', sales: 203, revenue: 32277, growth: -2.1 }
];

const customerSegments = [
  { segment: 'New Customers', count: 1250, percentage: 35, color: '#3B82F6' },
  { segment: 'Returning Customers', count: 1800, percentage: 50, color: '#10B981' },
  { segment: 'VIP Customers', count: 540, percentage: 15, color: '#F59E0B' }
];

export const AnalyticsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('12months');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleDateRangeChange = async (newRange: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setDateRange(newRange);
      console.log(`Date range changed to: ${newRange}`);
    } catch (error) {
      console.error('Error changing date range:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMetricChange = async (newMetric: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      setSelectedMetric(newMetric);
      console.log(`Metric changed to: ${newMetric}`);
    } catch (error) {
      console.error('Error changing metric:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportReport = async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Report exported successfully');
      alert('Report exported successfully!');
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Failed to export report. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const stats = [
    {
      name: 'Total Revenue',
      value: '$724,500',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      description: 'vs last period'
    },
    {
      name: 'Total Orders',
      value: '3,847',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      description: 'vs last period'
    },
    {
      name: 'Products Sold',
      value: '12,456',
      change: '+15.3%',
      trend: 'up',
      icon: Package,
      description: 'vs last period'
    },
    {
      name: 'Active Customers',
      value: '3,590',
      change: '+6.1%',
      trend: 'up',
      icon: Users,
      description: 'vs last period'
    }
  ];

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics & Reports</h1>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive business insights and performance metrics</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            data-testid="date-range-select"
            value={dateRange}
            onChange={(e) => handleDateRangeChange(e.target.value)}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="3months">Last 3 Months</option>
            <option value="12months">Last 12 Months</option>
          </select>
          
          <button 
            data-testid="export-report-btn"
            onClick={handleExportReport}
            disabled={isExporting}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            <span>{isExporting ? 'Exporting...' : 'Export Report'}</span>
          </button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {stat.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">{stat.description}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <motion.div
          className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Trend</h3>
            <select
              data-testid="metric-select"
              value={selectedMetric}
              onChange={(e) => handleMetricChange(e.target.value)}
              disabled={isLoading}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:bg-gray-800 dark:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="revenue">Revenue</option>
              <option value="orders">Orders</option>
              <option value="customers">Customers</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey={selectedMetric} 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Performance */}
        <motion.div
          className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sales by Category</h3>
          <div className="grid grid-cols-2 gap-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-3">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      ${item.revenue.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">{item.value}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <motion.div
          className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Performing Products</h3>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">{product.name}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {product.sales} units sold
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900 dark:text-white">
                      ${product.revenue.toLocaleString()}
                    </div>
                    <div className={`text-xs flex items-center ${
                      product.growth > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {product.growth > 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(product.growth)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Customer Segments */}
        <motion.div
          className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Customer Segments</h3>
            <div className="space-y-4">
              {customerSegments.map((segment) => (
                <div key={segment.segment} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {segment.segment}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {segment.count.toLocaleString()} ({segment.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${segment.percentage}%`,
                        backgroundColor: segment.color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Performance Metrics Table */}
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Metrics</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3">Metric</th>
                  <th className="px-6 py-3">Current Period</th>
                  <th className="px-6 py-3">Previous Period</th>
                  <th className="px-6 py-3">Change</th>
                  <th className="px-6 py-3">Target</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { metric: 'Conversion Rate', current: '3.2%', previous: '2.8%', change: '+14.3%', target: '3.5%', trend: 'up' },
                  { metric: 'Average Order Value', current: '$187', previous: '$172', change: '+8.7%', target: '$200', trend: 'up' },
                  { metric: 'Customer Acquisition Cost', current: '$45', previous: '$52', change: '-13.5%', target: '$40', trend: 'up' },
                  { metric: 'Return Rate', current: '2.1%', previous: '2.8%', change: '-25.0%', target: '<2%', trend: 'up' },
                  { metric: 'Customer Lifetime Value', current: '$890', previous: '$820', change: '+8.5%', target: '$1000', trend: 'up' }
                ].map((row) => (
                  <tr key={row.metric} className="bg-white dark:bg-gray-900 border-b dark:border-gray-700">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{row.metric}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{row.current}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{row.previous}</td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center ${
                        row.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {row.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {row.change}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{row.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};