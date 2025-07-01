import { SocialPlatform, ShareContent, ShareResponse } from '../types';

/**
 * Dịch vụ hỗ trợ chia sẻ nội dung lên các nền tảng mạng xã hội
 * Bao gồm Facebook, Twitter, Instagram, LinkedIn và WhatsApp
 */
class SocialShareService {
  /**
   * Danh sách các nền tảng hỗ trợ
   */
  getSupportedPlatforms(): SocialPlatform[] {
    return [
      { id: 'facebook', name: 'Facebook', icon: 'facebook-icon', isActive: true },
      { id: 'twitter', name: 'Twitter', icon: 'twitter-icon', isActive: true },
      { id: 'instagram', name: 'Instagram', icon: 'instagram-icon', isActive: true },
      { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin-icon', isActive: true },
      { id: 'whatsapp', name: 'WhatsApp', icon: 'whatsapp-icon', isActive: true }
    ];
  }

  /**
   * Tạo URL chia sẻ cho nền tảng cụ thể
   * @param platformId ID nền tảng
   * @param content Nội dung cần chia sẻ
   * @returns URL chia sẻ hoặc null nếu không hỗ trợ
   */
  createShareUrl(platformId: string, content: ShareContent): string | null {
    switch (platformId.toLowerCase()) {
      case 'facebook':
        return this.createFacebookShareUrl(content);
      case 'twitter':
        return this.createTwitterShareUrl(content);
      case 'linkedin':
        return this.createLinkedInShareUrl(content);
      case 'whatsapp':
        return this.createWhatsappShareUrl(content);
      default:
        console.warn(`Nền tảng ${platformId} không được hỗ trợ`);
        return null;
    }
  }

  /**
   * Chia sẻ nội dung qua API (nếu có)
   * @param platformId ID nền tảng
   * @param content Nội dung cần chia sẻ
   * @returns Kết quả chia sẻ
   */
  async shareViaApi(platformId: string, content: ShareContent): Promise<ShareResponse> {
    try {
      // Trong thực tế, đây sẽ gọi đến API của nền tảng tương ứng
      // Với các yêu cầu xác thực OAuth
      console.log(`Chia sẻ qua API tới ${platformId}:`, content);

      // Giả lập phản hồi thành công
      return {
        success: true,
        platform: platformId,
        shareId: `share_${Date.now()}`,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Lỗi khi chia sẻ qua API tới ${platformId}:`, error);
      return {
        success: false,
        platform: platformId,
        error: error instanceof Error ? error.message : 'Lỗi không xác định'
      };
    }
  }

  /**
   * Theo dõi số lượt chia sẻ thành công
   * @param contentId ID nội dung được chia sẻ
   * @param platformId ID nền tảng
   */
  trackShare(contentId: string, platformId: string): void {
    // Gửi dữ liệu tới dịch vụ phân tích
    if (window.analytics) {
      window.analytics.track('Content Shared', {
        contentId,
        platform: platformId,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Tạo URL chia sẻ cho Facebook
   */
  private createFacebookShareUrl(content: ShareContent): string {
    const params = new URLSearchParams({
      u: content.url || window.location.href,
      quote: content.title || '',
      hashtag: content.hashtags?.join(',') || ''
    });
    return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
  }

  /**
   * Tạo URL chia sẻ cho Twitter
   */
  private createTwitterShareUrl(content: ShareContent): string {
    const params = new URLSearchParams({
      url: content.url || window.location.href,
      text: content.title || '',
      hashtags: content.hashtags?.join(',') || '',
      via: content.twitterHandle || ''
    });
    return `https://twitter.com/intent/tweet?${params.toString()}`;
  }

  /**
   * Tạo URL chia sẻ cho LinkedIn
   */
  private createLinkedInShareUrl(content: ShareContent): string {
    const params = new URLSearchParams({
      url: content.url || window.location.href,
      title: content.title || '',
      summary: content.description || ''
    });
    return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`;
  }

  /**
   * Tạo URL chia sẻ cho WhatsApp
   */
  private createWhatsappShareUrl(content: ShareContent): string {
    const text = `${content.title || ''} ${content.url || window.location.href}`;
    const params = new URLSearchParams({
      text: encodeURIComponent(text)
    });
    return `https://api.whatsapp.com/send?${params.toString()}`;
  }
}

export default new SocialShareService();