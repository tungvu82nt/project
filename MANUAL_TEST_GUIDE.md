# 🧪 Hướng Dẫn Test Manual Chức Năng CRUD Sản Phẩm

## 📋 Mục Tiêu Test
Kiểm tra chức năng thêm/xóa sản phẩm và đảm bảo dữ liệu được cập nhật, đồng bộ trên web sau khi tải lại trang.

## 🚀 Chuẩn Bị
1. Đảm bảo server đang chạy: `npm run dev`
2. Mở trình duyệt và truy cập: `http://localhost:5175/admin/products`
3. Mở Developer Tools (F12) để theo dõi console

## 📝 Test Cases

### Test Case 1: Kiểm Tra Giao Diện Quản Lý Sản Phẩm
**Mục tiêu:** Xác minh giao diện hiển thị đúng

**Các bước thực hiện:**
1. Truy cập `/admin/products`
2. Kiểm tra các phần tử sau có hiển thị:
   - [ ] Tiêu đề "Product Management"
   - [ ] Nút "Add Product" (màu xanh)
   - [ ] Bảng danh sách sản phẩm
   - [ ] Các nút Import/Export
   - [ ] Thanh tìm kiếm và bộ lọc

**Kết quả mong đợi:** Tất cả phần tử hiển thị chính xác

---

### Test Case 2: Thêm Sản Phẩm Mới
**Mục tiêu:** Kiểm tra chức năng thêm sản phẩm

**Các bước thực hiện:**
1. Click nút "Add Product"
2. Kiểm tra modal mở ra với các trường:
   - [ ] Product Name (bắt buộc)
   - [ ] Category (dropdown)
   - [ ] Price (số)
   - [ ] Original Price
   - [ ] Description (textarea)
   - [ ] Images (có thể thêm nhiều ảnh)
   - [ ] In Stock (checkbox)
   - [ ] Stock Quantity
   - [ ] Featured (checkbox)

3. Điền thông tin test:
   ```
   Name: Test Product [Timestamp]
   Category: Electronics
   Price: 99.99
   Original Price: 129.99
   Description: Đây là sản phẩm test
   Stock Quantity: 50
   In Stock: ✓
   Featured: ✗
   ```

4. Click "Create Product"
5. Kiểm tra:
   - [ ] Modal đóng lại
   - [ ] Sản phẩm xuất hiện trong danh sách
   - [ ] Thông báo thành công hiển thị
   - [ ] Dữ liệu hiển thị chính xác

**Kết quả mong đợi:** Sản phẩm được tạo và hiển thị trong danh sách

---

### Test Case 3: Kiểm Tra Tính Bền Vững Dữ Liệu
**Mục tiêu:** Đảm bảo dữ liệu không bị mất sau reload

**Các bước thực hiện:**
1. Sau khi thêm sản phẩm ở Test Case 2
2. Ghi nhớ tên sản phẩm vừa tạo
3. Reload trang (F5 hoặc Ctrl+R)
4. Kiểm tra:
   - [ ] Sản phẩm vẫn tồn tại trong danh sách
   - [ ] Thông tin sản phẩm không thay đổi
   - [ ] Vị trí sản phẩm trong danh sách

**Kết quả mong đợi:** Dữ liệu vẫn tồn tại và chính xác sau reload

---

### Test Case 4: Chỉnh Sửa Sản Phẩm
**Mục tiêu:** Kiểm tra chức năng cập nhật sản phẩm

**Các bước thực hiện:**
1. Tìm sản phẩm test vừa tạo
2. Click nút "Edit" (biểu tượng bút chì)
3. Kiểm tra modal mở với dữ liệu hiện tại
4. Thay đổi một số thông tin:
   ```
   Name: Test Product [Timestamp] - Updated
   Price: 79.99
   Description: Sản phẩm đã được cập nhật
   ```
5. Click "Update Product"
6. Kiểm tra:
   - [ ] Modal đóng lại
   - [ ] Thông tin cập nhật hiển thị trong danh sách
   - [ ] Thông báo thành công

**Kết quả mong đợi:** Sản phẩm được cập nhật thành công

---

### Test Case 5: Xóa Sản Phẩm
**Mục tiêu:** Kiểm tra chức năng xóa sản phẩm

**Các bước thực hiện:**
1. Tìm sản phẩm test
2. Click nút "Delete" (biểu tượng thùng rác, màu đỏ)
3. Kiểm tra dialog xác nhận xuất hiện
4. Click "Confirm" hoặc "Yes"
5. Kiểm tra:
   - [ ] Dialog đóng lại
   - [ ] Sản phẩm biến mất khỏi danh sách
   - [ ] Thông báo xóa thành công
   - [ ] Số lượng sản phẩm giảm đi 1

**Kết quả mong đợi:** Sản phẩm được xóa hoàn toàn

---

### Test Case 6: Kiểm Tra Đồng Bộ Sau Xóa
**Mục tiêu:** Đảm bảo việc xóa được lưu vĩnh viễn

**Các bước thực hiện:**
1. Sau khi xóa sản phẩm ở Test Case 5
2. Reload trang (F5)
3. Kiểm tra:
   - [ ] Sản phẩm đã xóa không xuất hiện lại
   - [ ] Danh sách sản phẩm chính xác
   - [ ] Không có lỗi console

**Kết quả mong đợi:** Sản phẩm đã bị xóa vĩnh viễn

---

## 🔧 Test Tự Động (Tùy Chọn)

### Sử dụng Script Test
1. **Test Backend Logic:**
   ```javascript
   // Copy nội dung file test-product-crud.js vào console
   ```

2. **Test UI Interaction:**
   ```javascript
   // Copy nội dung file test-ui-interaction.js vào console
   ```

### Kiểm Tra LocalStorage
1. Mở Developer Tools > Application > Local Storage
2. Tìm key `db_products`
3. Kiểm tra dữ liệu JSON có chính xác không

---

## 📊 Báo Cáo Kết Quả

### ✅ Test Cases Passed
- [ ] Test Case 1: Giao diện
- [ ] Test Case 2: Thêm sản phẩm
- [ ] Test Case 3: Tính bền vững dữ liệu
- [ ] Test Case 4: Chỉnh sửa sản phẩm
- [ ] Test Case 5: Xóa sản phẩm
- [ ] Test Case 6: Đồng bộ sau xóa

### 🐛 Issues Found
```
[Ghi chú các lỗi phát hiện được]
```

### 💡 Recommendations
```
[Đề xuất cải thiện]
```

---

## 🔍 Kiểm Tra Bổ Sung

### Performance
- [ ] Thời gian tải trang < 2s
- [ ] Thời gian phản hồi CRUD < 500ms
- [ ] Không có memory leaks

### Error Handling
- [ ] Validation form hoạt động
- [ ] Thông báo lỗi rõ ràng
- [ ] Graceful handling khi server lỗi

### UX/UI
- [ ] Loading states hiển thị
- [ ] Responsive design
- [ ] Accessibility (keyboard navigation)

---

**📝 Ghi chú:** Thực hiện test theo thứ tự và ghi chú kết quả chi tiết để đảm bảo chất lượng sản phẩm.