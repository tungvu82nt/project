/**
 * Central export file for all services
 * Standardize service and type exports
 */

// Core Services - Default exports
export { default as DatabaseService } from './DatabaseService';
export { default as DeploymentService } from './DeploymentService';
export { default as localStorageService } from './LocalStorageService';

// Business Logic Services - Named exports with instance and class
export { productService, ProductService } from './ProductService';
export { orderService, OrderService } from './OrderService';
export { userService, UserService } from './UserService';

// Service Types
export type { CreateUserData, UpdateUserData } from './UserService';
export type { CreateOrderData } from './OrderService';

// Re-export commonly used types from other modules
export type { Product, Order, User, CartItem } from '../types';

// Service interfaces for dependency injection
export interface IProductService {
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  createProduct(product: Omit<Product, 'id'>): Promise<Product>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product>;
  deleteProduct(id: string): Promise<boolean>;
}

export interface IOrderService {
  getOrders(): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | null>;
  createOrder(order: CreateOrderData): Promise<Order>;
  updateOrderStatus(id: string, status: Order['status']): Promise<Order>;
}

export interface IUserService {
  getUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  createUser(userData: CreateUserData): Promise<User>;
  updateUser(id: string, updates: UpdateUserData): Promise<User>;
  deleteUser(id: string): Promise<boolean>;
}