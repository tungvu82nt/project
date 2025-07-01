import ApiClient from './ApiClient';
import { Affiliate, Commission, Referral, ProgramStatus, Payout } from '../types';

/**
 * Dịch vụ quản lý chương trình liên kết
 * Bao gồm quản lý thành viên liên kết, theo dõi giới thiệu, tính hoa hồng và thanh toán
 */
class AffiliateProgramService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient('/api/affiliate');
  }

  /**
   * Đăng ký làm thành viên liên kết
   * @param affiliateInfo Thông tin thành viên liên kết
   * @returns Thành viên liên kết đã được đăng ký
   */
  async registerAffiliate(affiliateInfo: Omit<Affiliate, 'id' | 'status' | 'createdAt'>): Promise<Affiliate> {
    try {
      const response = await this.apiClient.post<Affiliate>('/members', affiliateInfo);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi đăng ký thành viên liên kết:', error);
      throw new Error('Không thể đăng ký chương trình liên kết. Vui lòng thử lại sau.');
    }
  }

  /**
   * Lấy thông tin thành viên liên kết theo ID
   * @param affiliateId ID thành viên liên kết
   * @returns Thông tin thành viên liên kết
   */
  async getAffiliateInfo(affiliateId: string): Promise<Affiliate> {
    try {
      const response = await this.apiClient.get<Affiliate>(`/members/${affiliateId}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin thành viên liên kết:', error);
      throw new Error('Không thể tải thông tin liên kết.');
    }
  }

  /**
   * Tạo liên kết giới thiệu cho thành viên
   * @param affiliateId ID thành viên liên kết
   * @param campaignId ID chiến dịch (tùy chọn)
   * @returns Liên kết giới thiệu
   */
  async generateReferralLink(affiliateId: string, campaignId?: string): Promise<{ referralLink: string; trackingCode: string }> {
    try {
      const payload = campaignId ? { campaignId } : {};
      const response = await this.apiClient.post<{ referralLink: string; trackingCode: string }>(`/members/${affiliateId}/referral-links`, payload);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo liên kết giới thiệu:', error);
      throw new Error('Không thể tạo liên kết giới thiệu.');
    }
  }

  /**
   * Lấy danh sách giới thiệu của thành viên
   * @param affiliateId ID thành viên liên kết
   * @param status Trạng thái giới thiệu (tùy chọn)
   * @returns Danh sách giới thiệu
   */
  async getReferrals(affiliateId: string, status?: string): Promise<Referral[]> {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);

      const response = await this.apiClient.get<Referral[]>(`/members/${affiliateId}/referrals?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách giới thiệu:', error);
      return [];
    }
  }

  /**
   * Lấy danh sách hoa hồng của thành viên
   * @param affiliateId ID thành viên liên kết
   * @param timeRange Khoảng thời gian (tùy chọn)
   * @returns Danh sách hoa hồng
   */
  async getCommissions(affiliateId: string, timeRange?: { startDate: string; endDate: string }): Promise<Commission[]> {
    try {
      const params = new URLSearchParams();
      if (timeRange) {
        params.append('startDate', timeRange.startDate);
        params.append('endDate', timeRange.endDate);
      }

      const response = await this.apiClient.get<Commission[]>(`/members/${affiliateId}/commissions?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách hoa hồng:', error);
      return [];
    }
  }

  /**
   * Yêu cầu thanh toán hoa hồng
   * @param affiliateId ID thành viên liên kết
   * @param amount Số tiền yêu cầu thanh toán
   * @param paymentMethod Phương thức thanh toán
   * @returns Yêu cầu thanh toán
   */
  async requestPayout(affiliateId: string, amount: number, paymentMethod: string): Promise<Payout> {
    try {
      const payload = {
        affiliateId,
        amount,
        paymentMethod,
        requestedAt: new Date().toISOString()
      };

      const response = await this.apiClient.post<Payout>('/payouts', payload);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi yêu cầu thanh toán:', error);
      throw new Error('Không thể tạo yêu cầu thanh toán.');
    }
  }

  /**
   * Lấy danh sách yêu cầu thanh toán
   * @param affiliateId ID thành viên liên kết
   * @returns Danh sách yêu cầu thanh toán
   */
  async getPayoutHistory(affiliateId: string): Promise<Payout[]> {
    try {
      const response = await this.apiClient.get<Payout[]>(`/members/${affiliateId}/payouts`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử thanh toán:', error);
      return [];
    }
  }

  /**
   * Cập nhật trạng thái chương trình liên kết
   * @param affiliateId ID thành viên liên kết
   * @param status Trạng thái mới
   * @returns Thành viên liên kết đã được cập nhật
   */
  async updateProgramStatus(affiliateId: string, status: ProgramStatus): Promise<Affiliate> {
    try {
      const response = await this.apiClient.patch<Affiliate>(`/members/${affiliateId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái chương trình:', error);
      throw new Error('Không thể cập nhật trạng thái chương trình.');
    }
  }
}

export default new AffiliateProgramService();