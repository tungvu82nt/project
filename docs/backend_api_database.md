# Tổng hợp thông tin Database, API, Backend dự án EliteStore

## 1. Thông tin Database
- Sử dụng Supabase làm backend database chính (PostgreSQL).
- Kết nối qua biến môi trường:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Quản lý truy vấn, cache, transaction, batch, tối ưu hóa, health check qua `DatabaseService` (`src/services/DatabaseService.ts`).
- Các bảng chính: `users`, `wishlist`, ...
- Tích hợp audit log, performance monitor, cache, thống kê, health check.

## 2. Thông tin API
- API RESTful, endpoint chính cấu hình qua `VITE_API_URL` (mặc định `/api`).
- Client API: `src/api/index.ts` (ApiClient, error handling, cache, paginated response, ...).
- Các endpoint tiêu biểu:
  - `POST /api/auth/login` (login)
  - `POST /api/auth/register` (đăng ký)
  - `GET /api/users/profile` (lấy thông tin user)
  - `PUT /api/users/profile` (cập nhật user)
  - ...
- Tích hợp bảo mật: JWT, 2FA, role-based, CSRF, rate limit, encryption.

## 3. Thông tin Backend
- Sử dụng Supabase cho database và authentication.
- Các service backend chính:
  - `DatabaseService` (quản lý truy vấn, transaction, tối ưu hóa, cache)
  - `UserService` (quản lý user, profile, update, ...)
  - `supabaseClient` (khởi tạo kết nối Supabase)
- Các file liên quan:
  - `src/services/DatabaseService.ts`
  - `src/services/UserService.ts`
  - `src/services/supabaseClient.ts`
  - `src/api/userApi.ts`
  - `src/api/index.ts`
- Mã nguồn có comment tiếng Việt, dễ bảo trì.

## 4. Cấu hình môi trường
- `.env.local` ví dụ:
```
VITE_API_URL=http://localhost:3000/api
VITE_ENCRYPTION_KEY=your-encryption-key-here
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 5. Tham khảo thêm
- Xem chi tiết trong README.md, DatabaseService, UserService, supabaseClient, userApi, api/index.
- Tài liệu API, security, kiến trúc, hướng dẫn cài đặt đều có trong README.md.


VITE_SUPABASE_URL=https://fsyxmfvmygnijqkfvakn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzeXhtZnZteWduaWpxa2Z2YWtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNDYwNTMsImV4cCI6MjA2NjgyMjA1M30.YlasaJpwnSTszRd7eXsb5-J4U2V99ticKca2wrfJLlI
BROWSER_USE_PROFILES_DIR=D:\\path\\to\\other\\allowed\\dir
