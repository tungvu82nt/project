import ApiClient from './ApiClient';
import { MobileDevice, PushNotification, NotificationType, MobileUserData, DeviceRegistrationRequest } from '../types';

/**
 * Dịch vụ hỗ trợ API cho ứng dụng di động
 * Bao gồm đăng ký thiết bị, gửi thông báo push và lấy dữ liệu tối ưu cho thiết bị di động
 */
class MobileApiService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient('/api/mobile');
  }

  /**
   * Đăng ký thiết bị di động của người dùng
   * @param deviceInfo Thông tin thiết bị để đăng ký
   * @returns Thiết bị đã được đăng ký
   */
  async registerDevice(deviceInfo: DeviceRegistrationRequest): Promise<MobileDevice> {
    try {
      const response = await this.apiClient.post<MobileDevice>('/devices', deviceInfo);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi đăng ký thiết bị:', error);
      throw new Error('Không thể đăng ký thiết bị di động. Vui lòng thử lại.');
    }
  }

  /**
   * Hủy đăng ký thiết bị di động
   * @param deviceId ID thiết bị cần hủy đăng ký
   * @returns Kết quả hủy đăng ký
   */
  async unregisterDevice(deviceId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.apiClient.delete<{ success: boolean; message: string }>(`/devices/${deviceId}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi hủy đăng ký thiết bị:', error);
      throw new Error('Không thể hủy đăng ký thiết bị.');
    }
  }

  /**
   * Gửi thông báo push đến thiết bị
   * @param notification Thông tin thông báo
   * @returns Kết quả gửi thông báo
   */
  async sendPushNotification(notification: PushNotification): Promise<{ success: boolean; notificationId: string }> {
    try {
      const response = await this.apiClient.post<{ success: boolean; notificationId: string }>('/notifications', notification);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi gửi thông báo push:', error);
      throw new Error('Không thể gửi thông báo đến thiết bị.');
    }
  }

  /**
   * Lấy danh sách thông báo cho thiết bị
   * @param deviceId ID thiết bị
   * @param limit Số lượng thông báo tối đa
   * @returns Danh sách thông báo
   */
  async getNotifications(deviceId: string, limit: number = 20): Promise<PushNotification[]> {
    try {
      const response = await this.apiClient.get<PushNotification[]>(`/devices/${deviceId}/notifications?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy thông báo:', error);
      return [];
    }
  }

  /**
   * Cập nhật trạng thái đọc thông báo
   * @param notificationId ID thông báo
   * @param isRead Trạng thái đọc (true/false)
   * @returns Kết quả cập nhật
   */
  async markNotificationAsRead(notificationId: string, isRead: boolean = true): Promise<{ success: boolean }> {
    try {
      const response = await this.apiClient.patch<{ success: boolean }>(`/notifications/${notificationId}/read`, { isRead });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái thông báo:', error);
      return { success: false };
    }
  }

  /**
   * Lấy dữ liệu người dùng tối ưu cho ứng dụng di động
   * @param userId ID người dùng
   * @returns Dữ liệu người dùng di động
   */
  async getMobileUserData(userId: string): Promise<MobileUserData> {
    try {
      const response = await this.apiClient.get<MobileUserData>(`/users/${userId}/mobile-data`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu người dùng di động:', error);
      throw new Error('Không thể tải dữ liệu người dùng cho ứng dụng di động.');
    }
  }
}

export default new MobileApiService();