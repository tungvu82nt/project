# 🛍️ EliteStore - Ứng Dụng Thương Mại Điện Tử Hoàn Chỉnh

<div align="center">

![EliteStore Logo](https://via.placeholder.com/200x80/3B82F6/FFFFFF?text=EliteStore)

**Nền tảng thương mại điện tử hiện đại, đầy đủ tính năng với hiển thị sản phẩm 3D, hệ thống quản lý toàn diện và bảo mật cấp doanh nghiệp.**

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.1-blue.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-purple.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[🚀 Demo Trực Tiếp](#) | [📖 Tài Liệu](#documentation) | [🐛 Báo Lỗi](#) | [💡 Yêu Cầu Tính Năng](#)

**[English](README.md#english) | [Tiếng Việt](#tiếng-việt) | [中文](README.zh.md#中文)**

</div>

---

## Tiếng Việt

### 📋 Mục Lục

- [🌟 Tính Năng](#-tính-năng)
- [🏗️ Kiến Trúc](#️-kiến-trúc)
- [🚀 Bắt Đầu Nhanh](#-bắt-đầu-nhanh)
- [📦 Cài Đặt](#-cài-đặt)
- [⚙️ Cấu Hình](#️-cấu-hình)
- [🔧 Phát Triển](#-phát-triển)
- [🧪 Kiểm Thử](#-kiểm-thử)
- [🚀 Triển Khai](#-triển-khai)
- [📚 Tài Liệu API](#-tài-liệu-api)
- [🔒 Bảo Mật](#-bảo-mật)
- [🎨 Thiết Kế UI/UX](#-thiết-kế-uiux)
- [📱 Hỗ Trợ Mobile](#-hỗ-trợ-mobile)
- [🌐 Đa Ngôn Ngữ](#-đa-ngôn-ngữ)
- [📊 Phân Tích & Giám Sát](#-phân-tích--giám-sát)
- [🤝 Đóng Góp](#-đóng-góp)
- [📄 Giấy Phép](#-giấy-phép)

### 🌟 Tính Năng

#### 🛒 **Trải Nghiệm Khách Hàng**
- **🎯 Giao Diện Mua Sắm Hiện Đại**: Duyệt sản phẩm trực quan với bộ lọc và tìm kiếm nâng cao
- **🔍 Hiển Thị Sản Phẩm 3D**: Mô hình 3D tương tác để xem sản phẩm sống động
- **📱 Thiết Kế Responsive**: Trải nghiệm mượt mà trên mọi thiết bị và kích thước màn hình
- **🛍️ Giỏ Hàng Thông Minh**: Giỏ hàng lưu trữ với quản lý số lượng và tính toán giá
- **💳 Nhiều Phương Thức Thanh Toán**: Hỗ trợ VNPAY, MoMo, Thẻ tín dụng và Chuyển khoản
- **📦 Theo Dõi Đơn Hàng**: Cập nhật trạng thái đơn hàng và theo dõi vận chuyển theo thời gian thực
- **👤 Tài Khoản Người Dùng**: Quản lý hồ sơ, lịch sử đơn hàng và danh sách yêu thích
- **⭐ Đánh Giá & Xếp Hạng**: Hệ thống phản hồi khách hàng với đánh giá sản phẩm chi tiết
- **🔔 Thông Báo Thời Gian Thực**: Thông báo toast cho mọi hành động và cập nhật của người dùng

#### 🔧 **Quản Lý Admin**
- **📊 Dashboard Toàn Diện**: Phân tích thời gian thực với biểu đồ tương tác và KPI
- **📦 Quản Lý Sản Phẩm**: Các thao tác CRUD hoàn chỉnh với khả năng nhập/xuất hàng loạt
- **📋 Xử Lý Đơn Hàng**: Quản lý đơn hàng nâng cao với theo dõi trạng thái và tự động hóa
- **👥 Quản Lý Khách Hàng**: Hồ sơ khách hàng chi tiết với phân khúc và công cụ giao tiếp
- **💰 Theo Dõi Tài Chính**: Phân tích doanh thu, xử lý thanh toán và báo cáo tài chính
- **🎨 Quản Lý Nội Dung**: Trình chỉnh sửa nội dung động cho trang, banner và tài liệu quảng cáo
- **📈 Công Cụ Marketing**: Quản lý coupon, chiến dịch email và hệ thống khuyến mãi
- **⚙️ Cài Đặt Hệ Thống**: Cấu hình toàn diện cho mọi khía cạnh của nền tảng

#### 🛡️ **Bảo Mật & Hiệu Suất**
- **🔐 Bảo Mật Doanh Nghiệp**: Bảo mật đa lớp với mã hóa, bảo vệ CSRF và giới hạn tốc độ
- **🚀 Hiệu Suất Tối Ưu**: Bộ nhớ đệm nâng cao, lazy loading và chia tách mã
- **📱 Ứng Dụng Web Tiến Bộ**: Khả năng offline và trải nghiệm giống ứng dụng
- **🌐 Hỗ Trợ Đa Ngôn Ngữ**: Bản địa hóa tiếng Anh, tiếng Việt và tiếng Trung
- **📊 Phân Tích Nâng Cao**: Thông tin kinh doanh chi tiết và giám sát hiệu suất
- **🔄 Pipeline CI/CD**: Quy trình kiểm thử, xây dựng và triển khai tự động

### 🏗️ Kiến Trúc

#### **Kiến Trúc Frontend**
```
src/
├── components/          # Các component UI có thể tái sử dụng
│   ├── Auth/           # Các component xác thực
│   ├── Layout/         # Các component layout (Header, Footer)
│   ├── Product/        # Các component liên quan đến sản phẩm
│   ├── Notifications/  # Hệ thống thông báo
│   └── ...
├── pages/              # Các component trang
├── admin/              # Các component panel admin
├── hooks/              # Custom React hooks
├── contexts/           # React contexts
├── utils/              # Các hàm tiện ích
├── services/           # Các service logic kinh doanh
├── api/                # Tích hợp API
├── middleware/         # Middleware bảo mật và hiệu suất
└── types/              # Định nghĩa kiểu TypeScript
```

#### **Stack Công Nghệ**

##### **Công Nghệ Cốt Lõi**
- **Framework Frontend**: React 18.3.1 với TypeScript
- **Công Cụ Build**: Vite 5.4.2 cho phát triển nhanh và build tối ưu
- **Styling**: Tailwind CSS 3.4.1 cho styling utility-first
- **Routing**: React Router DOM 6.8.1 cho routing phía client
- **Quản Lý State**: React Context API với custom hooks

##### **UI & Visualization**
- **Đồ Họa 3D**: Three.js với React Three Fiber cho hiển thị sản phẩm 3D
- **Biểu Đồ & Phân Tích**: Recharts cho trực quan hóa dữ liệu
- **Animations**: Framer Motion cho animations và transitions mượt mà
- **Icons**: Lucide React cho iconography nhất quán

##### **Phát Triển & Chất Lượng**
- **Linting**: ESLint với hỗ trợ TypeScript
- **Testing**: Vitest với React Testing Library
- **Type Safety**: Triển khai TypeScript đầy đủ
- **Chất Lượng Code**: Kiểm thử tự động và kiểm tra chất lượng

### 🚀 Bắt Đầu Nhanh

#### **Yêu Cầu Tiên Quyết**
- Node.js 18.0.0 trở lên
- npm 8.0.0 trở lên
- Trình duyệt web hiện đại với hỗ trợ ES2020

#### **Thiết Lập 1 Phút**
```bash
# Clone repository
git clone https://github.com/your-username/elitestore.git
cd elitestore

# Cài đặt dependencies
npm install

# Khởi động development server
npm run dev
```

🎉 **Xong rồi!** Mở [http://localhost:5173](http://localhost:5173) để xem ứng dụng.

### 📦 Cài Đặt

#### **Môi Trường Phát Triển**

1. **Clone Repository**
   ```bash
   git clone https://github.com/your-username/elitestore.git
   cd elitestore
   ```

2. **Cài Đặt Dependencies**
   ```bash
   npm install
   ```

3. **Cấu Hình Environment**
   ```bash
   cp .env.example .env.local
   ```
   
   Cấu hình các biến môi trường:
   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_ENCRYPTION_KEY=your-encryption-key-here
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Khởi Động Development Server**
   ```bash
   npm run dev
   ```

#### **Production Build**
```bash
# Build cho production
npm run build

# Preview production build
npm run preview
```

### ⚙️ Cấu Hình

#### **Biến Môi Trường**

| Biến | Mô Tả | Mặc Định | Bắt Buộc |
|------|-------|----------|----------|
| `VITE_API_URL` | URL API Backend | `/api` | Không |
| `VITE_ENCRYPTION_KEY` | Khóa mã hóa dữ liệu | `default-key` | Có (Production) |
| `VITE_SUPABASE_URL` | URL dự án Supabase | - | Có (Nếu dùng Supabase) |
| `VITE_SUPABASE_ANON_KEY` | Khóa anonymous Supabase | - | Có (Nếu dùng Supabase) |

### 🔧 Phát Triển

#### **Scripts Có Sẵn**

| Script | Mô Tả |
|--------|-------|
| `npm run dev` | Khởi động development server |
| `npm run build` | Build cho production |
| `npm run preview` | Preview production build |
| `npm run lint` | Chạy ESLint |
| `npm run test` | Chạy tests |
| `npm run test:ui` | Chạy tests với UI |
| `npm run test:coverage` | Chạy tests với coverage |
| `npm run type-check` | Kiểm tra kiểu TypeScript |

### 🧪 Kiểm Thử

#### **Chiến Lược Testing**

##### **Unit Testing**
```bash
# Chạy unit tests
npm run test

# Chạy với coverage
npm run test:coverage

# Chạy file test cụ thể
npm run test -- ProductCard.test.tsx
```

##### **Integration Testing**
```typescript
// Ví dụ integration test
import { renderWithProviders } from '../utils/testing';
import { ProductDetail } from '../pages/ProductDetail';

test('should display product information', async () => {
  const { getByText } = renderWithProviders(
    <ProductDetail />,
    { initialEntries: ['/product/1'] }
  );
  
  expect(getByText('Product Name')).toBeInTheDocument();
});
```

### 🚀 Triển Khai

#### **Triển Khai Production**

##### **Tối Ưu Build**
```bash
# Production build với tối ưu hóa
npm run build

# Phân tích kích thước bundle
npm run build -- --analyze
```

##### **Tùy Chọn Triển Khai**

1. **Netlify (Khuyến nghị)**
   ```bash
   # Lệnh build
   npm run build
   
   # Thư mục publish
   dist
   ```

2. **Vercel**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite"
   }
   ```

### 📚 Tài Liệu API

#### **Endpoints Xác Thực**

##### **POST /api/auth/login**
```typescript
// Request
{
  email: string;
  password: string;
  twoFactorCode?: string;
}

// Response
{
  user: User;
  token: string;
  refreshToken: string;
}
```

##### **POST /api/auth/register**
```typescript
// Request
{
  name: string;
  email: string;
  password: string;
}

// Response
{
  user: User;
  token: string;
}
```

### 🔒 Bảo Mật

#### **Tính Năng Bảo Mật**

##### **Xác Thực & Phân Quyền**
- **JWT Tokens**: Xác thực dựa trên token bảo mật
- **Hỗ Trợ 2FA**: Xác thực hai yếu tố để tăng cường bảo mật
- **Phân Quyền Theo Vai Trò**: Phân tách vai trò admin và khách hàng
- **Quản Lý Session**: Xử lý session bảo mật với timeout

##### **Bảo Vệ Dữ Liệu**
- **Làm Sạch Input**: Bảo vệ XSS cho tất cả input người dùng
- **Bảo Vệ CSRF**: Ngăn chặn cross-site request forgery
- **Mã Hóa Dữ Liệu**: Mã hóa dữ liệu nhạy cảm bằng AES
- **Giới Hạn Tốc Độ**: Giới hạn tốc độ API để ngăn chặn lạm dụng

### 🎨 Thiết Kế UI/UX

#### **Hệ Thống Thiết Kế**

##### **Bảng Màu**
```css
/* Màu Chính */
--blue-600: #3B82F6;    /* Màu thương hiệu chính */
--blue-700: #1D4ED8;    /* Trạng thái hover chính */
--blue-50: #EFF6FF;     /* Nền sáng */

/* Màu Ngữ Nghĩa */
--green-600: #10B981;   /* Thành công */
--red-600: #EF4444;     /* Lỗi */
--yellow-600: #F59E0B;  /* Cảnh báo */
--gray-600: #6B7280;    /* Trung tính */
```

##### **Typography**
```css
/* Font Families */
font-family: system-ui, -apple-system, sans-serif;

/* Kích Thước Font */
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
```

### 📱 Hỗ Trợ Mobile

#### **Progressive Web App (PWA)**

##### **Tính Năng**
- **Hỗ Trợ Offline**: Cache tài nguyên quan trọng để duyệt offline
- **Trải Nghiệm Giống App**: Cảm giác ứng dụng native với animations mượt mà
- **Push Notifications**: Cập nhật thời gian thực và tin nhắn quảng cáo
- **Cài Đặt Home Screen**: Khả năng thêm vào màn hình chính

### 🌐 Đa Ngôn Ngữ

#### **Ngôn Ngữ Được Hỗ Trợ**
- **Tiếng Anh (en)**: Ngôn ngữ mặc định
- **Tiếng Việt (vi)**: Hỗ trợ bản địa hóa đầy đủ
- **Tiếng Trung (zh)**: Dịch thuật hoàn chỉnh

#### **Triển Khai**

##### **Files Ngôn Ngữ**
```typescript
// src/locales/vi.json
{
  "common": {
    "loading": "Đang tải...",
    "error": "Đã xảy ra lỗi",
    "success": "Thành công"
  },
  "products": {
    "title": "Sản phẩm",
    "addToCart": "Thêm vào giỏ",
    "outOfStock": "Hết hàng"
  }
}
```

##### **Sử Dụng**
```typescript
import { useLanguage } from './hooks/useLanguage';

function ProductCard() {
  const { t } = useLanguage();
  
  return (
    <button>{t('products.addToCart')}</button>
  );
}
```

### 📊 Phân Tích & Giám Sát

#### **Phân Tích Kinh Doanh**

##### **Metrics Dashboard**
- **Theo Dõi Doanh Thu**: Giám sát doanh thu thời gian thực
- **Phân Tích Bán Hàng**: Hiệu suất và xu hướng sản phẩm
- **Thông Tin Khách Hàng**: Phân tích hành vi và phân khúc
- **Tỷ Lệ Chuyển Đổi**: Phân tích funnel và tối ưu hóa

### 🤝 Đóng Góp

Chúng tôi hoan nghênh sự đóng góp từ cộng đồng! Đây là cách bạn có thể giúp đỡ:

#### **Bắt Đầu**

1. **Fork Repository**
   ```bash
   git fork https://github.com/your-username/elitestore.git
   ```

2. **Tạo Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Thực Hiện Thay Đổi**
   - Tuân theo tiêu chuẩn coding
   - Thêm tests cho tính năng mới
   - Cập nhật documentation

4. **Submit Pull Request**
   ```bash
   git push origin feature/amazing-feature
   ```

### 📄 Giấy Phép

Dự án này được cấp phép theo Giấy phép MIT - xem file [LICENSE](LICENSE) để biết chi tiết.

---

<div align="center">

**⭐ Star repository này nếu bạn thấy hữu ích!**

**Được tạo với ❤️ bởi EliteStore Team**

**[English](README.md#english) | [Tiếng Việt](#tiếng-việt) | [中文](README.zh.md#中文)**

</div>