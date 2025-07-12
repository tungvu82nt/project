import React, { useState } from 'react';
import { Search, Filter, Eye, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNotificationContext } from '../../contexts/NotificationContext';

// Mock customer data
const customers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '0333.938.014',
    address: '123 Main St, New York, NY 10001',
    joinDate: '2024-01-15',
    totalOrders: 5,
    totalSpent: 1299,
    status: 'active'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1 (555) 234-5678',
    address: '456 Oak Ave, Los Angeles, CA 90210',
    joinDate: '2024-01-10',
    totalOrders: 3,
    totalSpent: 749,
    status: 'active'
  },
  {
    id: '3',
    name: 'Mike Davis',
    email: 'mike@example.com',
    phone: '+1 (555) 345-6789',
    address: '789 Pine St, Chicago, IL 60601',
    joinDate: '2024-01-05',
    totalOrders: 8,
    totalSpent: 2199,
    status: 'vip'
  }
];

export const CustomerManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotificationContext();

  const statusOptions = ['All', 'active', 'vip', 'inactive'];

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || customer.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'vip': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Handle view customer details
  const handleViewCustomer = async (customerId: string) => {
    setIsLoading(true);
    try {
      // Show loading notification
      addNotification({
        type: 'info',
        title: 'Loading Customer Details',
        message: `Fetching details for customer ${customerId}...`,
        duration: 2000
      });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // In a real app, this would navigate to customer details page or open a modal
      addNotification({
        type: 'success',
        title: 'Customer Details',
        message: `Customer ${customerId} details loaded successfully`,
        duration: 3000
      });

      console.log(`Viewing customer details for: ${customerId}`);
    } catch (error) {
      console.error('Failed to load customer details:', error);
      
      addNotification({
        type: 'error',
        title: 'Load Failed',
        message: `Failed to load details for customer ${customerId}. Please try again.`,
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle send email to customer
  const handleEmailCustomer = async (customerId: string, customerEmail: string) => {
    setIsLoading(true);
    try {
      // Show loading notification
      addNotification({
        type: 'info',
        title: 'Preparing Email',
        message: `Opening email composer for ${customerEmail}...`,
        duration: 2000
      });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // In a real app, this would open email composer or send email
      addNotification({
        type: 'success',
        title: 'Email Ready',
        message: `Email composer opened for ${customerEmail}`,
        duration: 3000
      });

      console.log(`Sending email to customer: ${customerId} (${customerEmail})`);
    } catch (error) {
      console.error('Failed to prepare email:', error);
      
      addNotification({
        type: 'error',
        title: 'Email Failed',
        message: `Failed to prepare email for ${customerEmail}. Please try again.`,
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const customerStats = [
    { label: 'Total Customers', value: customers.length, color: 'blue' },
    { label: 'Active', value: customers.filter(c => c.status === 'active').length, color: 'green' },
    { label: 'VIP', value: customers.filter(c => c.status === 'vip').length, color: 'purple' },
    { label: 'New This Month', value: 12, color: 'yellow' }
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Customer Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage customer relationships and data</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {customerStats.map((stat, index) => (
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
              placeholder="Search customers by name or email..."
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

      {/* Customers Table */}
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
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Orders</th>
                <th className="px-6 py-3">Total Spent</th>
                <th className="px-6 py-3">Join Date</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="bg-white dark:bg-gray-900 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{customer.name}</div>
                        <div className="text-gray-500 dark:text-gray-400 text-sm">ID: {customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">{customer.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-500 dark:text-gray-400">{customer.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {customer.address}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{customer.totalOrders}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">${customer.totalSpent}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">
                        {new Date(customer.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        data-testid={`view-customer-${customer.id}`}
                        title={`View details for ${customer.name}`}
                        onClick={() => handleViewCustomer(customer.id)}
                        disabled={isLoading}
                        className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        data-testid={`email-customer-${customer.id}`}
                        title={`Send email to ${customer.email}`}
                        onClick={() => handleEmailCustomer(customer.id, customer.email)}
                        disabled={isLoading}
                        className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Mail className="h-4 w-4" />
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
              Showing {filteredCustomers.length} of {customers.length} customers
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