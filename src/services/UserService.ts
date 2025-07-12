import DatabaseService from './DatabaseService';
import { User } from '../types/user';
import { localStorageService } from './LocalStorageService';
import { normalizeText, ensureDisplaySafe, fixVietnameseEncoding } from '../utils/encoding';
import { hashPassword, verifyPassword } from '../utils/security';

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  preferences?: {
    language: string;
    currency: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  avatar?: string;
  preferences?: {
    language?: string;
    currency?: string;
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
    };
  };
  addresses?: Array<{
    id: string;
    type: 'home' | 'work' | 'other';
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
    isDefault: boolean;
  }>;
}

class UserService {
  private db: DatabaseService;
  private readonly TABLE_NAME = 'users';

  constructor() {
    this.db = new DatabaseService({
      host: 'localhost',
      port: 3306,
      database: 'yapee',
      username: 'root',
      password: '',
      maxConnections: 10,
      enableQueryCache: true,
      enablePerformanceMonitoring: true
    });
    
    // Initialize default admin user (fire and forget)
    this.initializeDefaultUsers().catch(error => {
      console.error('Failed to initialize default users:', error);
    });
  }

  // Initialize default users (admin account)
  private async initializeDefaultUsers(): Promise<void> {
    try {
      const adminEmail = 'admin@elitestore.com';
      const existingAdmin = await this.getUserByEmail(adminEmail);
      
      if (!existingAdmin) {
        // Create default admin user
        const hashedPassword = await hashPassword('admin123');
        
        const adminUser: Omit<User, 'id'> = {
          email: adminEmail,
          password: hashedPassword,
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

        await this.db.query(
          `INSERT INTO ${this.TABLE_NAME}`,
          [adminUser]
        );
        
        console.log('Default admin user created successfully');
      }
    } catch (error) {
      console.error('Error initializing default users:', error);
    }
  }

  // Create new user (registration)
  async createUser(userData: CreateUserData): Promise<User | null> {
    try {
      // Check if user already exists
      const existingUser = await this.getUserByEmail(userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await hashPassword(userData.password);

      const user: Omit<User, 'id'> = {
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        dateOfBirth: userData.dateOfBirth,
        gender: userData.gender,
        role: 'customer',
        isActive: true,
        isEmailVerified: false,
        preferences: userData.preferences || {
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

      const result = await this.db.query(
        `INSERT INTO ${this.TABLE_NAME}`,
        [user]
      );

      if (result.rows.length > 0) {
        // Remove password from returned user
        const { password, ...userWithoutPassword } = result.rows[0];
        return userWithoutPassword as User;
      }

      return null;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Authenticate user (login)
  async authenticateUser(email: string, password: string): Promise<User | null> {
    try {
      const result = await this.db.query(
        `SELECT * FROM ${this.TABLE_NAME} WHERE email = ?`,
        [email]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const user = result.rows[0];
      
      // Check if user and password exist
      if (!user || !user.password) {
        console.error('User or password not found in database result');
        return null;
      }
      
      // Verify password
      const isValidPassword = await verifyPassword(password, user.password);
      if (!isValidPassword) {
        return null;
      }

      // Update last login time
      await this.updateUser(user.id, { lastLoginAt: new Date().toISOString() });

      // Remove password from returned user
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    } catch (error) {
      console.error('Error authenticating user:', error);
      return null;
    }
  }

  // Get all users
  async getAllUsers(): Promise<User[]> {
    try {
      const result = await this.db.query(
        `SELECT * FROM ${this.TABLE_NAME} ORDER BY createdAt DESC`
      );
      
      // Remove passwords from all users
      return result.rows.map(user => {
        if (!user) return user;
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword as User;
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  // Get user by ID
  async getUserById(id: string): Promise<User | null> {
    try {
      const result = await this.db.query(
        `SELECT * FROM ${this.TABLE_NAME} WHERE id = ?`,
        [id]
      );
      
      if (result.rows.length > 0 && result.rows[0]) {
        const { password, ...userWithoutPassword } = result.rows[0];
        return userWithoutPassword as User;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    }
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const result = await this.db.query(
        `SELECT * FROM ${this.TABLE_NAME} WHERE email = ?`,
        [email]
      );
      
      if (result.rows.length > 0 && result.rows[0]) {
        const { password, ...userWithoutPassword } = result.rows[0];
        return userWithoutPassword as User;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }
  }

  // Update user
  async updateUser(id: string, updates: UpdateUserData): Promise<User | null> {
    try {
      const result = await this.db.query(
        `UPDATE ${this.TABLE_NAME} SET ? WHERE id = ?`,
        [{ ...updates, updatedAt: new Date().toISOString() }, id]
      );
      
      if (result.rows.length > 0 && result.rows[0]) {
        const { password, ...userWithoutPassword } = result.rows[0];
        return userWithoutPassword as User;
      }
      
      return null;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  // Change password
  async changePassword(id: string, currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      // Get user with password
      const result = await this.db.query(
        `SELECT * FROM ${this.TABLE_NAME} WHERE id = ?`,
        [id]
      );

      if (result.rows.length === 0) {
        return false;
      }

      const user = result.rows[0];
      
      // Check if user and password exist
      if (!user || !user.password) {
        console.error('User or password not found in database result');
        return false;
      }
      
      // Verify current password
      const isValidPassword = await verifyPassword(currentPassword, user.password);
      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const hashedNewPassword = await hashPassword(newPassword);

      // Update password
      const updateResult = await this.db.query(
        `UPDATE ${this.TABLE_NAME} SET ? WHERE id = ?`,
        [{ password: hashedNewPassword, updatedAt: new Date().toISOString() }, id]
      );

      return updateResult.rows.length > 0;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  // Deactivate user
  async deactivateUser(id: string): Promise<boolean> {
    try {
      const result = await this.updateUser(id, { isActive: false });
      return result !== null;
    } catch (error) {
      console.error('Error deactivating user:', error);
      return false;
    }
  }

  // Activate user
  async activateUser(id: string): Promise<boolean> {
    try {
      const result = await this.updateUser(id, { isActive: true });
      return result !== null;
    } catch (error) {
      console.error('Error activating user:', error);
      return false;
    }
  }

  // Verify email
  async verifyEmail(id: string): Promise<boolean> {
    try {
      const result = await this.updateUser(id, { isEmailVerified: true });
      return result !== null;
    } catch (error) {
      console.error('Error verifying email:', error);
      return false;
    }
  }

  // Get users with pagination
  async getUsersPaginated(page: number = 1, limit: number = 10, role?: User['role']): Promise<{
    users: User[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      let allUsers: User[];
      
      if (role) {
        allUsers = await this.getUsersByRole(role);
      } else {
        allUsers = await this.getAllUsers();
      }

      const total = allUsers.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const users = allUsers.slice(startIndex, startIndex + limit);

      return {
        users,
        total,
        totalPages,
        currentPage: page
      };
    } catch (error) {
      console.error('Error fetching paginated users:', error);
      return {
        users: [],
        total: 0,
        totalPages: 0,
        currentPage: page
      };
    }
  }

  // Get users by role
  async getUsersByRole(role: User['role']): Promise<User[]> {
    try {
      const result = await this.db.query(
        `SELECT * FROM ${this.TABLE_NAME} WHERE role = ?`,
        [role]
      );
      
      return result.rows.map(user => {
        if (!user) return user;
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword as User;
      });
    } catch (error) {
      console.error('Error fetching users by role:', error);
      return [];
    }
  }

  // Search users
  async searchUsers(query: string): Promise<User[]> {
    try {
      const allUsers = await this.getAllUsers();
      
      // Normalize and fix encoding for search term
      let normalizedQuery = normalizeText(query);
      normalizedQuery = fixVietnameseEncoding(normalizedQuery);
      const searchTerm = ensureDisplaySafe(normalizedQuery).toLowerCase();
      
      return allUsers.filter(user => {
        // Helper function to safely process text for comparison
        const processText = (text: string | undefined) => {
          if (!text) return '';
          let processed = normalizeText(text);
          processed = fixVietnameseEncoding(processed);
          return ensureDisplaySafe(processed).toLowerCase();
        };
        
        return processText(user.firstName).includes(searchTerm) ||
               processText(user.lastName).includes(searchTerm) ||
               processText(user.email).includes(searchTerm) ||
               processText(user.phone).includes(searchTerm);
      });
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }

  // Get user statistics
  async getUserStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    verified: number;
    unverified: number;
    customers: number;
    admins: number;
    recentRegistrations: number;
  }> {
    try {
      const allUsers = await this.getAllUsers();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const stats = {
        total: allUsers.length,
        active: allUsers.filter(u => u.isActive).length,
        inactive: allUsers.filter(u => !u.isActive).length,
        verified: allUsers.filter(u => u.isEmailVerified).length,
        unverified: allUsers.filter(u => !u.isEmailVerified).length,
        customers: allUsers.filter(u => u.role === 'customer').length,
        admins: allUsers.filter(u => u.role === 'admin').length,
        recentRegistrations: allUsers.filter(u => 
          new Date(u.createdAt) >= thirtyDaysAgo
        ).length
      };

      return stats;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return {
        total: 0,
        active: 0,
        inactive: 0,
        verified: 0,
        unverified: 0,
        customers: 0,
        admins: 0,
        recentRegistrations: 0
      };
    }
  }

  // Delete user (soft delete by deactivating)
  async deleteUser(id: string): Promise<boolean> {
    try {
      return await this.deactivateUser(id);
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  // Get recent users
  async getRecentUsers(limit: number = 10): Promise<User[]> {
    try {
      const result = await this.db.query(
        `SELECT * FROM ${this.TABLE_NAME} ORDER BY createdAt DESC LIMIT ${limit}`
      );
      
      return result.rows.map(user => {
        if (!user) return user;
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword as User;
      });
    } catch (error) {
      console.error('Error fetching recent users:', error);
      return [];
    }
  }

  // Update user role
  async updateUserRole(id: string, role: User['role']): Promise<User | null> {
    try {
      return await this.updateUser(id, { role });
    } catch (error) {
      console.error('Error updating user role:', error);
      return null;
    }
  }

  // Add user address
  async addUserAddress(id: string, address: UpdateUserData['addresses'][0]): Promise<User | null> {
    try {
      const user = await this.getUserById(id);
      if (!user) return null;

      const addresses = user.addresses || [];
      
      // If this is the first address or marked as default, make it default
      if (addresses.length === 0 || address.isDefault) {
        addresses.forEach(addr => addr.isDefault = false);
      }
      
      addresses.push(address);
      
      return await this.updateUser(id, { addresses });
    } catch (error) {
      console.error('Error adding user address:', error);
      return null;
    }
  }

  // Update user address
  async updateUserAddress(id: string, addressId: string, updates: Partial<UpdateUserData['addresses'][0]>): Promise<User | null> {
    try {
      const user = await this.getUserById(id);
      if (!user) return null;

      const addresses = user.addresses || [];
      const addressIndex = addresses.findIndex(addr => addr.id === addressId);
      
      if (addressIndex === -1) {
        throw new Error('Address not found');
      }
      
      // If setting as default, remove default from others
      if (updates.isDefault) {
        addresses.forEach(addr => addr.isDefault = false);
      }
      
      addresses[addressIndex] = { ...addresses[addressIndex], ...updates };
      
      return await this.updateUser(id, { addresses });
    } catch (error) {
      console.error('Error updating user address:', error);
      return null;
    }
  }

  // Remove user address
  async removeUserAddress(id: string, addressId: string): Promise<User | null> {
    try {
      const user = await this.getUserById(id);
      if (!user) return null;

      const addresses = (user.addresses || []).filter(addr => addr.id !== addressId);
      
      return await this.updateUser(id, { addresses });
    } catch (error) {
      console.error('Error removing user address:', error);
      return null;
    }
  }
}

export const userService = new UserService();
export { UserService };