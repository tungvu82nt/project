# Hướng dẫn Đăng nhập - EliteStore

## 🔐 Thông tin Tài khoản Admin

**Email:** `admin@yapee.vn`  
**Mật khẩu:** `admin123`

## 🚀 Cách Đăng nhập

1. **Mở ứng dụng** tại: http://localhost:5174
2. **Click vào nút "Đăng nhập"** ở góc trên bên phải
3. **Nhập thông tin:**
   - Email: `admin@yapee.vn`
   - Mật khẩu: `admin123`
4. **Click "Đăng nhập"**

## 🔧 Khắc phục Sự cố

### Vấn đề: "Tài khoản mật khẩu không đúng"

**Nguyên nhân:** Dữ liệu admin chưa được khởi tạo trong localStorage

**Giải pháp:**

#### Phương pháp 1: Tự động khởi tạo (Đã được thêm vào ứng dụng)
- Ứng dụng sẽ tự động tạo tài khoản admin khi khởi động lần đầu
- Refresh lại trang web và thử đăng nhập

#### Phương pháp 2: Khởi tạo thủ công
1. Mở **Developer Tools** (F12)
2. Vào tab **Console**
3. Chạy lệnh sau:
```javascript
// Khởi tạo dữ liệu admin
const adminUser = {
  id: 1,
  email: 'admin@yapee.vn',
  password: '191ee6ac91907b3f6b8016b39925c6968926e04d0f9c61d40da7f568dd6ae6e7',
  firstName: 'Admin',
  lastName: 'User',
  phone: '+1234567890',
  role: 'admin',
  isActive: true,
  isEmailVerified: true,
  preferences: {
    language: 'en',
    currency: 'USD',
    notifications: { email: true, sms: false, push: true }
  },
  addresses: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  lastLoginAt: null
};

localStorage.setItem('db_users', JSON.stringify([adminUser]));
console.log('Admin user created successfully!');
```
4. Refresh trang và thử đăng nhập lại

#### Phương pháp 3: Reset toàn bộ dữ liệu
1. Mở **Developer Tools** (F12)
2. Vào tab **Application** > **Local Storage**
3. Xóa tất cả các key bắt đầu bằng `db_`
4. Refresh trang để ứng dụng tự động khởi tạo lại

## 🎯 Kiểm tra Dữ liệu

### Xem dữ liệu trong localStorage:
```javascript
// Kiểm tra users
console.log('Users:', JSON.parse(localStorage.getItem('db_users') || '[]'));

// Kiểm tra tất cả dữ liệu
Object.keys(localStorage)
  .filter(key => key.startsWith('db_'))
  .forEach(key => {
    console.log(key + ':', JSON.parse(localStorage.getItem(key) || '[]'));
  });
```

## 📋 Tính năng Admin

Sau khi đăng nhập thành công với tài khoản admin, bạn có thể:

- **Quản lý sản phẩm:** Thêm, sửa, xóa sản phẩm
- **Quản lý đơn hàng:** Xem và xử lý đơn hàng
- **Quản lý khách hàng:** Xem thông tin khách hàng
- **Phân tích:** Xem báo cáo và thống kê
- **Quản lý nội dung:** Chỉnh sửa nội dung website
- **Marketing:** Quản lý các chiến dịch marketing

## 🆘 Hỗ trợ

Nếu vẫn gặp vấn đề, hãy:

1. **Kiểm tra Console** để xem có lỗi nào không
2. **Xóa cache trình duyệt** và thử lại
3. **Sử dụng chế độ ẩn danh** để test
4. **Kiểm tra Network tab** để xem API calls

## 🔄 Script Khởi tạo

Trong thư mục project có file `init-admin.cjs` để tạo dữ liệu admin:

```bash
node init-admin.cjs
```

File này sẽ tạo ra `localStorage-init.json` chứa dữ liệu cần thiết.

---

**Lưu ý:** Đây là môi trường development, trong production cần sử dụng cơ sở dữ liệu thực và bảo mật mạnh hơn.