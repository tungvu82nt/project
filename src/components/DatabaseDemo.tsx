import React, { useState, useEffect } from 'react';
import { productService, orderService, userService } from '../services';
import { Product, Order, User } from '../types';

const DatabaseDemo: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, ordersData, usersData, productStats, orderStats, userStats] = await Promise.all([
        productService.getAllProducts(),
        orderService.getAllOrders(),
        userService.getAllUsers(),
        productService.getProductStats(),
        orderService.getOrderStats(),
        userService.getUserStats()
      ]);

      setProducts(productsData);
      setOrders(ordersData);
      setUsers(usersData);
      setStats({
        products: productStats,
        orders: orderStats,
        users: userStats
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTestUser = async () => {
    try {
      const userData = {
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        phone: '+1234567890'
      };

      const newUser = await userService.createUser(userData);
      if (newUser) {
        console.log('Created user:', newUser);
        loadData();
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const createTestOrder = async () => {
    try {
      if (users.length === 0 || products.length === 0) {
        alert('Need at least one user and one product to create an order');
        return;
      }

      const orderData = {
        userId: users[0].id,
        items: [
          {
            id: products[0].id,
            name: products[0].name,
            price: products[0].price,
            quantity: 2,
            image: products[0].images[0],
            selectedColor: products[0].colors?.[0],
            selectedSize: products[0].sizes?.[0]
          }
        ],
        shippingAddress: {
          fullName: users[0].firstName && users[0].lastName ? `${users[0].firstName} ${users[0].lastName}` : users[0].email,
          address: '123 Test Street',
          city: 'Test City',
          postalCode: '12345',
          country: 'Test Country',
          phone: users[0].phone || '+1234567890'
        },
        paymentMethod: 'credit_card' as const,
        notes: 'Test order created from demo'
      };

      const newOrder = await orderService.createOrder(orderData);
      if (newOrder) {
        console.log('Created order:', newOrder);
        loadData();
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const searchProducts = async () => {
    try {
      const results = await productService.searchProducts('laptop');
      console.log('Search results:', results);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const createTestProduct = async () => {
    try {
      const productData = {
        name: {
          en: `Test Product ${Date.now()}`,
          vi: `Sản phẩm test ${Date.now()}`,
          zh: `测试产品 ${Date.now()}`
        },
        description: {
          en: 'This is a test product created from demo',
          vi: 'Đây là sản phẩm test được tạo từ demo',
          zh: '这是从演示创建的测试产品'
        },
        price: Math.floor(Math.random() * 1000) + 100,
        originalPrice: Math.floor(Math.random() * 1200) + 150,
        category: 'electronics',
        images: ['https://via.placeholder.com/400x400?text=Test+Product'],
        colors: ['Black', 'White'],
        sizes: ['M', 'L'],
        stock: Math.floor(Math.random() * 50) + 10,
        inStock: true,
        featured: Math.random() > 0.5,
        rating: Math.floor(Math.random() * 5) + 1,
        reviews: Math.floor(Math.random() * 100),
        features: {
          en: ['Test feature 1', 'Test feature 2'],
          vi: ['Tính năng test 1', 'Tính năng test 2'],
          zh: ['测试功能1', '测试功能2']
        },
        specifications: {
          en: { 'Test Spec': 'Test Value' },
          vi: { 'Thông số test': 'Giá trị test' },
          zh: { '测试规格': '测试值' }
        },
        model3d: null
      };

      const newProduct = await productService.createProduct(productData);
      if (newProduct) {
        console.log('Created product:', newProduct);
        loadData();
        alert('Test product created successfully!');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error creating product');
    }
  };

  const deleteFirstProduct = async () => {
    try {
      if (products.length === 0) {
        alert('No products to delete');
        return;
      }

      if (confirm(`Are you sure you want to delete "${products[0].name.en}"?`)) {
        const success = await productService.deleteProduct(products[0].id);
        if (success) {
          console.log('Deleted product:', products[0]);
          loadData();
          alert('Product deleted successfully!');
        } else {
          alert('Error deleting product');
        }
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all localStorage data?')) {
      localStorage.clear();
      setProducts([]);
      setOrders([]);
      setUsers([]);
      setStats(null);
      alert('All data cleared! Refresh the page to reinitialize.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">LocalStorage Database Demo</h1>
        <p className="text-gray-600 mb-6">
          This demo shows how the application uses localStorage as a database with full CRUD operations.
        </p>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={loadData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Data
          </button>
          <button
            onClick={createTestUser}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Create Test User
          </button>
          <button
            onClick={createTestOrder}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create Test Order
          </button>
          <button
            onClick={createTestProduct}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create Test Product
          </button>
          <button
            onClick={deleteFirstProduct}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Delete First Product
          </button>
          <button
            onClick={searchProducts}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Search Products
          </button>
          <button
            onClick={clearAllData}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Clear All Data
          </button>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Statistics</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Total Products:</span> {stats.products.total}</p>
              <p><span className="font-medium">In Stock:</span> {stats.products.inStock}</p>
              <p><span className="font-medium">Out of Stock:</span> {stats.products.outOfStock}</p>
              <p><span className="font-medium">Low Stock:</span> {stats.products.lowStock}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Statistics</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Total Orders:</span> {stats.orders.total}</p>
              <p><span className="font-medium">Pending:</span> {stats.orders.pending}</p>
              <p><span className="font-medium">Delivered:</span> {stats.orders.delivered}</p>
              <p><span className="font-medium">Total Revenue:</span> ${stats.orders.totalRevenue.toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Statistics</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Total Users:</span> {stats.users.total}</p>
              <p><span className="font-medium">Active:</span> {stats.users.active}</p>
              <p><span className="font-medium">Customers:</span> {stats.users.customers}</p>
              <p><span className="font-medium">Admins:</span> {stats.users.admins}</p>
            </div>
          </div>
        </div>
      )}

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Products */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Products ({products.length})</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {products.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {products.slice(0, 10).map((product) => (
                  <div key={product.id} className="p-4">
                    <h4 className="font-medium text-gray-900">{product.name.en}</h4>
                    <p className="text-sm text-gray-600">${product.price}</p>
                    <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                No products found
              </div>
            )}
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Orders ({orders.length})</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {orders.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {orders.slice(0, 10).map((order) => (
                  <div key={order.id} className="p-4">
                    <h4 className="font-medium text-gray-900">{order.orderNumber}</h4>
                    <p className="text-sm text-gray-600">${order.totalAmount}</p>
                    <p className="text-xs text-gray-500 capitalize">{order.status}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                No orders found
              </div>
            )}
          </div>
        </div>

        {/* Users */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Users ({users.length})</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {users.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {users.slice(0, 10).map((user) => (
                  <div key={user.id} className="p-4">
                    <h4 className="font-medium text-gray-900">
                      {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}
                    </h4>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                No users found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LocalStorage Info */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">LocalStorage Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Storage Keys:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• db_products - Product data</li>
              <li>• db_orders - Order data</li>
              <li>• db_users - User data</li>
              <li>• user - Current logged in user</li>
              <li>• cart - Shopping cart items</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Features:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Full CRUD operations</li>
              <li>• Data encryption support</li>
              <li>• Expiration timestamps</li>
              <li>• Query caching</li>
              <li>• Performance monitoring</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseDemo;