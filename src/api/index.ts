// RESTful API implementation
import { createSecureRequest, handleSecureError } from '../utils/security';
import { cacheManager } from '../utils/performance';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// API Response types
interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Base API client
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = `api_${endpoint}_${JSON.stringify(options)}`;

    // Check cache for GET requests
    if (!options.method || options.method === 'GET') {
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    try {
      const secureOptions = createSecureRequest(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const response = await fetch(url, secureOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || 'API request failed',
          response.status,
          errorData.code
        );
      }

      const data = await response.json();
      
      // Cache successful GET requests
      if (!options.method || options.method === 'GET') {
        cacheManager.set(cacheKey, data, 5 * 60 * 1000); // 5 minutes
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      const secureError = handleSecureError(error);
      throw new ApiError(secureError.message, 500, secureError.code);
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Authentication API
export const authApi = {
  login: (credentials: { email: string; password: string; twoFactorCode?: string }) =>
    apiClient.post<{ user: any; token: string; refreshToken: string }>('/auth/login', credentials),
  
  register: (userData: { name: string; email: string; password: string }) =>
    apiClient.post<{ user: any; token: string }>('/auth/register', userData),
  
  logout: () =>
    apiClient.post<{}>('/auth/logout'),
  
  refreshToken: (refreshToken: string) =>
    apiClient.post<{ token: string; refreshToken: string }>('/auth/refresh', { refreshToken }),
  
  forgotPassword: (email: string) =>
    apiClient.post<{}>('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) =>
    apiClient.post<{}>('/auth/reset-password', { token, password }),
  
  verifyEmail: (token: string) =>
    apiClient.post<{}>('/auth/verify-email', { token }),
  
  enable2FA: () =>
    apiClient.post<{ qrCode: string; secret: string }>('/auth/2fa/enable'),
  
  verify2FA: (code: string) =>
    apiClient.post<{}>('/auth/2fa/verify', { code }),
  
  disable2FA: (code: string) =>
    apiClient.post<{}>('/auth/2fa/disable', { code }),
};

// Products API
export const productsApi = {
  getProducts: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiClient.get<PaginatedResponse<any>>(`/products${queryString}`);
  },
  
  getProduct: (id: string) =>
    apiClient.get<any>(`/products/${id}`),
  
  createProduct: (productData: any) =>
    apiClient.post<any>('/products', productData),
  
  updateProduct: (id: string, productData: any) =>
    apiClient.put<any>(`/products/${id}`, productData),
  
  deleteProduct: (id: string) =>
    apiClient.delete<{}>(`/products/${id}`),
  
  getCategories: () =>
    apiClient.get<string[]>('/products/categories'),
  
  uploadProductImage: (productId: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient.post<{ url: string }>(`/products/${productId}/images`, formData);
  },
  
  getRelatedProducts: (productId: string) =>
    apiClient.get<any[]>(`/products/${productId}/related`),
  
  getProductReviews: (productId: string, page?: number) =>
    apiClient.get<PaginatedResponse<any>>(`/products/${productId}/reviews?page=${page || 1}`),
  
  addProductReview: (productId: string, review: { rating: number; comment: string }) =>
    apiClient.post<any>(`/products/${productId}/reviews`, review),
};

// Orders API
export const ordersApi = {
  getOrders: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiClient.get<PaginatedResponse<any>>(`/orders${queryString}`);
  },
  
  getOrder: (id: string) =>
    apiClient.get<any>(`/orders/${id}`),
  
  createOrder: (orderData: any) =>
    apiClient.post<any>('/orders', orderData),
  
  updateOrderStatus: (id: string, status: string) =>
    apiClient.patch<any>(`/orders/${id}/status`, { status }),
  
  cancelOrder: (id: string, reason?: string) =>
    apiClient.patch<any>(`/orders/${id}/cancel`, { reason }),
  
  getOrderTracking: (id: string) =>
    apiClient.get<any>(`/orders/${id}/tracking`),
  
  processRefund: (id: string, amount: number, reason: string) =>
    apiClient.post<any>(`/orders/${id}/refund`, { amount, reason }),
  
  generateInvoice: (id: string) =>
    apiClient.get<{ url: string }>(`/orders/${id}/invoice`),
};

// Customers API
export const customersApi = {
  getCustomers: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiClient.get<PaginatedResponse<any>>(`/customers${queryString}`);
  },
  
  getCustomer: (id: string) =>
    apiClient.get<any>(`/customers/${id}`),
  
  updateCustomer: (id: string, customerData: any) =>
    apiClient.put<any>(`/customers/${id}`, customerData),
  
  getCustomerOrders: (id: string, page?: number) =>
    apiClient.get<PaginatedResponse<any>>(`/customers/${id}/orders?page=${page || 1}`),
  
  getCustomerAddresses: (id: string) =>
    apiClient.get<any[]>(`/customers/${id}/addresses`),
  
  addCustomerAddress: (id: string, address: any) =>
    apiClient.post<any>(`/customers/${id}/addresses`, address),
  
  updateCustomerAddress: (customerId: string, addressId: string, address: any) =>
    apiClient.put<any>(`/customers/${customerId}/addresses/${addressId}`, address),
  
  deleteCustomerAddress: (customerId: string, addressId: string) =>
    apiClient.delete<{}>(`/customers/${customerId}/addresses/${addressId}`),
};

// Analytics API
export const analyticsApi = {
  getDashboardStats: (dateRange?: { start: string; end: string }) =>
    apiClient.get<any>(`/analytics/dashboard${dateRange ? `?start=${dateRange.start}&end=${dateRange.end}` : ''}`),
  
  getSalesData: (period: 'day' | 'week' | 'month' | 'year', dateRange?: { start: string; end: string }) =>
    apiClient.get<any>(`/analytics/sales?period=${period}${dateRange ? `&start=${dateRange.start}&end=${dateRange.end}` : ''}`),
  
  getProductAnalytics: (productId?: string) =>
    apiClient.get<any>(`/analytics/products${productId ? `/${productId}` : ''}`),
  
  getCustomerAnalytics: () =>
    apiClient.get<any>('/analytics/customers'),
  
  getRevenueAnalytics: (period: 'day' | 'week' | 'month' | 'year') =>
    apiClient.get<any>(`/analytics/revenue?period=${period}`),
  
  exportAnalytics: (type: 'sales' | 'products' | 'customers', format: 'csv' | 'pdf') =>
    apiClient.get<{ url: string }>(`/analytics/export?type=${type}&format=${format}`),
};

// Payment API
export const paymentApi = {
  createPaymentIntent: (amount: number, currency: string = 'USD') =>
    apiClient.post<{ clientSecret: string; paymentIntentId: string }>('/payments/intent', { amount, currency }),
  
  confirmPayment: (paymentIntentId: string, paymentMethodId: string) =>
    apiClient.post<any>('/payments/confirm', { paymentIntentId, paymentMethodId }),
  
  processVNPayPayment: (orderData: any) =>
    apiClient.post<{ paymentUrl: string }>('/payments/vnpay', orderData),
  
  processMoMoPayment: (orderData: any) =>
    apiClient.post<{ paymentUrl: string }>('/payments/momo', orderData),
  
  verifyPayment: (paymentId: string, signature: string) =>
    apiClient.post<{ verified: boolean }>('/payments/verify', { paymentId, signature }),
  
  getPaymentMethods: () =>
    apiClient.get<any[]>('/payments/methods'),
  
  savePaymentMethod: (paymentMethodData: any) =>
    apiClient.post<any>('/payments/methods', paymentMethodData),
  
  deletePaymentMethod: (id: string) =>
    apiClient.delete<{}>(`/payments/methods/${id}`),
};

// Content API
export const contentApi = {
  getPages: () =>
    apiClient.get<any[]>('/content/pages'),
  
  getPage: (slug: string) =>
    apiClient.get<any>(`/content/pages/${slug}`),
  
  createPage: (pageData: any) =>
    apiClient.post<any>('/content/pages', pageData),
  
  updatePage: (id: string, pageData: any) =>
    apiClient.put<any>(`/content/pages/${id}`, pageData),
  
  deletePage: (id: string) =>
    apiClient.delete<{}>(`/content/pages/${id}`),
  
  getBanners: () =>
    apiClient.get<any[]>('/content/banners'),
  
  createBanner: (bannerData: any) =>
    apiClient.post<any>('/content/banners', bannerData),
  
  updateBanner: (id: string, bannerData: any) =>
    apiClient.put<any>(`/content/banners/${id}`, bannerData),
  
  deleteBanner: (id: string) =>
    apiClient.delete<{}>(`/content/banners/${id}`),
  
  uploadMedia: (file: File, folder?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) formData.append('folder', folder);
    return apiClient.post<{ url: string; id: string }>('/content/media', formData);
  },
  
  getMediaLibrary: (page?: number, folder?: string) =>
    apiClient.get<PaginatedResponse<any>>(`/content/media?page=${page || 1}${folder ? `&folder=${folder}` : ''}`),
};

