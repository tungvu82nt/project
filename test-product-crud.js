// Test script để kiểm tra chức năng thêm/xóa sản phẩm
// Chạy script này trong console của trình duyệt tại trang /admin/products

(async function testProductCRUD() {
  console.log('🧪 Bắt đầu test chức năng CRUD sản phẩm...');
  
  // Import ProductService
  const { productService } = await import('./src/services/ProductService.ts');
  
  // Test 1: Lấy danh sách sản phẩm hiện tại
  console.log('\n📋 Test 1: Lấy danh sách sản phẩm hiện tại');
  const initialProducts = await productService.getAllProducts();
  console.log(`Số sản phẩm hiện tại: ${initialProducts.length}`);
  console.log('Danh sách sản phẩm:', initialProducts.map(p => ({ id: p.id, name: p.name, price: p.price })));
  
  // Test 2: Thêm sản phẩm mới
  console.log('\n➕ Test 2: Thêm sản phẩm mới');
  const newProduct = {
    name: 'Test Product ' + Date.now(),
    description: 'Đây là sản phẩm test được tạo tự động',
    price: 99.99,
    originalPrice: 129.99,
    category: 'Electronics',
    images: ['https://via.placeholder.com/300x300?text=Test+Product'],
    inStock: true,
    stockQuantity: 50,
    featured: false
  };
  
  try {
    const createdProduct = await productService.createProduct(newProduct);
    console.log('✅ Sản phẩm đã được tạo thành công:', createdProduct);
    
    // Kiểm tra sản phẩm có được thêm vào danh sách không
    const updatedProducts = await productService.getAllProducts();
    console.log(`Số sản phẩm sau khi thêm: ${updatedProducts.length}`);
    
    if (updatedProducts.length === initialProducts.length + 1) {
      console.log('✅ Dữ liệu đã được cập nhật chính xác');
    } else {
      console.log('❌ Có vấn đề với việc cập nhật dữ liệu');
    }
    
    // Test 3: Cập nhật sản phẩm
    console.log('\n✏️ Test 3: Cập nhật sản phẩm');
    const updatedData = {
      ...createdProduct,
      name: createdProduct.name + ' (Updated)',
      price: 79.99
    };
    
    const updatedProduct = await productService.updateProduct(createdProduct.id, updatedData);
    console.log('✅ Sản phẩm đã được cập nhật:', updatedProduct);
    
    // Test 4: Kiểm tra dữ liệu sau khi reload
    console.log('\n🔄 Test 4: Kiểm tra tính bền vững dữ liệu');
    
    // Lưu ID sản phẩm để test sau reload
    localStorage.setItem('testProductId', createdProduct.id.toString());
    
    console.log('💾 Dữ liệu đã được lưu vào localStorage');
    console.log('🔄 Hãy reload trang và chạy lại script để kiểm tra tính bền vững');
    
    // Test 5: Xóa sản phẩm (sau 5 giây)
    setTimeout(async () => {
      console.log('\n🗑️ Test 5: Xóa sản phẩm test');
      try {
        await productService.deleteProduct(createdProduct.id);
        console.log('✅ Sản phẩm đã được xóa thành công');
        
        const finalProducts = await productService.getAllProducts();
        console.log(`Số sản phẩm sau khi xóa: ${finalProducts.length}`);
        
        if (finalProducts.length === initialProducts.length) {
          console.log('✅ Dữ liệu đã được khôi phục về trạng thái ban đầu');
        } else {
          console.log('❌ Có vấn đề với việc xóa dữ liệu');
        }
        
        localStorage.removeItem('testProductId');
        console.log('\n🎉 Hoàn thành tất cả test cases!');
        
      } catch (error) {
        console.error('❌ Lỗi khi xóa sản phẩm:', error);
      }
    }, 5000);
    
  } catch (error) {
    console.error('❌ Lỗi khi tạo sản phẩm:', error);
  }
  
  // Test persistence sau reload
  const testProductId = localStorage.getItem('testProductId');
  if (testProductId) {
    console.log('\n🔍 Test persistence: Kiểm tra sản phẩm sau reload');
    try {
      const persistedProduct = await productService.getProductById(parseInt(testProductId));
      if (persistedProduct) {
        console.log('✅ Dữ liệu vẫn tồn tại sau reload:', persistedProduct.name);
      } else {
        console.log('❌ Dữ liệu không tồn tại sau reload');
      }
    } catch (error) {
      console.log('❌ Lỗi khi kiểm tra persistence:', error);
    }
  }
})();

// Hướng dẫn sử dụng
console.log(`
📖 HƯỚNG DẪN SỬ DỤNG:
1. Mở trang /admin/products trong trình duyệt
2. Mở Developer Tools (F12)
3. Vào tab Console
4. Copy và paste nội dung file này vào console
5. Nhấn Enter để chạy test
6. Quan sát kết quả test trong console
7. Reload trang và chạy lại để test persistence
`);