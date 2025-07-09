import DatabaseService from './DatabaseService';
import { Order, CartItem, User } from '../types';
import { localStorageService } from './LocalStorageService';
import { productService } from './ProductService';

export interface CreateOrderData {
  userId: string;
  items: CartItem[];
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer' | 'cash_on_delivery';
  paymentDetails?: any;
  notes?: string;
}

class OrderService {
  private db: DatabaseService;
  private readonly TABLE_NAME = 'orders';

  constructor() {
    this.db = new DatabaseService({
      host: 'localhost',
      port: 3306,
      database: 'elitestore',
      username: 'root',
      password: '',
      maxConnections: 10,
      enableQueryCache: true,
      enablePerformanceMonitoring: true
    });
  }

  // Create new order
  async createOrder(orderData: CreateOrderData): Promise<Order | null> {
    try {
      // Calculate total amount
      const totalAmount = orderData.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);

      // Generate order number
      const orderNumber = this.generateOrderNumber();

      const order: Omit<Order, 'id'> = {
        orderNumber,
        userId: orderData.userId,
        items: orderData.items,
        status: 'pending',
        totalAmount,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        paymentStatus: 'pending',
        paymentDetails: orderData.paymentDetails,
        notes: orderData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const result = await this.db.query(
        `INSERT INTO ${this.TABLE_NAME}`,
        [order]
      );

      if (result.length > 0) {
        // Update product stock
        for (const item of orderData.items) {
          await productService.updateStock(item.id, item.quantity);
        }
        
        return result[0];
      }

      return null;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  }

  // Get all orders
  async getAllOrders(): Promise<Order[]> {
    try {
      const result = await this.db.query(
        `SELECT * FROM ${this.TABLE_NAME} ORDER BY createdAt DESC`
      );
      return result;
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }

  // Get order by ID
  async getOrderById(id: string): Promise<Order | null> {
    try {
      const result = await this.db.query(
        `SELECT * FROM ${this.TABLE_NAME} WHERE id = ?`,
        [id]
      );
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error fetching order by ID:', error);
      return null;
    }
  }

  // Get order by order number
  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    try {
      const result = await this.db.query(
        `SELECT * FROM ${this.TABLE_NAME} WHERE orderNumber = ?`,
        [orderNumber]
      );
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error fetching order by number:', error);
      return null;
    }
  }

  // Get orders by user ID
  async getOrdersByUserId(userId: string): Promise<Order[]> {
    try {
      const result = await this.db.query(
        `SELECT * FROM ${this.TABLE_NAME} WHERE userId = ? ORDER BY createdAt DESC`,
        [userId]
      );
      return result;
    } catch (error) {
      console.error('Error fetching orders by user ID:', error);
      return [];
    }
  }

  // Get orders by status
  async getOrdersByStatus(status: Order['status']): Promise<Order[]> {
    try {
      const result = await this.db.query(
        `SELECT * FROM ${this.TABLE_NAME} WHERE status = ? ORDER BY createdAt DESC`,
        [status]
      );
      return result;
    } catch (error) {
      console.error('Error fetching orders by status:', error);
      return [];
    }
  }

  // Update order status
  async updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
    try {
      const result = await this.db.query(
        `UPDATE ${this.TABLE_NAME} SET ? WHERE id = ?`,
        [{ status, updatedAt: new Date().toISOString() }, id]
      );
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error updating order status:', error);
      return null;
    }
  }

  // Update payment status
  async updatePaymentStatus(id: string, paymentStatus: Order['paymentStatus']): Promise<Order | null> {
    try {
      const result = await this.db.query(
        `UPDATE ${this.TABLE_NAME} SET ? WHERE id = ?`,
        [{ paymentStatus, updatedAt: new Date().toISOString() }, id]
      );
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error updating payment status:', error);
      return null;
    }
  }

  // Update order
  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | null> {
    try {
      const result = await this.db.query(
        `UPDATE ${this.TABLE_NAME} SET ? WHERE id = ?`,
        [{ ...updates, updatedAt: new Date().toISOString() }, id]
      );
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error updating order:', error);
      return null;
    }
  }

