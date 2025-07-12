// Test script để kiểm tra UI interaction cho chức năng thêm/xóa sản phẩm
// Chạy script này trong console tại trang /admin/products

(function testUIInteraction() {
  console.log('🎯 Bắt đầu test UI interaction...');
  
  // Tìm nút Add Product
  const addButton = document.querySelector('button[class*="bg-blue"], button:contains("Add Product"), button:contains("Thêm sản phẩm")');
  
  if (addButton) {
    console.log('✅ Tìm thấy nút Add Product:', addButton);
    
    // Test click nút Add Product
    console.log('🖱️ Đang click nút Add Product...');
    addButton.click();
    
    // Kiểm tra modal có mở không
    setTimeout(() => {
      const modal = document.querySelector('[role="dialog"], .modal, [class*="modal"]');
      if (modal) {
        console.log('✅ Modal thêm sản phẩm đã mở thành công');
        
        // Tìm các trường input trong modal
        const nameInput = modal.querySelector('input[name="name"], input[placeholder*="name"], input[placeholder*="tên"]');
        const priceInput = modal.querySelector('input[name="price"], input[type="number"]');
        const descriptionInput = modal.querySelector('textarea[name="description"], textarea[placeholder*="description"]');
        
        console.log('📝 Các trường input tìm thấy:');
        console.log('- Name input:', nameInput ? '✅' : '❌');
        console.log('- Price input:', priceInput ? '✅' : '❌');
        console.log('- Description input:', descriptionInput ? '✅' : '❌');
        
        // Test điền dữ liệu
        if (nameInput && priceInput) {
          console.log('✍️ Đang điền dữ liệu test...');
          
          // Điền tên sản phẩm
          nameInput.value = 'Test Product UI ' + Date.now();
          nameInput.dispatchEvent(new Event('input', { bubbles: true }));
          nameInput.dispatchEvent(new Event('change', { bubbles: true }));
          
          // Điền giá
          priceInput.value = '99.99';
          priceInput.dispatchEvent(new Event('input', { bubbles: true }));
          priceInput.dispatchEvent(new Event('change', { bubbles: true }));
          
          // Điền mô tả nếu có
          if (descriptionInput) {
            descriptionInput.value = 'Đây là sản phẩm test được tạo từ UI automation';
            descriptionInput.dispatchEvent(new Event('input', { bubbles: true }));
            descriptionInput.dispatchEvent(new Event('change', { bubbles: true }));
          }
          
          console.log('✅ Đã điền dữ liệu thành công');
          
          // Tìm nút Save/Submit
          setTimeout(() => {
            const saveButton = modal.querySelector('button[type="submit"], button:contains("Save"), button:contains("Create"), button:contains("Lưu"), button:contains("Tạo")');
            
            if (saveButton) {
              console.log('💾 Tìm thấy nút Save:', saveButton);
              console.log('🚀 Đang lưu sản phẩm...');
              
              // Click save
              saveButton.click();
              
              // Kiểm tra kết quả sau khi save
              setTimeout(() => {
                console.log('🔍 Kiểm tra kết quả sau khi lưu...');
                
                // Kiểm tra modal có đóng không
                const modalAfterSave = document.querySelector('[role="dialog"], .modal, [class*="modal"]');
                if (!modalAfterSave || modalAfterSave.style.display === 'none') {
                  console.log('✅ Modal đã đóng sau khi lưu');
                } else {
                  console.log('⚠️ Modal vẫn mở, có thể có lỗi validation');
                }
                
                // Kiểm tra danh sách sản phẩm có cập nhật không
                const productRows = document.querySelectorAll('tr[class*="hover"], .product-row, [data-testid="product-row"]');
                console.log(`📊 Số dòng sản phẩm hiện tại: ${productRows.length}`);
                
                // Tìm sản phẩm vừa tạo
                const newProductRow = Array.from(productRows).find(row => 
                  row.textContent.includes('Test Product UI')
                );
                
                if (newProductRow) {
                  console.log('✅ Sản phẩm mới đã xuất hiện trong danh sách');
                  
                  // Test xóa sản phẩm
                  setTimeout(() => {
                    console.log('🗑️ Đang test chức năng xóa...');
                    
                    const deleteButton = newProductRow.querySelector('button[class*="red"], button:contains("Delete"), button:contains("Xóa")');
                    
                    if (deleteButton) {
                      console.log('🎯 Tìm thấy nút Delete');
                      deleteButton.click();
                      
                      // Kiểm tra confirm dialog
                      setTimeout(() => {
                        const confirmButton = document.querySelector('button:contains("Confirm"), button:contains("Yes"), button:contains("Xác nhận")');
                        if (confirmButton) {
                          console.log('✅ Đang xác nhận xóa...');
                          confirmButton.click();
                          
                          // Kiểm tra kết quả xóa
                          setTimeout(() => {
                            const remainingRows = document.querySelectorAll('tr[class*="hover"], .product-row');
                            const deletedProductExists = Array.from(remainingRows).some(row => 
                              row.textContent.includes('Test Product UI')
                            );
                            
                            if (!deletedProductExists) {
                              console.log('✅ Sản phẩm đã được xóa thành công');
                              console.log('🎉 Test UI hoàn thành thành công!');
                            } else {
                              console.log('❌ Sản phẩm vẫn tồn tại sau khi xóa');
                            }
                          }, 1000);
                        } else {
                          console.log('⚠️ Không tìm thấy nút confirm');
                        }
                      }, 500);
                    } else {
                      console.log('❌ Không tìm thấy nút Delete');
                    }
                  }, 2000);
                } else {
                  console.log('❌ Không tìm thấy sản phẩm mới trong danh sách');
                }
              }, 2000);
            } else {
              console.log('❌ Không tìm thấy nút Save');
            }
          }, 1000);
        } else {
          console.log('❌ Không tìm thấy đủ trường input cần thiết');
        }
      } else {
        console.log('❌ Modal không mở sau khi click Add Product');
      }
    }, 1000);
  } else {
    console.log('❌ Không tìm thấy nút Add Product');
    console.log('🔍 Đang tìm kiếm các nút có thể...');
    
    // Tìm tất cả các nút trên trang
    const allButtons = document.querySelectorAll('button');
    console.log('📋 Tất cả các nút tìm thấy:');
    allButtons.forEach((btn, index) => {
      console.log(`${index + 1}. "${btn.textContent.trim()}" - Class: ${btn.className}`);
    });
  }
})();

console.log(`
📖 HƯỚNG DẪN:
1. Đảm bảo bạn đang ở trang /admin/products
2. Mở Developer Tools (F12) > Console
3. Paste script này vào console và nhấn Enter
4. Quan sát quá trình test tự động
`);