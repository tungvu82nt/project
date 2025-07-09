import DatabaseService from './DatabaseService';
import { Product } from '../types';
import { localStorageService } from './LocalStorageService';
import { products as mockProducts } from '../data/products';

class ProductService {
  private db: DatabaseService;
  private readonly TABLE_NAME = 'products';

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
    
    this.initializeProducts();
  }

  // Initialize products table with mock data if empty
  private async initializeProducts(): Promise<void> {
    try {
      const existingProducts = await this.getAllProducts();
      if (existingProducts.length === 0) {
        // Insert mock products
        for (const product of mockProducts) {
          await this.createProduct(product);
        }
      }
    } catch (error) {
      console.error('Error initializing products:', error);
    }
  }

  // Get all products
  async getAllProducts(): Promise<Product[]> {
    try {
      const result = await this.db.query(`SELECT * FROM ${this.TABLE_NAME}`);
      return result;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  // Get product by ID
  async getProductById(id: string): Promise<Product | null> {
    try {
      const result = await this.db.query(
        `SELECT * FROM ${this.TABLE_NAME} WHERE id = ?`,
        [id]
      );
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      return null;
    }
  }

  // Get products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const result = await this.db.query(
        `SELECT * FROM ${this.TABLE_NAME} WHERE category = ?`,
        [category]
      );
      return result;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  }

  // Search products
  async searchProducts(query: string): Promise<Product[]> {
    try {
      const allProducts = await this.getAllProducts();
      const searchTerm = query.toLowerCase();
      
      return allProducts.filter(product => 
        product.name.en.toLowerCase().includes(searchTerm) ||
        product.name.vi.toLowerCase().includes(searchTerm) ||
        product.name.zh.toLowerCase().includes(searchTerm) ||
        product.description.en.toLowerCase().includes(searchTerm) ||
        product.description.vi.toLowerCase().includes(searchTerm) ||
        product.description.zh.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  // Get featured products
  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const allProducts = await this.getAllProducts();
      return allProducts.filter(product => product.featured).slice(0, 8);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  }

  // Get products with pagination
  async getProductsPaginated(page: number = 1, limit: number = 12): Promise<{
    products: Product[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      const allProducts = await this.getAllProducts();
      const total = allProducts.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const products = allProducts.slice(startIndex, startIndex + limit);

      return {
        products,
        total,
        totalPages,
        currentPage: page
      };
    } catch (error) {
      console.error('Error fetching paginated products:', error);
      return {
        products: [],
        total: 0,
        totalPages: 0,
        currentPage: page
      };
    }
  }

  // Create new product
  async createProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
    try {
      const result = await this.db.query(
        `INSERT INTO ${this.TABLE_NAME}`,
        [product]
      );
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error creating product:', error);
      return null;
    }
  }

  // Update product
  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    try {
      const result = await this.db.query(
        `UPDATE ${this.TABLE_NAME} SET ? WHERE id = ?`,
        [updates, id]
      );
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error updating product:', error);
      return null;
    }
  }

  // Delete product
  async deleteProduct(id: string): Promise<boolean> {
    try {
      const result = await this.db.query(
        `DELETE FROM ${this.TABLE_NAME} WHERE id = ?`,
        [id]
      );
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }

  // Update product stock
  async updateStock(id: string, quantity: number): Promise<boolean> {
    try {
      const product = await this.getProductById(id);
      if (!product) return false;

      const newStock = Math.max(0, product.stock - quantity);
      const result = await this.updateProduct(id, { 
        stock: newStock,
        inStock: newStock > 0
      });
      
      return result !== null;
    } catch (error) {
      console.error('Error updating stock:', error);
      return false;
    }
  }

  // Get low stock products
  async getLowStockProducts(threshold: number = 10): Promise<Product[]> {
    try {
      const allProducts = await this.getAllProducts();
      return allProducts.filter(product => product.stock <= threshold);
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      return [];
    }
  }

  // Get product statistics
  async getProductStats(): Promise<{
    total: number;
    inStock: number;
    outOfStock: number;
    lowStock: number;
    categories: { [key: string]: number };
  }> {
    try {
      const allProducts = await this.getAllProducts();
      const stats = {
        total: allProducts.length,
        inStock: allProducts.filter(p => p.inStock).length,
        outOfStock: allProducts.filter(p => !p.inStock).length,
        lowStock: allProducts.filter(p => p.stock <= 10).length,
        categories: {} as { [key: string]: number }
      };

      // Count products by category
      allProducts.forEach(product => {
        stats.categories[product.category] = (stats.categories[product.category] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error fetching product stats:', error);
      return {
        total: 0,
        inStock: 0,
        outOfStock: 0,
        lowStock: 0,
        categories: {}
      };
    }
  }
}

export const productService = new ProductService();
export { ProductService };