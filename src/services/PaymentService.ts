import ApiClient from './ApiClient';
import { PaymentMethod, PaymentRequest, PaymentResponse, PaymentStatus } from '../types';

/**
 * Dịch vụ quản lý các phương thức thanh toán
 * Bao gồm tích hợp với các cổng thanh toán như VNPAY, MoMo, ZaloPay và thẻ tín dụng
 */
class PaymentService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient('/api/payments');
  }

  /**
   * Tạo yêu cầu thanh toán mới
   * @param paymentRequest Thông tin yêu cầu thanh toán
   * @returns Phản hồi từ cổng thanh toán
   */
  async createPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Xác thực thông tin yêu cầu thanh toán
      this.validatePaymentRequest(paymentRequest);

      // Gửi yêu cầu đến cổng thanh toán tương ứng
      const response = await this.apiClient.post<PaymentResponse>('', paymentRequest);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo yêu cầu thanh toán:', error);
      throw this.handlePaymentError(error);
    }
  }

  /**
   * Kiểm tra trạng thái thanh toán
   * @param transactionId Mã giao dịch thanh toán
   * @returns Trạng thái hiện tại của giao dịch
   */
  async checkPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    try {
      const response = await this.apiClient.get<PaymentStatus>(`/${transactionId}/status`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi kiểm tra trạng thái thanh toán:', error);
      throw this.handlePaymentError(error);
    }
  }

  /**
   * Xử lý hoàn tiền giao dịch
   * @param transactionId Mã giao dịch cần hoàn tiền
   * @param amount Số tiền cần hoàn (nếu không chỉ định sẽ hoàn toàn bộ)
   * @returns Kết quả xử lý hoàn tiền
   */
  async refundPayment(transactionId: string, amount?: number): Promise<PaymentResponse> {
    try {
      const payload = amount ? { amount } : {};
      const response = await this.apiClient.post<PaymentResponse>(`/${transactionId}/refund`, payload);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi xử lý hoàn tiền:', error);
      throw this.handlePaymentError(error);
    }
  }

  /**
   * Lấy danh sách phương thức thanh toán hỗ trợ
   * @returns Danh sách phương thức thanh toán
   */
  getSupportedPaymentMethods(): PaymentMethod[] {
    return [
      { id: 'vnpay', name: 'VNPAY', description: 'Thanh toán qua VNPAY', isActive: true },
      { id: 'momo', name: 'MoMo', description: 'Thanh toán qua Ví MoMo', isActive: true },
      { id: 'zalopay', name: 'ZaloPay', description: 'Thanh toán qua ZaloPay', isActive: true },
      { id: 'credit_card', name: 'Thẻ tín dụng', description: 'Thanh toán qua thẻ Visa/MasterCard', isActive: true }
    ];
  }

  /**
   * Xác thực thông tin yêu cầu thanh toán
   * @param request Thông tin yêu cầu thanh toán
   * @throws Lỗi nếu thông tin không hợp lệ
   */
  private validatePaymentRequest(request: PaymentRequest): void {
    if (!request.amount || request.amount <= 0) {
      throw new Error('Số tiền thanh toán phải lớn hơn 0');
    }

    if (!request.paymentMethodId) {
      throw new Error('Phương thức thanh toán không được xác định');
    }

    if (!request.orderId) {
      throw new Error('Mã đơn hàng không được để trống');
    }
  }

  /**
   * Xử lý lỗi từ cổng thanh toán
   * @param error Lỗi nhận được
   * @returns Lỗi được định dạng lại
   */
  private handlePaymentError(error: unknown): Error {
    // Xử lý các mã lỗi từ cổng thanh toán khác nhau
    if (error instanceof Error) {
      return new Error(`Lỗi thanh toán: ${error.message}`);
    }

    return new Error('Đã xảy ra lỗi trong quá trình xử lý thanh toán');
  }
}

export default new PaymentService();