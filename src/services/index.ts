// Export all services for easy importing
export { localStorageService } from './LocalStorageService';
export { default as DatabaseService } from './DatabaseService';
export { productService, ProductService } from './ProductService';
export { orderService, OrderService } from './OrderService';
export { userService, UserService } from './UserService';

// Export types
export type { CreateUserData, UpdateUserData } from './UserService';
export type { CreateOrderData } from './OrderService';

// Re-export commonly used types from other modules
export type { Product, Order, User, CartItem } from '../types';