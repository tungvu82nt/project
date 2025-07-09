// Database service with optimization and monitoring
import { PerformanceMonitor } from '../utils/performance';
import { withAuditLog, withPerformanceMonitoring, withErrorHandling } from '../middleware/security';
import { localStorageService } from './LocalStorageService';
import { Product, Order, User } from '../types';

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
  poolSize?: number;
  connectionTimeout?: number;
  queryTimeout?: number;
}

interface QueryOptions {
  timeout?: number;
  cache?: boolean;
  cacheTTL?: number;
  retries?: number;
}

interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
  duration: number;
  fromCache: boolean;
}

class DatabaseService {
  private config: DatabaseConfig;
  private pool: any;
  private queryCache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private performanceMonitor: PerformanceMonitor;
  private connectionCount: number = 0;
  private queryCount: number = 0;

  // Database tables stored in localStorage
  private readonly TABLES = {
    products: 'db_products',
    orders: 'db_orders',
    users: 'db_users',
    categories: 'db_categories',
    reviews: 'db_reviews',
    settings: 'db_settings'
  } as const;

  constructor(config: DatabaseConfig) {
    this.config = config;
    this.performanceMonitor = PerformanceMonitor.getInstance();
    this.initializePool();
    this.initializeTables();
  }

  // Initialize database tables in localStorage
  private initializeTables(): void {
    Object.values(this.TABLES).forEach(tableName => {
      if (!localStorageService.getItem(tableName)) {
        localStorageService.setItem(tableName, []);
      }
    });
  }

  private initializePool(): void {
    // In a real implementation, this would create a connection pool
    // For now, we'll simulate the pool configuration
    console.log('Database pool initialized with config:', {
      host: this.config.host,
      database: this.config.database,
      poolSize: this.config.poolSize || 10,
      ssl: this.config.ssl || false
    });
  }

  async connect(): Promise<void> {
    try {
      this.performanceMonitor.startTiming('db_connect');
      
      // Simulate connection
      await new Promise(resolve => setTimeout(resolve, 100));
      
      this.connectionCount++;
      this.performanceMonitor.endTiming('db_connect');
      
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
      throw new Error('Failed to connect to database');
    }
  }

  async disconnect(): Promise<void> {
    try {
      // Simulate disconnection
      await new Promise(resolve => setTimeout(resolve, 50));
      
      this.connectionCount = Math.max(0, this.connectionCount - 1);
      console.log('Database disconnected');
    } catch (error) {
      console.error('Database disconnection failed:', error);
    }
  }

