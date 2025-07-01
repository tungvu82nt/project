# Deployment Task List

## 1. Chuẩn bị mã nguồn
- [X] Di chuyển API key Supabase vào biến môi trường.
- [X] Loại bỏ các route trùng lặp và chuẩn hóa định nghĩa route.
- [X] Tối ưu hóa hiệu suất bằng cách giảm thiểu số lượng hiệu ứng chuyển động không cần thiết.
- [X] Phân tách mã nguồn thành các thành phần nhỏ hơn để dễ bảo trì.

## 2. Kiểm thử
- [X] Thực hiện kiểm thử đơn vị (`unit testing`) cho các thành phần quan trọng như `Header`, `supabaseClient`.
- [X] Kiểm thử tích hợp (`integration testing`) để đảm bảo các thành phần hoạt động tốt cùng nhau.
- [X] Kiểm tra khả năng tương thích trên các trình duyệt phổ biến (Chrome, Firefox, Safari).
- [X] Đánh giá hiệu suất ứng dụng dưới tải cao bằng các công cụ như Lighthouse hoặc WebPageTest.

## 3. Triển khai
- [X] Chọn nền tảng triển khai phù hợp (Vercel).
- [X] Cấu hình CI/CD để tự động hóa quy trình triển khai.
- [X] Tạo bản build production với các tối ưu hóa như minification và code splitting.

## 4. Quản lý người dùng và quản trị viên
- [X] Thêm middleware xác thực cho các route admin để đảm bảo chỉ quản trị viên có thể truy cập.
- [X] Thiết lập hệ thống phân quyền rõ ràng (ví dụ: role-based access control).
- [X] Cung cấp tài liệu hướng dẫn chi tiết cho quản trị viên về cách sử dụng các tính năng admin.

## 5. Phát hành
- [X] Triển khai phiên bản beta để thu thập phản hồi từ người dùng.
- [x] **Sửa lỗi và tối ưu hóa dựa trên phản hồi.**

  Hướng dẫn:
  1. Thu thập phản hồi từ người dùng sau khi triển khai phiên bản beta.
  2. Phân loại phản hồi thành các nhóm: lỗi nghiêm trọng, tối ưu hóa hiệu suất, cải thiện UX/UI.
  3. Ưu tiên xử lý các lỗi nghiêm trọng trước, sau đó tối ưu hóa hiệu suất và cải thiện giao diện.
  4. Kiểm thử lại các thay đổi bằng React Testing Library và Cypress.
  5. Cập nhật tài liệu nếu cần thiết.

- [x] **Phát hành phiên bản chính thức sau khi hoàn thiện.**

  Hướng dẫn:
  1. Kiểm tra lại tất cả các thay đổi từ phiên bản beta để đảm bảo chúng đã được phê duyệt.
  2. Triển khai mã nguồn lên môi trường production bằng lệnh `vercel --prod`.
  3. Cập nhật tài liệu hướng dẫn nếu cần thiết.
  4. Thông báo cho người dùng về phiên bản chính thức qua email hoặc thông báo trên ứng dụng.
