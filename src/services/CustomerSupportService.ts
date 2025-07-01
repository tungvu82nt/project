import ApiClient from './ApiClient';
import { SupportTicket, ChatSession, Message, SupportStatus, SupportAgent } from '../types';

/**
 * Dịch vụ quản lý hỗ trợ khách hàng trực tuyến
 * Bao gồm tạo vé hỗ trợ, trò chuyện trực tuyến và theo dõi trạng thái hỗ trợ
 */
class CustomerSupportService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient('/api/support');
  }

  /**
   * Tạo vé hỗ trợ mới
   * @param ticket Thông tin vé hỗ trợ
   * @returns Vé hỗ trợ đã được tạo
   */
  async createSupportTicket(ticket: Omit<SupportTicket, 'id' | 'status' | 'createdAt'>): Promise<SupportTicket> {
    try {
      const response = await this.apiClient.post<SupportTicket>('/tickets', ticket);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo vé hỗ trợ:', error);
      throw new Error('Không thể tạo vé hỗ trợ. Vui lòng thử lại sau.');
    }
  }

  /**
   * Lấy danh sách vé hỗ trợ của người dùng
   * @param userId ID người dùng
   * @returns Danh sách vé hỗ trợ
   */
  async getUserSupportTickets(userId: string): Promise<SupportTicket[]> {
    try {
      const response = await this.apiClient.get<SupportTicket[]>(`/tickets?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách vé hỗ trợ:', error);
      throw new Error('Không thể lấy danh sách vé hỗ trợ.');
    }
  }

  /**
   * Mở phiên trò chuyện trực tuyến mới
   * @param userId ID người dùng
   * @param initialMessage Tin nhắn khởi tạo
   * @returns Phiên trò chuyện đã được tạo
   */
  async startChatSession(userId: string, initialMessage: string): Promise<ChatSession> {
    try {
      const payload = {
        userId,
        initialMessage,
        timestamp: new Date().toISOString()
      };
      const response = await this.apiClient.post<ChatSession>('/chats', payload);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi bắt đầu phiên trò chuyện:', error);
      throw new Error('Không thể kết nối đến hỗ trợ trực tuyến. Vui lòng thử lại sau.');
    }
  }

  /**
   * Gửi tin nhắn trong phiên trò chuyện
   * @param sessionId ID phiên trò chuyện
   * @param message Tin nhắn
   * @param isUserMessage Xác định tin nhắn từ người dùng hay nhân viên hỗ trợ
   * @returns Tin nhắn đã được gửi
   */
  async sendChatMessage(sessionId: string, message: string, isUserMessage: boolean = true): Promise<Message> {
    try {
      const payload = {
        sessionId,
        message,
        isUserMessage,
        timestamp: new Date().toISOString()
      };
      const response = await this.apiClient.post<Message>(`/chats/${sessionId}/messages`, payload);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error);
      throw new Error('Không thể gửi tin nhắn. Vui lòng thử lại.');
    }
  }

  /**
   * Lấy lịch sử tin nhắn của phiên trò chuyện
   * @param sessionId ID phiên trò chuyện
   * @returns Danh sách tin nhắn
   */
  async getChatHistory(sessionId: string): Promise<Message[]> {
    try {
      const response = await this.apiClient.get<Message[]>(`/chats/${sessionId}/messages`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử trò chuyện:', error);
      throw new Error('Không thể lấy lịch sử trò chuyện.');
    }
  }

  /**
   * Kiểm tra trạng thái hỗ trợ trực tuyến
   * @returns Trạng thái hỗ trợ và thông tin nhân viên trực tuyến
   */
  async getSupportStatus(): Promise<{ status: SupportStatus; activeAgents: SupportAgent[] }> {
    try {
      const response = await this.apiClient.get<{ status: SupportStatus; activeAgents: SupportAgent[] }>('/status');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi kiểm tra trạng thái hỗ trợ:', error);
      // Trả về trạng thái mặc định nếu không thể kết nối
      return { status: 'offline', activeAgents: [] };
    }
  }
}

export default new CustomerSupportService();