import ApiClient from './ApiClient';
import { ABTest, ExperimentVariant, UserAssignment, ExperimentResult, ConversionGoal } from '../types';

/**
 * Dịch vụ hỗ trợ kiểm thử A/B cho chiến dịch marketing
 * Bao gồm tạo thử nghiệm, gán người dùng vào phiên bản, theo dõi kết quả và phân tích hiệu suất
 */
class ABTestingService {
  private apiClient: ApiClient;
  private userVariantCache: Record<string, string> = {}; // Cache gán phiên bản cho người dùng

  constructor() {
    this.apiClient = new ApiClient('/api/ab-testing');
  }

  /**
   * Tạo thử nghiệm A/B mới
   * @param experiment Thông tin thử nghiệm
   * @returns Thử nghiệm đã được tạo
   */
  async createExperiment(experiment: Omit<ABTest, 'id' | 'createdAt'>): Promise<ABTest> {
    try {
      // Xác thực cấu trúc thử nghiệm
      this.validateExperiment(experiment);

      const response = await this.apiClient.post<ABTest>('/experiments', experiment);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo thử nghiệm A/B:', error);
      throw new Error('Không thể tạo thử nghiệm A/B. Vui lòng kiểm tra thông tin và thử lại.');
    }
  }

  /**
   * Lấy danh sách tất cả thử nghiệm đang hoạt động
   * @returns Danh sách thử nghiệm
   */
  async getActiveExperiments(): Promise<ABTest[]> {
    try {
      const response = await this.apiClient.get<ABTest[]>('/experiments?status=active');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách thử nghiệm:', error);
      return [];
    }
  }

  /**
   * Gán phiên bản (variant) cho người dùng trong thử nghiệm
   * @param experimentId ID thử nghiệm
   * @param userId ID người dùng
   * @returns Phiên bản được gán và ID gán
   */
  async assignUserToVariant(experimentId: string, userId: string): Promise<UserAssignment> {
    try {
      // Kiểm tra cache trước
      const cacheKey = `${experimentId}_${userId}`;
      if (this.userVariantCache[cacheKey]) {
        return {
          experimentId,
          userId,
          variantId: this.userVariantCache[cacheKey],
          assignedAt: new Date().toISOString()
        };
      }

      const response = await this.apiClient.post<UserAssignment>('/assignments', {
        experimentId,
        userId
      });

      // Lưu vào cache
      this.userVariantCache[cacheKey] = response.data.variantId;
      return response.data;
    } catch (error) {
      console.error('Lỗi khi gán phiên bản cho người dùng:', error);
      // Trả về phiên bản mặc định nếu có lỗi
      return {
        experimentId,
        userId,
        variantId: 'control', // Phiên bản kiểm soát làm mặc định
        assignedAt: new Date().toISOString()
      };
    }
  }

  /**
   * Theo dõi chuyển đổi (conversion) của người dùng trong thử nghiệm
   * @param assignmentId ID gán phiên bản
   * @param goalId ID mục tiêu chuyển đổi
   * @returns Kết quả theo dõi
   */
  async trackConversion(assignmentId: string, goalId: string): Promise<{ success: boolean; conversionId: string }> {
    try {
      const response = await this.apiClient.post<{ success: boolean; conversionId: string }>('/conversions', {
        assignmentId,
        goalId,
        convertedAt: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi theo dõi chuyển đổi:', error);
      return { success: false, conversionId: '' };
    }
  }

  /**
   * Lấy kết quả thử nghiệm A/B
   * @param experimentId ID thử nghiệm
   * @returns Kết quả phân tích của thử nghiệm
   */
  async getExperimentResults(experimentId: string): Promise<ExperimentResult> {
    try {
      const response = await this.apiClient.get<ExperimentResult>(`/experiments/${experimentId}/results`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy kết quả thử nghiệm:', error);
      throw new Error('Không thể tải kết quả thử nghiệm.');
    }
  }

  /**
   * Tạo mục tiêu chuyển đổi mới cho thử nghiệm
   * @param goal Thông tin mục tiêu
   * @returns Mục tiêu đã được tạo
   */
  async createConversionGoal(goal: ConversionGoal): Promise<ConversionGoal> {
    try {
      const response = await this.apiClient.post<ConversionGoal>('/goals', goal);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo mục tiêu chuyển đổi:', error);
      throw new Error('Không thể tạo mục tiêu chuyển đổi.');
    }
  }

  /**
   * Xác thực cấu trúc thử nghiệm
   * @param experiment Thông tin thử nghiệm
   * @throws Lỗi nếu thông tin không hợp lệ
   */
  private validateExperiment(experiment: Omit<ABTest, 'id' | 'createdAt'>): void {
    if (!experiment.name || experiment.name.trim() === '') {
      throw new Error('Tên thử nghiệm không được để trống');
    }

    if (!experiment.variants || experiment.variants.length < 1) {
      throw new Error('Thử nghiệm phải có ít nhất một phiên bản (variant)');
    }

    if (!experiment.goalIds || experiment.goalIds.length === 0) {
      throw new Error('Thử nghiệm phải có ít nhất một mục tiêu chuyển đổi');
    }

    // Kiểm tra xem có phiên bản kiểm soát (control) không
    const hasControlVariant = experiment.variants.some(v => v.id === 'control');
    if (!hasControlVariant) {
      throw new Error('Thử nghiệm phải bao gồm phiên bản kiểm soát (control)');
    }
  }
}

export default new ABTestingService();