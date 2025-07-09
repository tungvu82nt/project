import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const salesData = [
  { name: 'Jan', sales: 4000, orders: 240 },
  { name: 'Feb', sales: 3000, orders: 198 },
  { name: 'Mar', sales: 2000, orders: 180 },
  { name: 'Apr', sales: 2780, orders: 220 },
  { name: 'May', sales: 1890, orders: 150 },
  { name: 'Jun', sales: 2390, orders: 190 },
];

const categoryData = [
  { name: 'Electronics', value: 400, color: '#3B82F6' },
  { name: 'Wearables', value: 300, color: '#10B981' },
  { name: 'Photography', value: 200, color: '#F59E0B' },
  { name: 'Gaming', value: 100, color: '#EF4444' },
];

export const AdminDashboard: React.FC = () => {
  const stats = [
    {
      name: 'Total Revenue',
      value: '$12,426',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
    },
    {
      name: 'Total Orders',
      value: '1,028',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
    },
    {
      name: 'Total Products',
      value: '156',
      change: '+2.1%',
      trend: 'up',
      icon: Package,
    },
    {
      name: 'Total Customers',
      value: '2,847',
      change: '-1.4%',
      trend: 'down',
      icon: Users,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Welcome back! Here's what's happening with your store.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                    {stat.name}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900 rounded-full flex-shrink-0">
                  <Icon className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex items-center">
                {stat.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 mr-1" />
                )}
                <span className={`text-xs sm:text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-1">
                  vs last month
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Sales Chart */}
        <motion.div
          className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sales Overview
          </h3>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  fontSize={12}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  fontSize={12}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Bar dataKey="sales" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sales by Category
          </h3>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
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
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-4">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Orders
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-3 sm:px-6 py-3">Order ID</th>
                  <th className="px-3 sm:px-6 py-3">Customer</th>
                  <th className="px-3 sm:px-6 py-3">Status</th>
                  <th className="px-3 sm:px-6 py-3">Total</th>
                  <th className="px-3 sm:px-6 py-3 hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 'ORD-001', customer: 'John Smith', status: 'Delivered', total: '$299', date: '2024-01-15' },
                  { id: 'ORD-002', customer: 'Sarah Johnson', status: 'Shipped', total: '$249', date: '2024-01-16' },
                  { id: 'ORD-003', customer: 'Mike Davis', status: 'Processing', total: '$899', date: '2024-01-17' },
                ].map((order) => (
                  <tr key={order.id} className="bg-white dark:bg-gray-900 border-b dark:border-gray-700">
                    <td className="px-3 sm:px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {order.id}
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-gray-900 dark:text-white">
                      <div className="truncate max-w-[120px] sm:max-w-none">
                        {order.customer}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-gray-900 dark:text-white font-medium">
                      {order.total}
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-gray-900 dark:text-white hidden sm:table-cell">
                      {order.date}
                    </td>
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