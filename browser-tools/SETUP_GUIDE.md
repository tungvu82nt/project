# Browser Tools MCP - Hướng Dẫn Cài Đặt và Sử Dụng Chi Tiết

## 📋 Tổng Quan Hệ Thống

Browser Tools MCP là một hệ thống giám sát và tương tác trình duyệt mạnh mẽ bao gồm 3 thành phần chính:

1. **Chrome Extension** - Tiện ích mở rộng Chrome để thu thập dữ liệu
2. **Browser Tools Server** - Máy chủ middleware (cổng 3025)
3. **MCP Server** - Máy chủ MCP để tương tác với AI

## 🚀 Khởi Động Hệ Thống

### Cách 1: Sử dụng Script Tự Động (Khuyến nghị)

```bash
# Chạy script tự động khởi động cả hai server
cmd /c start-servers.bat
```

Script này sẽ:
- Khởi động Browser Tools Server trên cổng 3025
- Đợi 5 giây
- Khởi động MCP Server
- Mở cả hai server trong các cửa sổ command prompt riêng biệt

### Cách 2: Khởi Động Thủ Công

#### Bước 1: Khởi động Browser Tools Server
```bash
cd browser-tools-server
npm start
```

#### Bước 2: Khởi động MCP Server (trong terminal khác)
```bash
cd browser-tools-mcp
npm start
```

## 🔧 Cài Đặt Chrome Extension

1. Mở Chrome và truy cập `chrome://extensions/`
2. Bật "Developer mode" ở góc trên bên phải
3. Click "Load unpacked"
4. Chọn thư mục `chrome-extension`
5. Extension sẽ xuất hiện trong danh sách

## 📊 Kiến Trúc Hệ Thống

```
MCP Client (AI) ←→ MCP Server ←→ Browser Tools Server ←→ Chrome Extension ←→ Browser
```

### Luồng Dữ Liệu:
1. AI gửi yêu cầu đến MCP Server
2. MCP Server chuyển tiếp đến Browser Tools Server (port 3025)
3. Browser Tools Server giao tiếp với Chrome Extension qua WebSocket
4. Chrome Extension tương tác với trình duyệt
5. Dữ liệu được trả về theo chiều ngược lại

## 🛠️ Các Tính Năng Chính

### 1. Thu Thập Logs
- **Console Logs**: Lấy logs từ console của trang web
- **Network Logs**: Theo dõi các request/response HTTP
- **Error Logs**: Thu thập các lỗi JavaScript

### 2. Chụp Ảnh Màn Hình
- Chụp toàn bộ trang hoặc phần tử cụ thể
- Tự động lưu vào thư mục Downloads/mcp-screenshots
- Hỗ trợ dán tự động vào Cursor (macOS)

### 3. Audit Tools (Lighthouse Integration)
- **Accessibility Audit**: Kiểm tra khả năng truy cập
- **Performance Audit**: Phân tích hiệu suất
- **SEO Audit**: Kiểm tra tối ưu hóa SEO
- **Best Practices Audit**: Đánh giá thực hành tốt nhất
- **NextJS Audits**: Kiểm tra chuyên biệt cho NextJS

### 4. Debugger Mode
- Gỡ lỗi chi tiết
- Phân tích DOM
- Theo dõi events

## 🎯 Cách Sử Dụng với AI

### Ví Dụ Truy Vấn:

```
# Lấy console logs
"Get the console logs from the current page"

# Chụp ảnh màn hình
"Take a screenshot of the current page"

# Chạy audit accessibility
"Run accessibility audit on this page"

# Chạy performance audit
"Analyze the performance of this website"

# Lấy network logs
"Show me the network requests"

# Chạy SEO audit
"Check SEO optimization for this page"
```

## ⚙️ Cấu Hình

### Browser Tools Server Settings:
- **Port**: 3025 (mặc định)
- **Host**: 0.0.0.0 (tất cả interfaces)
- **Log Limit**: 50 entries
- **Screenshot Path**: ~/Downloads/mcp-screenshots

### Environment Variables:
```bash
PORT=3025                    # Port cho Browser Tools Server
SERVER_HOST=0.0.0.0         # Host binding
```

## 🔍 Troubleshooting

### Lỗi Thường Gặp:

1. **Port 3025 đã được sử dụng**
   - Hệ thống tự động tìm port khả dụng tiếp theo
   - Hoặc thay đổi PORT environment variable

2. **Chrome Extension không kết nối**
   - Kiểm tra Browser Tools Server đã chạy
   - Reload extension trong chrome://extensions/
   - Kiểm tra WebSocket connection

3. **MCP Server không tìm thấy Browser Tools Server**
   - Đảm bảo Browser Tools Server chạy trước
   - Kiểm tra port và host configuration

4. **Lighthouse audits lỗi**
   - Cần cài đặt Chrome/Chromium
   - Kiểm tra quyền truy cập file system

## 📁 Cấu Trúc Thư Mục

```
browser-tools-mcp-main/
├── browser-tools-mcp/          # MCP Server
│   ├── mcp-server.ts
│   ├── package.json
│   └── dist/
├── browser-tools-server/       # Browser Tools Server
│   ├── browser-connector.ts
│   ├── lighthouse/
│   ├── package.json
│   └── dist/
├── chrome-extension/           # Chrome Extension
│   ├── manifest.json
│   ├── background.js
│   ├── panel.js
│   └── devtools.html
├── start-servers.bat          # Script khởi động tự động
└── SETUP_GUIDE.md            # File hướng dẫn này
```

## 🔐 Bảo Mật

- Extension chỉ hoạt động trên tab được phép
- WebSocket connection được bảo vệ
- Không lưu trữ dữ liệu nhạy cảm
- Logs được giới hạn kích thước

## 📈 Monitoring

- Server logs hiển thị trong command prompt windows
- Extension status hiển thị trong DevTools panel
- Network activity được theo dõi real-time

## 🎉 Kết Luận

Hệ thống Browser Tools MCP đã được khởi động thành công! Bạn có thể:

1. ✅ Sử dụng Chrome Extension để thu thập dữ liệu
2. ✅ Tương tác với AI thông qua MCP protocol
3. ✅ Chạy các audit tools để phân tích website
4. ✅ Chụp ảnh màn hình và debug

**Lưu ý**: Đảm bảo cả hai server đang chạy trước khi sử dụng các tính năng AI.