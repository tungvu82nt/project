// Initialize default data for the application
import { localStorageService } from '../services/LocalStorageService';
import { hashPassword } from './security';

export const initializeDefaultData = async (): Promise<void> => {
  try {
    // Check if users already exist
    const existingUsers = localStorageService.getItem('db_users') || [];
    
    if (existingUsers.length === 0) {
      console.log('Initializing default admin user...');
      
      // Create default admin user
      const adminPassword = await hashPassword('admin123');
      const adminUser = {
        id: 1,
        email: 'admin@elitestore.com',
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        phone: '+1234567890',
        role: 'admin',
        isActive: true,
        isEmailVerified: true,
        preferences: {
          language: 'en',
          currency: 'USD',
          notifications: {
            email: true,
            sms: false,
            push: true
          }
        },
        addresses: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: null
      };
      
      // Save admin user to localStorage
      localStorageService.setItem('db_users', [adminUser]);
      
      // Initialize other empty tables if they don't exist
      if (!localStorageService.getItem('db_products')) {
        localStorageService.setItem('db_products', []);
      }
      if (!localStorageService.getItem('db_orders')) {
        localStorageService.setItem('db_orders', []);
      }
      if (!localStorageService.getItem('db_categories')) {
        localStorageService.setItem('db_categories', []);
      }
      if (!localStorageService.getItem('db_reviews')) {
        localStorageService.setItem('db_reviews', []);
      }
      if (!localStorageService.getItem('db_settings')) {
        localStorageService.setItem('db_settings', []);
      }
      
      console.log('Default data initialized successfully!');
      console.log('Admin credentials:');
      console.log('Email: admin@elitestore.com');
      console.log('Password: admin123');
    } else {
      console.log('Users already exist, skipping initialization.');
    }
  } catch (error) {
    console.error('Error initializing default data:', error);
  }
};

// Function to reset all data (useful for development)
export const resetAllData = (): void => {
  const tables = ['db_users', 'db_products', 'db_orders', 'db_categories', 'db_reviews', 'db_settings'];
  
  tables.forEach(table => {
    localStorageService.removeItem(table);
  });
  
  console.log('All data has been reset.');
};

// Function to check if data is initialized
export const isDataInitialized = (): boolean => {
  const users = localStorageService.getItem('db_users');
  return users && users.length > 0;
};