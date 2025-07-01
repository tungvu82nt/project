import ApiClient from './ApiClient';
import { UserEvent, EventType, UserBehaviorReport, ConversionMetric, TimeRange } from '../types';

/**
 * Dịch vụ phân tích dữ liệu người dùng
 * Bao gồm theo dõi hành vi người dùng, tạo báo cáo và phân tích chỉ số chuyển đổi
 */
class UserAnalyticsService {
  private apiClient: ApiClient;
  private userId: string | null;

  constructor() {
    this.apiClient = new ApiClient('/api/analytics');
    this.userId = localStorage.getItem('userId');
  }

  /**
   * Theo dõi một sự kiện hành vi người dùng
   * @param event Sự kiện cần theo dõi
   * @returns Kết quả theo dõi sự kiện
   */
  async trackEvent(event: Omit<UserEvent, 'userId' | 'timestamp'>): Promise<{ success: boolean; eventId: string }> {
    try {
      if (!this.userId) {
        throw new Error('Người dùng chưa đăng nhập');
      }

      const eventData: UserEvent = {
        ...event,
        userId: this.userId,
        timestamp: new Date().toISOString()
      };

      const response = await this.apiClient.post<{ success: boolean; eventId: string }>('/events', eventData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi theo dõi sự kiện:', error);
      // Tiếp tục trả về thành công để không ảnh hưởng trải nghiệm người dùng, nhưng ghi log lỗi
      return { success: false, eventId: '' };
    }
  }

  /**
   * Lấy báo cáo hành vi người dùng trong khoảng thời gian
   * @param timeRange Khoảng thời gian (hôm nay, tuần nay, tháng nay, tùy chỉnh)
   * @returns Báo cáo hành vi người dùng
   */
  async getUserBehaviorReport(timeRange: TimeRange): Promise<UserBehaviorReport> {
    try {
      if (!this.userId) {
        throw new Error('Người dùng chưa đăng nhập');
      }

      const params = new URLSearchParams();
      params.append('startDate', timeRange.startDate.toISOString());
      params.append('endDate', timeRange.endDate.toISOString());

      const response = await this.apiClient.get<UserBehaviorReport>(`/users/${this.userId}/behavior?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy báo cáo hành vi:', error);
      throw new Error('Không thể tải báo cáo hành vi người dùng.');
    }
  }

  /**
   * Lấy chỉ số chuyển đổi của sản phẩm
   * @param metric Loại chỉ số (tỷ lệ thêm vào giỏ, tỷ lệ thanh toán, tỷ lệ hoàn thành đơn hàng)
   * @param timeRange Khoảng thời gian
   * @returns Giá trị chỉ số chuyển đổi
   */
  async getConversionMetrics(metric: ConversionMetric, timeRange: TimeRange): Promise<number> {
    try {
      const params = new URLSearchParams();
      params.append('metric', metric);
      params.append('startDate', timeRange.startDate.toISOString());
      params.append('endDate', timeRange.endDate.toISOString());

      const response = await this.apiClient.get<{ value: number }>(`/conversions?${params.toString()}`);
      return response.data.value;
    } catch (error) {
      console.error(`Lỗi khi lấy chỉ số ${metric}:`, error);
      throw new Error(`Không thể lấy dữ liệu chỉ số ${metric}.`);
    }
  }

  /**
   * Lấy danh sách các sự kiện phổ biến nhất trong khoảng thời gian
   * @param limit Số lượng sự kiện tối đa
   * @param timeRange Khoảng thời gian
   * @returns Danh sách sự kiện phổ biến
   */
  async getTopEvents(limit: number = 10, timeRange: TimeRange): Promise<Array<{ eventType: EventType; count: number }>> {
    try {
      const params = new URLSearchParams();
      params.append('limit', limit.toString());
      params.append('startDate', timeRange.startDate.toISOString());
      params.append('endDate', timeRange.endDate.toISOString());

      const response = await this.apiClient.get<Array<{ eventType: EventType; count: number }>>('/events/top?${params.toString()}');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sự kiện phổ biến:', error);
      return [];
    }
  }

  /**
   * Cập nhật ID người dùng khi người dùng đăng nhập/đăng xuất
   * @param userId ID người dùng mới hoặc null nếu đăng xuất
   */
  updateUserId(userId: string | null): void {
    this.userId = userId;
    if (userId) {
      localStorage.setItem('userId', userId);
    } else {
      localStorage.removeItem('userId');
    }
  }
}

export default new UserAnalyticsService();