// Marketing API
export const marketingApi = {
  getCoupons: () =>
    apiClient.get<any[]>('/marketing/coupons'),
  
  createCoupon: (couponData: any) =>
    apiClient.post<any>('/marketing/coupons', couponData),
  
  updateCoupon: (id: string, couponData: any) =>
    apiClient.put<any>(`/marketing/coupons/${id}`, couponData),
  
  deleteCoupon: (id: string) =>
    apiClient.delete<{}>(`/marketing/coupons/${id}`),
  
  validateCoupon: (code: string, orderTotal: number) =>
    apiClient.post<{ valid: boolean; discount: number; message?: string }>('/marketing/coupons/validate', { code, orderTotal }),
  
  getCampaigns: () =>
    apiClient.get<any[]>('/marketing/campaigns'),
  
  createCampaign: (campaignData: any) =>
    apiClient.post<any>('/marketing/campaigns', campaignData),
  
  updateCampaign: (id: string, campaignData: any) =>
    apiClient.put<any>(`/marketing/campaigns/${id}`, campaignData),
  
  deleteCampaign: (id: string) =>
    apiClient.delete<{}>(`/marketing/campaigns/${id}`),
  
  sendEmailCampaign: (campaignId: string, recipients: string[]) =>
    apiClient.post<{ sent: number; failed: number }>(`/marketing/campaigns/${campaignId}/send`, { recipients }),
  
  getNewsletterSubscribers: (page?: number) =>
    apiClient.get<PaginatedResponse<any>>(`/marketing/newsletter?page=${page || 1}`),
  
  subscribeNewsletter: (email: string) =>
    apiClient.post<{}>('/marketing/newsletter/subscribe', { email }),
  
  unsubscribeNewsletter: (email: string, token: string) =>
    apiClient.post<{}>('/marketing/newsletter/unsubscribe', { email, token }),
};

