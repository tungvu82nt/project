// Database service with optimization and monitoring
import { supabase } from './supabaseClient';
import { PerformanceMonitor } from '../utils/performance';
import { createAuditLog } from '../utils/security';

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
  private queryCache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private performanceMonitor: PerformanceMonitor;
  private connectionCount: number = 0;
  private queryCount: number = 0;

  constructor() {
    this.performanceMonitor = PerformanceMonitor.getInstance();
    console.log('Database service initialized with Supabase');
  }

  // Supabase manages connection pooling automatically
  private initializePool(): void {
    console.log('Supabase connection pool initialized');
  }

  // Kết nối tự động được quản lý bởi Supabase
  connect(): Promise<void> {
    console.log('Supabase connection established automatically');
    return Promise.resolve();
  }

  // Kết nối tự động được quản lý bởi Supabase
  disconnect(): Promise<void> {
    console.log('Supabase connection closed automatically');
    return Promise.resolve();
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

      let resultData: T[] = [];
      let rowCount = 0;
      const sqlLower = sql.toLowerCase();

      try {
        // Extract table name and operation from SQL (basic parsing)
        const tableMatch = sql.match(/from\s+([a-z_]+)/i) || sql.match(/into\s+([a-z_]+)/i);
        const tableName = tableMatch ? tableMatch[1] : '';

        if (!tableName) {
          throw new Error('Không thể xác định bảng từ câu lệnh SQL');
        }

        // Thực thi truy vấn với Supabase
        if (sqlLower.includes('select')) {
          const { data, error, count } = await supabase
            .from(tableName)
            .select('*', { count: 'exact' })
            .order('id', { ascending: false });

          if (error) throw error;
          resultData = data as T[];
          rowCount = count || 0;
        } else if (sqlLower.includes('insert')) {
          const { data, error } = await supabase
            .from(tableName)
            .insert(params[0])
            .select();

          if (error) throw error;
          resultData = data as T[];
          rowCount = resultData.length;
        } else if (sqlLower.includes('update')) {
          const idMatch = sql.match(/where\s+id\s*=\s*(\d+)/i);
          if (!idMatch) throw new Error('Cập nhật yêu cầu điều kiện WHERE id');

          const { data, error, count } = await supabase
            .from(tableName)
            .update(params[0])
            .eq('id', idMatch[1])
            .select();

          if (error) throw error;
          resultData = data as T[];
          rowCount = count || 0;
        } else if (sqlLower.includes('delete')) {
          const idMatch = sql.match(/where\s+id\s*=\s*(\d+)/i);
          if (!idMatch) throw new Error('Xóa yêu cầu điều kiện WHERE id');

          const { error, count } = await supabase
            .from(tableName)
            .delete()
            .eq('id', idMatch[1]);

          if (error) throw error;
          rowCount = count || 0;
        }
      } catch (error) {
        console.error('Lỗi thực thi truy vấn Supabase:', error);
        throw error;
      }

      const duration = this.performanceMonitor.endTiming(queryId);

      // Cache successful SELECT queries
      if (sql.toLowerCase().includes('select') && options.cache !== false) {
        this.queryCache.set(cacheKey, {
          data: mockData,
          timestamp: Date.now(),
          ttl: options.cacheTTL || 300000
        });
      }

      // Log slow queries
      if (duration > 1000) {
        console.warn(`Slow query detected (${duration}ms):`, sql);
      }

      return {
        rows: mockData,
        rowCount,
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

  async transaction<T>(queries: Array<{ sql: string; params: any[] }>): Promise<T[]> {
    const transactionId = `tx_${Date.now()}`;
    this.performanceMonitor.startTiming(transactionId);

    console.log(`Starting Supabase transaction with ${queries.length} queries`);

    try {
      // Supabase uses RPC for transactions or multiple operations
      const results = [];
      for (const query of queries) {
        const result = await this.query<T>(query.sql, query.params);
        results.push(result);
      }

      this.performanceMonitor.endTiming(transactionId);
      createAuditLog('transaction', 'success', { transactionId, queryCount: queries.length });

      return results as T[];
    } catch (error) {
      console.error('Transaction failed:', error);
      createAuditLog('transaction', 'error', { transactionId, error: error.message });
      throw new Error(`Transaction failed: ${error.message}`);
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
  async getStats(): Promise<DatabaseStats> {
    try {
      // Get real statistics from Supabase
      const { data: tableStats, error } = await supabase.rpc('get_database_stats');

      if (error) throw error;

      return {
        connectionCount: this.connectionCount,
        queryCount: this.queryCount,
        cacheHits: Array.from(this.queryCache.values()).filter(c => 
          Date.now() - c.timestamp < (c.ttl || 300000)
        ).length,
        averageQueryDuration: this.performanceMonitor.getAverageDuration('query'),
        slowQueries: this.performanceMonitor.getSlowOperations('query', 100).length,
        tables: tableStats || []
      };
    } catch (error) {
      console.error('Error fetching database stats:', error);
      // Return basic stats if RPC call fails
      return {
        connectionCount: this.connectionCount,
        queryCount: this.queryCount,
        cacheHits: 0,
        averageQueryDuration: 0,
        slowQueries: 0,
        tables: []
      };
    }
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
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'ecommerce',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  ssl: process.env.NODE_ENV === 'production',
  poolSize: 10,
  connectionTimeout: 30000,
  queryTimeout: 60000
});

export default DatabaseService;