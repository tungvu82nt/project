import { test, expect } from '@playwright/test';

// Test đăng nhập admin
test('Admin login', async ({ page }) => {
  await page.goto('http://localhost:5173/admin/login');
  await page.fill('input[name="email"]', 'admin@example.com');
  await page.fill('input[name="password"]', 'adminPassword123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/admin/dashboard');
});

// Test quản lý danh mục
test.describe('Category Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/admin/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'adminPassword123');
    await page.click('button[type="submit"]');
    await page.goto('http://localhost:5173/admin/categories');
  });

  test('Add new category', async ({ page }) => {
    await page.click('button:has-text("Thêm danh mục")');
    await page.fill('input[name="name"]', 'Test Category');
    await page.fill('textarea[name="description"]', 'Test Description');
    await page.click('button:has-text("Lưu")');
    await expect(page.locator('text=Danh mục đã được thêm thành công')).toBeVisible();
  });

  test('Edit category', async ({ page }) => {
    await page.click('tr:has-text("Test Category") >> button:has-text("Sửa")');
    await page.fill('input[name="name"]', 'Updated Category');
    await page.click('button:has-text("Lưu")');
    await expect(page.locator('text=Danh mục đã được cập nhật thành công')).toBeVisible();
  });

  test('Delete category', async ({ page }) => {
    await page.click('tr:has-text("Updated Category") >> button:has-text("Xóa")');
    await page.click('button:has-text("Xác nhận")');
    await expect(page.locator('text=Danh mục đã được xóa thành công')).toBeVisible();
  });
});

// Test quản lý khách hàng
test.describe('Customer Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/admin/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'adminPassword123');
    await page.click('button[type="submit"]');
    await page.goto('http://localhost:5173/admin/customers');
  });

  test('Xem chi tiết khách hàng', async ({ page }) => {
    await page.click('tr:first-child >> button:has-text("Xem")');
    await expect(page.locator('h2:has-text("Thông tin khách hàng")')).toBeVisible();
  });

  test('Chỉnh sửa khách hàng', async ({ page }) => {
    await page.click('tr:first-child >> button:has-text("Sửa")');
    await page.fill('input[name="name"]', 'Tên khách hàng cập nhật');
    await page.click('button:has-text("Lưu")');
    await expect(page.locator('text=Khách hàng đã được cập nhật thành công')).toBeVisible();
  });

  test('Xóa khách hàng', async ({ page }) => {
    await page.click('tr:first-child >> button:has-text("Xóa")');
    await page.click('button:has-text("Xác nhận")');
    await expect(page.locator('text=Khách hàng đã được xóa thành công')).toBeVisible();
  });
});

// Test công cụ marketing
test.describe('Marketing Tools', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/admin/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'adminPassword123');
    await page.click('button[type="submit"]');
    await page.goto('http://localhost:5173/admin/marketing');
  });

  test('Tạo chiến dịch mới', async ({ page }) => {
    await page.click('button:has-text("Tạo chiến dịch")');
    await page.fill('input[name="name"]', 'Chiến dịch test');
    await page.fill('textarea[name="description"]', 'Mô tả chiến dịch test');
    await page.click('button:has-text("Lưu")');
    await expect(page.locator('text=Chiến dịch đã được tạo thành công')).toBeVisible();
  });
});

// Test quản lý nội dung
test.describe('Content Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/admin/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'adminPassword123');
    await page.click('button[type="submit"]');
    await page.goto('http://localhost:5173/admin/content');
  });

  test('Thêm nội dung mới', async ({ page }) => {
    await page.click('button:has-text("Thêm nội dung")');
    await page.selectOption('select[name="type"]', 'blog');
    await page.fill('input[name="title"]', 'Tiêu đề blog test');
    await page.fill('textarea[name="content"]', 'Nội dung blog test');
    await page.click('button:has-text("Xuất bản")');
    await expect(page.locator('text=Nội dung đã được xuất bản thành công')).toBeVisible();
  });
});

// Test cài đặt
test.describe('Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/admin/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'adminPassword123');
    await page.click('button[type="submit"]');
    await page.goto('http://localhost:5173/admin/settings');
  });

  test('Cập nhật cài đặt chung', async ({ page }) => {
    await page.fill('input[name="siteName"]', 'Tên trang web cập nhật');
    await page.click('button:has-text("Lưu cài đặt")');
    await expect(page.locator('text=Cài đặt đã được cập nhật thành công')).toBeVisible();
  });
});