// Shipping API
export const shippingApi = {
  calculateShipping: (address: any, items: any[]) =>
    apiClient.post<{ cost: number; estimatedDays: number; methods: any[] }>('/shipping/calculate', { address, items }),
  
  getShippingMethods: () =>
    apiClient.get<any[]>('/shipping/methods'),
  
  createShippingLabel: (orderId: string, shippingMethodId: string) =>
    apiClient.post<{ labelUrl: string; trackingNumber: string }>('/shipping/labels', { orderId, shippingMethodId }),
  
  trackShipment: (trackingNumber: string) =>
    apiClient.get<any>(`/shipping/track/${trackingNumber}`),
  
  getShippingZones: () =>
    apiClient.get<any[]>('/shipping/zones'),
  
  updateShippingRates: (zoneId: string, rates: any[]) =>
    apiClient.put<any>(`/shipping/zones/${zoneId}/rates`, { rates }),
};

// Inventory API
export const inventoryApi = {
  getInventory: (productId?: string) =>
    apiClient.get<any>(`/inventory${productId ? `/${productId}` : ''}`),
  
  updateStock: (productId: string, quantity: number, reason: string) =>
    apiClient.post<any>(`/inventory/${productId}/update`, { quantity, reason }),
  
  getStockMovements: (productId: string, page?: number) =>
    apiClient.get<PaginatedResponse<any>>(`/inventory/${productId}/movements?page=${page || 1}`),
  
  getLowStockAlerts: () =>
    apiClient.get<any[]>('/inventory/alerts'),
  
  setStockAlert: (productId: string, threshold: number) =>
    apiClient.post<any>(`/inventory/${productId}/alert`, { threshold }),
  
  bulkUpdateStock: (updates: Array<{ productId: string; quantity: number; reason: string }>) =>
    apiClient.post<{ success: number; failed: number }>('/inventory/bulk-update', { updates }),
};

// Settings API
export const settingsApi = {
  getSettings: () =>
    apiClient.get<any>('/settings'),
  
  updateSettings: (settings: any) =>
    apiClient.put<any>('/settings', settings),
  
  getPaymentSettings: () =>
    apiClient.get<any>('/settings/payment'),
  
  updatePaymentSettings: (settings: any) =>
    apiClient.put<any>('/settings/payment', settings),
  
  getShippingSettings: () =>
    apiClient.get<any>('/settings/shipping'),
  
  updateShippingSettings: (settings: any) =>
    apiClient.put<any>('/settings/shipping', settings),
  
  getTaxSettings: () =>
    apiClient.get<any>('/settings/tax'),
  
  updateTaxSettings: (settings: any) =>
    apiClient.put<any>('/settings/tax', settings),
  
  getEmailSettings: () =>
    apiClient.get<any>('/settings/email'),
  
  updateEmailSettings: (settings: any) =>
    apiClient.put<any>('/settings/email', settings),
  
  testEmailSettings: (settings: any) =>
    apiClient.post<{ success: boolean; message: string }>('/settings/email/test', settings),
};

// Webhooks API
export const webhooksApi = {
  getWebhooks: () =>
    apiClient.get<any[]>('/webhooks'),
  
  createWebhook: (webhookData: { url: string; events: string[]; secret?: string }) =>
    apiClient.post<any>('/webhooks', webhookData),
  
  updateWebhook: (id: string, webhookData: any) =>
    apiClient.put<any>(`/webhooks/${id}`, webhookData),
  
  deleteWebhook: (id: string) =>
    apiClient.delete<{}>(`/webhooks/${id}`),
  
  testWebhook: (id: string) =>
    apiClient.post<{ success: boolean; response: any }>(`/webhooks/${id}/test`),
  
  getWebhookLogs: (id: string, page?: number) =>
    apiClient.get<PaginatedResponse<any>>(`/webhooks/${id}/logs?page=${page || 1}`),
};

// Export all APIs
export const api = {
  auth: authApi,
  products: productsApi,
  orders: ordersApi,
  customers: customersApi,
  analytics: analyticsApi,
  payment: paymentApi,
  content: contentApi,
  marketing: marketingApi,
  shipping: shippingApi,
  inventory: inventoryApi,
  settings: settingsApi,
  webhooks: webhooksApi,
};

export default api;