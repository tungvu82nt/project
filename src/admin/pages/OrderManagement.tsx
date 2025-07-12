import React, { useState } from 'react';
import { Search, Filter, Eye, Truck, CheckCircle, XCircle, Clock, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { orders } from '../../data/orders';
import { OrderService } from '../../services/OrderService';
import { useNotificationContext } from '../../contexts/NotificationContext';

export const OrderManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [ordersData, setOrdersData] = useState(orders);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const { addNotification } = useNotificationContext();

  const statusOptions = ['All', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  const filteredOrders = ordersData.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Handle order status update
  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setIsUpdating(orderId);
    try {
      // For demo data, we'll just update the local state
      // In production, we would call the API
      if (process.env.NODE_ENV === 'production') {
        // Call API to update order status
        await OrderService.updateOrderStatus(orderId, newStatus);
      } else {
        // Simulate API call delay for demo
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Update local state
      setOrdersData(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus }
            : order
        )
      );
      
      // Show success notification
      addNotification({
        type: 'success',
        title: 'Order Updated',
        message: `Order ${orderId} status has been updated to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
        duration: 3000
      });
    } catch (error) {
      console.error('Failed to update order status:', error);
      
      // Show error notification
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: `Failed to update order ${orderId}. Please try again.`,
        duration: 5000
      });
    } finally {
      setIsUpdating(null);
    }
  };

  // Handle view order details
  const handleViewOrder = async (orderId: string) => {
    try {
      // Show loading notification
      addNotification({
        type: 'info',
        title: 'Loading Order Details',
        message: `Fetching details for order ${orderId}...`,
        duration: 2000
      });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // In a real app, this would navigate to order details page or open a modal
      // For demo, we'll just show a success notification
      addNotification({
        type: 'success',
        title: 'Order Details',
        message: `Order ${orderId} details loaded successfully`,
        duration: 3000
      });

      console.log(`Viewing order details for: ${orderId}`);
    } catch (error) {
      console.error('Failed to load order details:', error);
      
      addNotification({
        type: 'error',
        title: 'Load Failed',
        message: `Failed to load details for order ${orderId}. Please try again.`,
        duration: 5000
      });
    }
  };

  const orderStats = [
    { label: 'Total Orders', value: ordersData.length, color: 'blue' },
    { label: 'Pending', value: ordersData.filter(o => o.status === 'pending').length, color: 'yellow' },
    { label: 'Processing', value: ordersData.filter(o => o.status === 'processing').length, color: 'blue' },
    { label: 'Delivered', value: ordersData.filter(o => o.status === 'delivered').length, color: 'green' }
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Order Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Track and manage customer orders</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {orderStats.map((stat, index) => (
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
                {getStatusIcon(stat.label.toLowerCase())}
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
              placeholder="Search orders by ID or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status === 'All' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Filter className="h-4 w-4" />
            <span>More Filters</span>
          </button>
        </div>
      </motion.div>

      {/* Orders Table */}
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
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="bg-white dark:bg-gray-900 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{order.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{order.customerName}</div>
                      <div className="text-gray-500 dark:text-gray-400 text-sm">{order.customerEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">${order.total}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 dark:text-white">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        data-testid={`view-order-${order.id}`}
                        title={`View details for order ${order.id}`}
                        onClick={() => handleViewOrder(order.id)}
                        disabled={isUpdating === order.id}
                        className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <select 
                        className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:bg-gray-800 dark:text-white disabled:opacity-50"
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        disabled={isUpdating === order.id}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
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
              Showing {filteredOrders.length} of {ordersData.length} orders
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