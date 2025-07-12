import DatabaseService from './DatabaseService';
import { Category } from '../types/category';
import { localStorageService } from './LocalStorageService';
import { normalizeText, ensureDisplaySafe, fixVietnameseEncoding } from '../utils/encoding';

// Mock categories data
const mockCategories: Omit<Category, 'id'>[] = [
  {
    name: 'Electronics',
    description: 'Electronic devices and gadgets',
    slug: 'electronics',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
    productCount: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Clothing',
    description: 'Fashion and apparel',
    slug: 'clothing',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
    productCount: 25,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Home & Garden',
    description: 'Home improvement and garden supplies',
    slug: 'home-garden',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    productCount: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Sports & Outdoors',
    description: 'Sports equipment and outdoor gear',
    slug: 'sports-outdoors',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    productCount: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Books',
    description: 'Books and educational materials',
    slug: 'books',
    status: 'inactive',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
    productCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

class CategoryService {
  private db: DatabaseService;
  private readonly TABLE_NAME = 'categories';

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
    
    this.initializeCategories();
  }

  // Initialize categories table with mock data if empty
  private async initializeCategories(): Promise<void> {
    try {
      const existingCategories = await this.getAllCategories();
      if (existingCategories.length === 0) {
        // Insert mock categories
        for (const category of mockCategories) {
          await this.createCategory(category);
        }
      }
    } catch (error) {
      console.error('Error initializing categories:', error);
    }
  }

  // Get all categories
  async getAllCategories(): Promise<Category[]> {
    try {
      const result = await this.db.query(`SELECT * FROM ${this.TABLE_NAME} ORDER BY name ASC`);
      return result;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  // Get category by ID
  async getCategoryById(id: string): Promise<Category | null> {
    try {
      const result = await this.db.query(
        `SELECT * FROM ${this.TABLE_NAME} WHERE id = ?`,
        [id]
      );
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error fetching category by ID:', error);
      return null;
    }
  }

  // Get category by slug
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const result = await this.db.query(
        `SELECT * FROM ${this.TABLE_NAME} WHERE slug = ?`,
        [slug]
      );
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error fetching category by slug:', error);
      return null;
    }
  }

  // Get active categories
  async getActiveCategories(): Promise<Category[]> {
    try {
      const result = await this.db.query(
        `SELECT * FROM ${this.TABLE_NAME} WHERE status = 'active' ORDER BY name ASC`
      );
      return result;
    } catch (error) {
      console.error('Error fetching active categories:', error);
      return [];
    }
  }

  // Get parent categories (categories without parentId)
  async getParentCategories(): Promise<Category[]> {
    try {
      const result = await this.db.query(
        `SELECT * FROM ${this.TABLE_NAME} WHERE parentId IS NULL ORDER BY name ASC`
      );
      return result;
    } catch (error) {
      console.error('Error fetching parent categories:', error);
      return [];
    }
  }

  // Get subcategories by parent ID
  async getSubcategories(parentId: string): Promise<Category[]> {
    try {
      const result = await this.db.query(
        `SELECT * FROM ${this.TABLE_NAME} WHERE parentId = ? ORDER BY name ASC`,
        [parentId]
      );
      return result;
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      return [];
    }
  }

  // Search categories
  async searchCategories(query: string): Promise<Category[]> {
    try {
      const allCategories = await this.getAllCategories();
      
      // Normalize and fix encoding for search term
      let normalizedQuery = normalizeText(query);
      normalizedQuery = fixVietnameseEncoding(normalizedQuery);
      const searchTerm = ensureDisplaySafe(normalizedQuery).toLowerCase();
      
      return allCategories.filter(category => {
        // Helper function to safely process text for comparison
        const processText = (text: string) => {
          let processed = normalizeText(text);
          processed = fixVietnameseEncoding(processed);
          return ensureDisplaySafe(processed).toLowerCase();
        };
        
        return processText(category.name).includes(searchTerm) ||
               processText(category.description).includes(searchTerm) ||
               processText(category.slug).includes(searchTerm);
      });
    } catch (error) {
      console.error('Error searching categories:', error);
      return [];
    }
  }

  // Get categories with pagination
  async getCategoriesPaginated(page: number = 1, limit: number = 10): Promise<{
    categories: Category[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      const allCategories = await this.getAllCategories();
      const total = allCategories.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const categories = allCategories.slice(startIndex, startIndex + limit);

      return {
        categories,
        total,
        totalPages,
        currentPage: page
      };
    } catch (error) {
      console.error('Error fetching paginated categories:', error);
      return {
        categories: [],
        total: 0,
        totalPages: 0,
        currentPage: page
      };
    }
  }

  // Create new category
  async createCategory(category: Omit<Category, 'id'>): Promise<Category | null> {
    try {
      // Generate unique slug if not provided
      if (!category.slug) {
        category.slug = this.generateSlug(category.name);
      }
      
      // Check if slug already exists
      const existingCategory = await this.getCategoryBySlug(category.slug);
      if (existingCategory) {
        throw new Error('Category with this slug already exists');
      }

      const categoryWithTimestamps = {
        ...category,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const result = await this.db.query(
        `INSERT INTO ${this.TABLE_NAME}`,
        [categoryWithTimestamps]
      );
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error creating category:', error);
      return null;
    }
  }

  // Update category
  async updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    try {
      // If updating name and no slug provided, generate new slug
      if (updates.name && !updates.slug) {
        updates.slug = this.generateSlug(updates.name);
      }
      
      // Check if new slug already exists (excluding current category)
      if (updates.slug) {
        const existingCategory = await this.getCategoryBySlug(updates.slug);
        if (existingCategory && existingCategory.id !== id) {
          throw new Error('Category with this slug already exists');
        }
      }

      const updatesWithTimestamp = {
        ...updates,
        updatedAt: new Date().toISOString()
      };

      const result = await this.db.query(
        `UPDATE ${this.TABLE_NAME} SET ? WHERE id = ?`,
        [updatesWithTimestamp, id]
      );
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error updating category:', error);
      return null;
    }
  }

  // Delete category
  async deleteCategory(id: string): Promise<boolean> {
    try {
      // Check if category has subcategories
      const subcategories = await this.getSubcategories(id);
      if (subcategories.length > 0) {
        throw new Error('Cannot delete category with subcategories');
      }

      // TODO: Check if category has products
      // const productsInCategory = await productService.getProductsByCategory(id);
      // if (productsInCategory.length > 0) {
      //   throw new Error('Cannot delete category with products');
      // }

      const result = await this.db.query(
        `DELETE FROM ${this.TABLE_NAME} WHERE id = ?`,
        [id]
      );
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  }

  // Toggle category status
  async toggleStatus(id: string): Promise<Category | null> {
    try {
      const category = await this.getCategoryById(id);
      if (!category) return null;

      const newStatus = category.status === 'active' ? 'inactive' : 'active';
      return await this.updateCategory(id, { status: newStatus });
    } catch (error) {
      console.error('Error toggling category status:', error);
      return null;
    }
  }

  // Get category statistics
  async getCategoryStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    withProducts: number;
    parentCategories: number;
    subcategories: number;
  }> {
    try {
      const allCategories = await this.getAllCategories();
      const stats = {
        total: allCategories.length,
        active: allCategories.filter(c => c.status === 'active').length,
        inactive: allCategories.filter(c => c.status === 'inactive').length,
        withProducts: allCategories.filter(c => (c.productCount || 0) > 0).length,
        parentCategories: allCategories.filter(c => !c.parentId).length,
        subcategories: allCategories.filter(c => c.parentId).length
      };

      return stats;
    } catch (error) {
      console.error('Error fetching category stats:', error);
      return {
        total: 0,
        active: 0,
        inactive: 0,
        withProducts: 0,
        parentCategories: 0,
        subcategories: 0
      };
    }
  }

  // Update product count for category
  async updateProductCount(categoryId: string, count: number): Promise<boolean> {
    try {
      const result = await this.updateCategory(categoryId, { productCount: count });
      return result !== null;
    } catch (error) {
      console.error('Error updating product count:', error);
      return false;
    }
  }

  // Generate slug from name
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  }

  // Validate category data
  private validateCategory(category: Partial<Category>): string[] {
    const errors: string[] = [];

    if (category.name && category.name.trim().length < 2) {
      errors.push('Category name must be at least 2 characters long');
    }

    if (category.description && category.description.trim().length < 10) {
      errors.push('Category description must be at least 10 characters long');
    }

    if (category.slug && !/^[a-z0-9-]+$/.test(category.slug)) {
      errors.push('Category slug can only contain lowercase letters, numbers, and hyphens');
    }

    return errors;
  }
}

export const categoryService = new CategoryService();
export { CategoryService };