  // Cancel order
  async cancelOrder(id: string, reason?: string): Promise<boolean> {
    try {
      const order = await this.getOrderById(id);
      if (!order) return false;

      // Only allow cancellation for pending or confirmed orders
      if (!['pending', 'confirmed'].includes(order.status)) {
        throw new Error('Order cannot be cancelled in current status');
      }

      // Restore product stock
      for (const item of order.items) {
        const product = await productService.getProductById(item.id);
        if (product) {
          await productService.updateProduct(item.id, {
            stock: product.stock + item.quantity,
            inStock: true
          });
        }
      }

      const result = await this.updateOrderStatus(id, 'cancelled');
      return result !== null;
    } catch (error) {
      console.error('Error cancelling order:', error);
      return false;
    }
  }

  // Get orders with pagination
  async getOrdersPaginated(page: number = 1, limit: number = 10, status?: Order['status']): Promise<{
    orders: Order[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      let allOrders: Order[];
      
      if (status) {
        allOrders = await this.getOrdersByStatus(status);
      } else {
        allOrders = await this.getAllOrders();
      }

      const total = allOrders.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const orders = allOrders.slice(startIndex, startIndex + limit);

      return {
        orders,
        total,
        totalPages,
        currentPage: page
      };
    } catch (error) {
      console.error('Error fetching paginated orders:', error);
      return {
        orders: [],
        total: 0,
        totalPages: 0,
        currentPage: page
      };
    }
  }

  // Get order statistics
  async getOrderStats(): Promise<{
    total: number;
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    totalRevenue: number;
    averageOrderValue: number;
  }> {
    try {
      const allOrders = await this.getAllOrders();
      
      const stats = {
        total: allOrders.length,
        pending: allOrders.filter(o => o.status === 'pending').length,
        confirmed: allOrders.filter(o => o.status === 'confirmed').length,
        shipped: allOrders.filter(o => o.status === 'shipped').length,
        delivered: allOrders.filter(o => o.status === 'delivered').length,
        cancelled: allOrders.filter(o => o.status === 'cancelled').length,
        totalRevenue: allOrders
          .filter(o => o.status !== 'cancelled')
          .reduce((sum, order) => sum + order.totalAmount, 0),
        averageOrderValue: 0
      };

      const completedOrders = allOrders.filter(o => o.status !== 'cancelled');
      stats.averageOrderValue = completedOrders.length > 0 
        ? stats.totalRevenue / completedOrders.length 
        : 0;

      return stats;
    } catch (error) {
      console.error('Error fetching order stats:', error);
      return {
        total: 0,
        pending: 0,
        confirmed: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        totalRevenue: 0,
        averageOrderValue: 0
      };
    }
  }

  // Get recent orders
  async getRecentOrders(limit: number = 10): Promise<Order[]> {
    try {
      const result = await this.db.query(
        `SELECT * FROM ${this.TABLE_NAME} ORDER BY createdAt DESC LIMIT ${limit}`
      );
      return result;
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      return [];
    }
  }

  // Search orders
  async searchOrders(query: string): Promise<Order[]> {
    try {
      const allOrders = await this.getAllOrders();
      const searchTerm = query.toLowerCase();
      
      return allOrders.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm) ||
        order.shippingAddress.fullName.toLowerCase().includes(searchTerm) ||
        order.shippingAddress.address.toLowerCase().includes(searchTerm) ||
        order.status.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error('Error searching orders:', error);
      return [];
    }
  }

  // Generate unique order number
  private generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${timestamp.slice(-6)}-${random}`;
  }

  // Get orders by date range
  async getOrdersByDateRange(startDate: string, endDate: string): Promise<Order[]> {
    try {
      const allOrders = await this.getAllOrders();
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      return allOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= start && orderDate <= end;
      });
    } catch (error) {
      console.error('Error fetching orders by date range:', error);
      return [];
    }
  }

  // Get revenue by date range
  async getRevenueByDateRange(startDate: string, endDate: string): Promise<number> {
    try {
      const orders = await this.getOrdersByDateRange(startDate, endDate);
      return orders
        .filter(order => order.status !== 'cancelled')
        .reduce((total, order) => total + order.totalAmount, 0);
    } catch (error) {
      console.error('Error calculating revenue by date range:', error);
      return 0;
    }
  }
}

export const orderService = new OrderService();
export { OrderService };