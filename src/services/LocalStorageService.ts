// LocalStorage service for centralized data management
import { encryptData, decryptData } from '../utils/security';

/**
 * Interface defining localStorage data structure
 */
interface StorageData {
  user?: any;
  cart?: any[];
  preferences?: any;
  theme?: string;
  language?: string;
  csrf_token?: string;
  session?: any;
  orders?: any[];
  wishlist?: any[];
  recentlyViewed?: any[];
  searchHistory?: string[];
}

/**
 * Configuration for each data type
 */
interface StorageConfig {
  encrypt?: boolean;
  expiry?: number; // milliseconds
  compress?: boolean;
}

/**
 * Centralized localStorage management service
 */
class LocalStorageService {
  private static instance: LocalStorageService;
  private readonly prefix = 'yapee_';
  
  // Default configuration for each data type
  private readonly defaultConfigs: Record<keyof StorageData, StorageConfig> = {
    user: { encrypt: true, expiry: 24 * 60 * 60 * 1000 }, // 24 hours
    cart: { encrypt: false, expiry: 7 * 24 * 60 * 60 * 1000 }, // 7 days
    preferences: { encrypt: false },
    theme: { encrypt: false },
    language: { encrypt: false },
    csrf_token: { encrypt: true, expiry: 60 * 60 * 1000 }, // 1 hour
    session: { encrypt: true, expiry: 30 * 60 * 1000 }, // 30 minutes
    orders: { encrypt: true },
    wishlist: { encrypt: false },
    recentlyViewed: { encrypt: false, expiry: 30 * 24 * 60 * 60 * 1000 }, // 30 days
    searchHistory: { encrypt: false, expiry: 7 * 24 * 60 * 60 * 1000 } // 7 days
  };

  private constructor() {
    this.cleanupExpiredData();
  }

  /**
   * Singleton pattern - get unique instance
   */
  public static getInstance(): LocalStorageService {
    if (!LocalStorageService.instance) {
      LocalStorageService.instance = new LocalStorageService();
    }
    return LocalStorageService.instance;
  }

  /**
   * Save data to localStorage
   */
  public setItem<K extends keyof StorageData>(
    key: K,
    value: StorageData[K],
    config?: Partial<StorageConfig>
  ): boolean {
    try {
      const finalConfig = { ...this.defaultConfigs[key], ...config };
      const storageKey = this.prefix + key;
      
      let dataToStore: any = {
        value,
        timestamp: Date.now(),
        expiry: finalConfig.expiry ? Date.now() + finalConfig.expiry : null
      };

      // Encrypt data if needed
      if (finalConfig.encrypt) {
        dataToStore.value = encryptData(JSON.stringify(value));
        dataToStore.encrypted = true;
      }

      localStorage.setItem(storageKey, JSON.stringify(dataToStore));
      return true;
    } catch (error) {
      console.error(`Error saving to localStorage (${key}):`, error);
      return false;
    }
  }

  /**
   * Get data from localStorage
   */
  public getItem<K extends keyof StorageData>(key: K): StorageData[K] | null {
    try {
      const storageKey = this.prefix + key;
      const storedData = localStorage.getItem(storageKey);
      
      if (!storedData) {
        return null;
      }

      const parsedData = JSON.parse(storedData);
      
      // Check expiry
      if (parsedData.expiry && Date.now() > parsedData.expiry) {
        this.removeItem(key);
        return null;
      }

      // Decrypt data if needed
      if (parsedData.encrypted) {
        const decryptedValue = decryptData(parsedData.value);
        return JSON.parse(decryptedValue);
      }

      return parsedData.value;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return null;
    }
  }

  /**
   * Remove an item from localStorage
   */
  public removeItem<K extends keyof StorageData>(key: K): boolean {
    try {
      const storageKey = this.prefix + key;
      localStorage.removeItem(storageKey);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
      return false;
    }
  }