  async query<T = any>(
    sql: string, 
    params: any[] = [], 
    options: QueryOptions = {}
  ): Promise<QueryResult<T>> {
    const queryId = `query_${Date.now()}_${Math.random()}`;
    const cacheKey = `${sql}_${JSON.stringify(params)}`;
    
    try {
      // Check cache first
      if (options.cache !== false) {
        const cached = this.queryCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < (cached.ttl || 300000)) {
          return {
            rows: cached.data,
            rowCount: cached.data.length,
            duration: 0,
            fromCache: true
          };
        }
      }

      this.performanceMonitor.startTiming(queryId);
      this.queryCount++;

      // Execute real query on localStorage
      const result = this.executeQuery(sql, params);
      
      const duration = this.performanceMonitor.endTiming(queryId);

      // Cache successful SELECT queries
      if (sql.toLowerCase().includes('select') && options.cache !== false) {
        this.queryCache.set(cacheKey, {
          data: result.rows,
          timestamp: Date.now(),
          ttl: options.cacheTTL || 300000
        });
      }

      // Log slow queries
      if (duration > 1000) {
        console.warn(`Slow query detected (${duration}ms):`, sql);
      }

      return {
        ...result,
        duration,
        fromCache: false
      };

    } catch (error) {
      console.error('Query execution failed:', error);
      
      // Retry logic
      if (options.retries && options.retries > 0) {
        console.log(`Retrying query (${options.retries} attempts remaining)`);
        return this.query(sql, params, { ...options, retries: options.retries - 1 });
      }
      
      throw error;
    }
  }

  private executeQuery(sql: string, params: any[]): { rows: any[]; rowCount: number } {
    const operation = sql.trim().split(' ')[0].toUpperCase();
    
    switch (operation) {
      case 'SELECT':
        return this.executeSelectQuery(sql, params);
      case 'INSERT':
        return this.executeInsertQuery(sql, params);
      case 'UPDATE':
        return this.executeUpdateQuery(sql, params);
      case 'DELETE':
        return this.executeDeleteQuery(sql, params);
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }
  }

  private executeSelectQuery(sql: string, params: any[]): { rows: any[]; rowCount: number } {
    // Parse table name from SQL
    const tableMatch = sql.match(/FROM\s+(\w+)/i);
    if (!tableMatch) {
      throw new Error('Invalid SELECT query: table not found');
    }
    
    const tableName = tableMatch[1].toLowerCase();
    const storageKey = this.TABLES[tableName as keyof typeof this.TABLES];
    
    if (!storageKey) {
      throw new Error(`Table '${tableName}' not found`);
    }
    
    const data = localStorageService.getItem(storageKey) || [];
    
    // Simple WHERE clause parsing (basic implementation)
    let filteredData = data;
    const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s+ORDER|\s+LIMIT|$)/i);
    if (whereMatch) {
      const whereClause = whereMatch[1];
      filteredData = this.applyWhereClause(data, whereClause, params);
    }
    
    // Simple ORDER BY parsing
    const orderMatch = sql.match(/ORDER\s+BY\s+(\w+)(?:\s+(ASC|DESC))?/i);
    if (orderMatch) {
      const column = orderMatch[1];
      const direction = orderMatch[2]?.toUpperCase() || 'ASC';
      filteredData.sort((a, b) => {
        const aVal = a[column];
        const bVal = b[column];
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return direction === 'DESC' ? -comparison : comparison;
      });
    }
    
    // Simple LIMIT parsing
    const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
    if (limitMatch) {
      const limit = parseInt(limitMatch[1]);
      filteredData = filteredData.slice(0, limit);
    }
    
    return {
      rows: filteredData,
      rowCount: filteredData.length
    };
  }

  private executeInsertQuery(sql: string, params: any[]): { rows: any[]; rowCount: number } {
    const tableMatch = sql.match(/INSERT\s+INTO\s+(\w+)/i);
    if (!tableMatch) {
      throw new Error('Invalid INSERT query: table not found');
    }
    
    const tableName = tableMatch[1].toLowerCase();
    const storageKey = this.TABLES[tableName as keyof typeof this.TABLES];
    
    if (!storageKey) {
      throw new Error(`Table '${tableName}' not found`);
    }
    
    const data = localStorageService.getItem(storageKey) || [];
    
    // Generate new ID
    const newId = data.length > 0 ? Math.max(...data.map(item => item.id || 0)) + 1 : 1;
    
    const newRecord = {
      id: newId,
      ...params[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    data.push(newRecord);
    localStorageService.setItem(storageKey, data);
    
    return {
      rows: [newRecord],
      rowCount: 1
    };
  }

  private executeUpdateQuery(sql: string, params: any[]): { rows: any[]; rowCount: number } {
    const tableMatch = sql.match(/UPDATE\s+(\w+)/i);
    if (!tableMatch) {
      throw new Error('Invalid UPDATE query: table not found');
    }
    
    const tableName = tableMatch[1].toLowerCase();
    const storageKey = this.TABLES[tableName as keyof typeof this.TABLES];
    
    if (!storageKey) {
      throw new Error(`Table '${tableName}' not found`);
    }
    
    const data = localStorageService.getItem(storageKey) || [];
    
    // Parse WHERE clause
    const whereMatch = sql.match(/WHERE\s+(.+)$/i);
    let updatedCount = 0;
    const updatedRows: any[] = [];
    
    if (whereMatch) {
      const whereClause = whereMatch[1];
      const matchingIndices = this.findMatchingIndices(data, whereClause, params.slice(1));
      
      matchingIndices.forEach(index => {
        data[index] = {
          ...data[index],
          ...params[0],
          updatedAt: new Date().toISOString()
        };
        updatedRows.push(data[index]);
        updatedCount++;
      });
    }
    
    localStorageService.setItem(storageKey, data);
    
    return {
      rows: updatedRows,
      rowCount: updatedCount
    };
  }

  private executeDeleteQuery(sql: string, params: any[]): { rows: any[]; rowCount: number } {
    const tableMatch = sql.match(/DELETE\s+FROM\s+(\w+)/i);
    if (!tableMatch) {
      throw new Error('Invalid DELETE query: table not found');
    }
    
    const tableName = tableMatch[1].toLowerCase();
    const storageKey = this.TABLES[tableName as keyof typeof this.TABLES];
    
    if (!storageKey) {
      throw new Error(`Table '${tableName}' not found`);
    }
    
    const data = localStorageService.getItem(storageKey) || [];
    
    // Parse WHERE clause
    const whereMatch = sql.match(/WHERE\s+(.+)$/i);
    let deletedCount = 0;
    const deletedRows: any[] = [];
    
    if (whereMatch) {
      const whereClause = whereMatch[1];
      const matchingIndices = this.findMatchingIndices(data, whereClause, params);
      
      // Remove in reverse order to maintain indices
      matchingIndices.reverse().forEach(index => {
        deletedRows.push(data[index]);
        data.splice(index, 1);
        deletedCount++;
      });
    }
    
    localStorageService.setItem(storageKey, data);
    
    return {
      rows: deletedRows,
      rowCount: deletedCount
    };
  }

  private applyWhereClause(data: any[], whereClause: string, params: any[]): any[] {
    // Simple WHERE clause implementation
    // Supports basic conditions like "id = ?" or "name = ?"
    const conditionMatch = whereClause.match(/(\w+)\s*=\s*\?/);
    if (conditionMatch && params.length > 0) {
      const column = conditionMatch[1];
      const value = params[0];
      return data.filter(item => item[column] === value);
    }
    
    return data;
  }

  private findMatchingIndices(data: any[], whereClause: string, params: any[]): number[] {
    const indices: number[] = [];
    const conditionMatch = whereClause.match(/(\w+)\s*=\s*\?/);
    
    if (conditionMatch && params.length > 0) {
      const column = conditionMatch[1];
      const value = params[0];
      
      data.forEach((item, index) => {
        if (item[column] === value) {
          indices.push(index);
        }
      });
    }
    
    return indices;
  }

  async transaction<T>(callback: (db: DatabaseService) => Promise<T>): Promise<T> {
    const transactionId = `transaction_${Date.now()}`;
    
    try {
      this.performanceMonitor.startTiming(transactionId);
      
      // Begin transaction
      await this.query('BEGIN');
      
      const result = await callback(this);
      
      // Commit transaction
      await this.query('COMMIT');
      
      this.performanceMonitor.endTiming(transactionId);
      
      return result;
    } catch (error) {
      // Rollback transaction
      await this.query('ROLLBACK');
      
      console.error('Transaction failed:', error);
      throw error;
    }
  }

  async batchQuery<T = any>(queries: Array<{ sql: string; params?: any[] }>): Promise<QueryResult<T>[]> {
    const batchId = `batch_${Date.now()}`;
    
    try {
      this.performanceMonitor.startTiming(batchId);
      
      const results = await Promise.all(
        queries.map(({ sql, params }) => this.query<T>(sql, params))
      );
      
      this.performanceMonitor.endTiming(batchId);
      
      return results;
    } catch (error) {
      console.error('Batch query failed:', error);
      throw error;
    }
  }

  // Database optimization methods
  async analyzeQuery(sql: string): Promise<any> {
    // Simulate query analysis
    return {
      estimatedCost: Math.random() * 1000,
      estimatedRows: Math.floor(Math.random() * 10000),
      indexUsage: Math.random() > 0.5,
      recommendations: [
        'Consider adding an index on frequently queried columns',
        'Use LIMIT clause for large result sets',
        'Avoid SELECT * in production queries'
      ]
    };
  }

  async createIndex(table: string, columns: string[], unique: boolean = false): Promise<void> {
    const indexName = `idx_${table}_${columns.join('_')}`;
    const sql = `CREATE ${unique ? 'UNIQUE ' : ''}INDEX ${indexName} ON ${table} (${columns.join(', ')})`;
    
    await this.query(sql);
    console.log(`Index created: ${indexName}`);
  }

  async getTableStats(table: string): Promise<any> {
    const sql = `SELECT COUNT(*) as row_count FROM ${table}`;
    const result = await this.query(sql);
    
    return {
      tableName: table,
      rowCount: result.rows[0]?.row_count || 0,
      estimatedSize: Math.floor(Math.random() * 1000000), // Mock size in bytes
      lastUpdated: new Date().toISOString()
    };
  }

  // Cache management
  clearCache(): void {
    this.queryCache.clear();
    console.log('Query cache cleared');
  }

  getCacheStats(): any {
    return {
      size: this.queryCache.size,
      hitRate: Math.random() * 100, // Mock hit rate
      memoryUsage: this.queryCache.size * 1024 // Mock memory usage
    };
  }

  // Performance monitoring
  getPerformanceStats(): any {
    return {
      connectionCount: this.connectionCount,
      queryCount: this.queryCount,
      averageQueryTime: this.performanceMonitor.getAverageTime('query'),
      cacheStats: this.getCacheStats(),
      slowQueries: Math.floor(Math.random() * 10)
    };
  }

  // Health check
  async healthCheck(): Promise<{ status: string; details: any }> {
    try {
      const startTime = Date.now();
      await this.query('SELECT 1');
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'healthy',
        details: {
          responseTime,
          connectionCount: this.connectionCount,
          queryCount: this.queryCount,
          cacheSize: this.queryCache.size
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          connectionCount: this.connectionCount
        }
      };
    }
  }

  // Mock data generators
  private generateMockProducts(): any[] {
    return Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Product ${i + 1}`,
      price: Math.floor(Math.random() * 1000) + 10,
      category: ['Electronics', 'Clothing', 'Books'][Math.floor(Math.random() * 3)],
      inStock: Math.random() > 0.2,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    }));
  }

  private generateMockOrders(): any[] {
    return Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      customerId: Math.floor(Math.random() * 100) + 1,
      total: Math.floor(Math.random() * 500) + 50,
      status: ['pending', 'processing', 'shipped', 'delivered'][Math.floor(Math.random() * 4)],
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    }));
  }

  private generateMockCustomers(): any[] {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      name: `Customer ${i + 1}`,
      email: `customer${i + 1}@example.com`,
      totalOrders: Math.floor(Math.random() * 20),
      totalSpent: Math.floor(Math.random() * 5000) + 100,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
    }));
  }
}

// Database connection factory
export class DatabaseFactory {
  private static instances: Map<string, DatabaseService> = new Map();

  static create(name: string, config: DatabaseConfig): DatabaseService {
    if (!this.instances.has(name)) {
      this.instances.set(name, new DatabaseService(config));
    }
    return this.instances.get(name)!;
  }

  static get(name: string): DatabaseService | undefined {
    return this.instances.get(name);
  }

  static async closeAll(): Promise<void> {
    const promises = Array.from(this.instances.values()).map(db => db.disconnect());
    await Promise.all(promises);
    this.instances.clear();
  }
}

// Default database instance
export const db = DatabaseFactory.create('default', {
  host: import.meta.env.VITE_DB_HOST || 'localhost',
  port: parseInt(import.meta.env.VITE_DB_PORT || '5432'),
  database: import.meta.env.VITE_DB_NAME || 'ecommerce',
  username: import.meta.env.VITE_DB_USER || 'postgres',
  password: import.meta.env.VITE_DB_PASSWORD || 'password',
  ssl: import.meta.env.VITE_NODE_ENV === 'production',
  poolSize: 10,
  connectionTimeout: 30000,
  queryTimeout: 60000
});

export default DatabaseService;