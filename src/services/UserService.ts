import { ApiClient } from '../api';
import { User } from '../types';

/**
 * Dịch vụ quản lý thông tin người dùng
 * Xử lý các hoạt động liên quan đến hồ sơ, cập nhật thông tin và thay đổi mật khẩu
 */
export class UserService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  /**
   * Lấy thông tin hồ sơ người dùng từ API
   * @returns Promise<User> - Thông tin chi tiết người dùng
   */
  async getUserProfile(): Promise<User> {
    try {
      const response = await this.apiClient.get('/users/profile');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin hồ sơ người dùng:', error);
      throw new Error('Không thể tải thông tin hồ sơ. Vui lòng thử lại sau.');
    }
  }

  /**
   * Cập nhật thông tin hồ sơ người dùng
   * @param profileData - Dữ liệu hồ sơ cần cập nhật (tên, số điện thoại, địa chỉ)
   * @returns Promise<User> - Thông tin người dùng sau khi cập nhật
   */
  async updateUserProfile(profileData: Partial<Omit<User, 'id' | 'email' | 'role'>>): Promise<User> {
    try {
      const response = await this.apiClient.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin hồ sơ:', error);
      throw new Error('Cập nhật hồ sơ thất bại. Vui lòng kiểm tra thông tin và thử lại.');
    }
  }

  /**
   * Thay đổi mật khẩu người dùng
   * @param currentPassword - Mật khẩu hiện tại
   * @param newPassword - Mật khẩu mới
   * @returns Promise<{ success: boolean; message: string }>
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.apiClient.post('/users/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi thay đổi mật khẩu:', error);
      throw new Error('Thay đổi mật khẩu thất bại. Vui lòng kiểm tra mật khẩu hiện tại và thử lại.');
    }
  }

  /**
   * Lấy lịch sử đơn hàng của người dùng
   * @returns Promise<Order[]>
   */
  async getUserOrders(): Promise<Order[]> {
    try {
      const response = await this.apiClient.get('/users/orders');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử đơn hàng:', error);
      throw new Error('Không thể tải lịch sử đơn hàng. Vui lòng thử lại sau.');
    }
  }
}

// Tạo instance singleton để sử dụng trong toàn ứng dụng
export const userService = new UserService();