  /**
   * Clear all application data
   */
  public clear(): boolean {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  /**
   * Check if a key exists
   */
  public hasItem<K extends keyof StorageData>(key: K): boolean {
    const storageKey = this.prefix + key;
    return localStorage.getItem(storageKey) !== null;
  }

  /**
   * Get used data size (bytes)
   */
  public getUsedSpace(): number {
    let totalSize = 0;
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        const value = localStorage.getItem(key);
        if (value) {
          totalSize += key.length + value.length;
        }
      }
    });
    
    return totalSize;
  }

  /**
   * Get localStorage statistics
   */
  public getStats(): {
    totalItems: number;
    usedSpace: number;
    usedSpaceFormatted: string;
    items: Array<{ key: string; size: number; hasExpiry: boolean; isExpired: boolean }>
  } {
    const keys = Object.keys(localStorage);
    const appKeys = keys.filter(key => key.startsWith(this.prefix));
    const items: Array<{ key: string; size: number; hasExpiry: boolean; isExpired: boolean }> = [];
    
    let totalSize = 0;
    
    appKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        const size = key.length + value.length;
        totalSize += size;
        
        let hasExpiry = false;
        let isExpired = false;
        
        try {
          const parsedData = JSON.parse(value);
          hasExpiry = !!parsedData.expiry;
          isExpired = parsedData.expiry && Date.now() > parsedData.expiry;
        } catch (e) {
          // Ignore parsing errors
        }
        
        items.push({
          key: key.replace(this.prefix, ''),
          size,
          hasExpiry,
          isExpired
        });
      }
    });
    
    return {
      totalItems: appKeys.length,
      usedSpace: totalSize,
      usedSpaceFormatted: this.formatBytes(totalSize),
      items
    };
  }

  /**
   * Clean up expired data
   */
  public cleanupExpiredData(): number {
    let cleanedCount = 0;
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            const parsedData = JSON.parse(value);
            if (parsedData.expiry && Date.now() > parsedData.expiry) {
              localStorage.removeItem(key);
              cleanedCount++;
            }
          }
        } catch (error) {
          // Remove corrupted data
          localStorage.removeItem(key);
          cleanedCount++;
        }
      }
    });
    
    if (cleanedCount > 0) {
      console.log(`Cleaned up ${cleanedCount} expired localStorage items`);
    }
    
    return cleanedCount;
  }

  /**
   * Backup localStorage data
   */
  public backup(): string {
    const data: Record<string, any> = {};
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        data[key] = localStorage.getItem(key);
      }
    });
    
    return JSON.stringify({
      timestamp: Date.now(),
      version: '1.0',
      data
    });
  }

  /**
   * Restore data from backup
   */
  public restore(backupData: string): boolean {
    try {
      const backup = JSON.parse(backupData);
      
      if (!backup.data) {
        throw new Error('Invalid backup format');
      }
      
      // Clear existing data
      this.clear();
      
      // Restore data
      Object.entries(backup.data).forEach(([key, value]) => {
        if (typeof value === 'string') {
          localStorage.setItem(key, value);
        }
      });
      
      console.log('LocalStorage data restored successfully');
      return true;
    } catch (error) {
      console.error('Error restoring localStorage data:', error);
      return false;
    }
  }

  /**
   * Format bytes to readable string
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Migrate old data to new format
   */
  public migrateOldData(): void {
    // Migrate user data
    const oldUser = localStorage.getItem('user');
    if (oldUser && !this.hasItem('user')) {
      try {
        const userData = JSON.parse(oldUser);
        this.setItem('user', userData);
        localStorage.removeItem('user');
        console.log('Migrated user data to new format');
      } catch (error) {
        console.error('Error migrating user data:', error);
      }
    }

    // Migrate CSRF token
    const oldCsrfToken = localStorage.getItem('csrf-token');
    if (oldCsrfToken && !this.hasItem('csrf_token')) {
      this.setItem('csrf_token', oldCsrfToken);
      localStorage.removeItem('csrf-token');
      console.log('Migrated CSRF token to new format');
    }

    // Add more migrations as needed
  }
}

// Export singleton instance
export const localStorageService = LocalStorageService.getInstance();
export default localStorageService;

// Export types for use in other files
export type { StorageData, StorageConfig };