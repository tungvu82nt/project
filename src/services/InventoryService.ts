import { ApiClient } from '../api';
import { Product, InventoryItem, StockUpdate } from '../types';

/**
 * Dịch vụ quản lý kho hàng
 * Xử lý các hoạt động liên quan đến kiểm tra, cập nhật và quản lý tồn kho sản phẩm
 */
export class InventoryService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  /**
   * Lấy toàn bộ danh sách tồn kho
   * @returns Promise<InventoryItem[]>
   */
  async getInventory(): Promise<InventoryItem[]> {
    try {
      const response = await this.apiClient.get('/inventory');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tồn kho:', error);
      throw new Error('Không thể tải dữ liệu tồn kho. Vui lòng thử lại sau.');
    }
  }

  /**
   * Cập nhật số lượng tồn kho của sản phẩm
   * @param stockUpdate - Dữ liệu cập nhật tồn kho (productId, quantity, reason)
   * @returns Promise<InventoryItem>
   */
  async updateStock(stockUpdate: StockUpdate): Promise<InventoryItem> {
    try {
      const response = await this.apiClient.put(`/inventory/${stockUpdate.productId}`, stockUpdate);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật tồn kho:', error);
      throw new Error('Cập nhật tồn kho thất bại. Vui lòng kiểm tra thông tin và thử lại.');
    }
  }

  /**
   * Lấy danh sách sản phẩm có tồn kho thấp
   * @param threshold - Ngưỡng số lượng thấp (mặc định: 5)
   * @returns Promise<InventoryItem[]>
   */
  async getLowStockItems(threshold: number = 5): Promise<InventoryItem[]> {
    try {
      const response = await this.apiClient.get(`/inventory/low-stock?threshold=${threshold}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm tồn kho thấp:', error);
      throw new Error('Không thể tải danh sách sản phẩm tồn kho thấp.');
    }
  }

  /**
   * Lấy lịch sử thay đổi tồn kho của sản phẩm
   * @param productId - ID sản phẩm
   * @param limit - Số lượng bản ghi (mặc định: 20)
   * @returns Promise<StockUpdate[]>
   */
  async getStockHistory(productId: string, limit: number = 20): Promise<StockUpdate[]> {
    try {
      const response = await this.apiClient.get(`/inventory/${productId}/history?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử tồn kho:', error);
      throw new Error('Không thể tải lịch sử thay đổi tồn kho.');
    }
  }
}

// Tạo instance singleton để sử dụng trong toàn ứng dụng
export const inventoryService = new InventoryService();