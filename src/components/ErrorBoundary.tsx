import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * Component để bắt và xử lý lỗi trong ứng dụng React
 * Bao phủ toàn bộ ứng dụng để cung cấp trải nghiệm người dùng tốt hơn khi có lỗi xảy ra
 */
class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Cập nhật state để component re-render với UI fallback
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Ghi lại lỗi vào console
    this.setState({ errorInfo });
    console.error('Global error caught:', error, errorInfo);

    // Ở đây có thể thêm logic gửi thông báo lỗi đến đội ngũ phát triển
    // Ví dụ: fetch('/api/log-error', { method: 'POST', body: JSON.stringify({ error, errorInfo }) });
  }

  handleReset = (): void => {
    // Đặt lại state để ứng dụng có thể tiếp tục hoạt động
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    // Tải lại trang nếu cần thiết (tùy thuộc vào mức độ nghiêm trọng của lỗi)
    // window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Hiển thị UI fallback tùy chỉnh nếu có
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // UI mặc định khi có lỗi
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <div className="w-full max-w-md p-6 text-center bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-700 mb-6">We apologize for the inconvenience. Please try again later.</p>
            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <div className="bg-red-50 p-4 rounded-md text-left text-sm text-red-800 mb-6">
                <p className="font-medium mb-1">Error details (development only):</p>
                <p>{this.state.error.message}</p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={this.handleReset}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper component to access context in class component
export const ErrorBoundary: React.FC<Props> = (props) => {
  return <ErrorBoundaryClass {...props} />;
};

export default ErrorBoundary;