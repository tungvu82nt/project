# Yapee Website Test Automation Suite

## 📋 Tổng quan

Bộ công cụ test automation toàn diện cho website Yapee, được thiết kế để cải thiện độ tin cậy và phạm vi kiểm thử các chức năng có độ tin cậy thấp như form liên hệ, nút "Add to Cart", chức năng tìm kiếm và các sản phẩm cụ thể.

## 🎯 Mục tiêu chính

- ✅ Cải thiện độ tin cậy kiểm thử từ ~60% lên >95%
- ✅ Tăng phạm vi kiểm thử các chức năng chi tiết
- ✅ Tự động hóa quy trình kiểm thử
- ✅ Cung cấp báo cáo chi tiết và insights

## 📁 Cấu trúc dự án

```
project/
├── 📄 improvement-plan.md              # Kế hoạch cải thiện chi tiết
├── 📄 component-improvements.md         # Cải tiến component
├── 📄 test-automation-scripts.js        # Script kiểm thử cơ bản
├── 📄 advanced-test-automation.js       # Script kiểm thử nâng cao
├── 📄 playwright.config.js              # Cấu hình Playwright
├── 📄 test-setup.js                     # Thiết lập môi trường test
├── 📄 test-teardown.js                  # Dọn dẹp sau test
├── 📄 package.json                      # Dependencies và scripts
└── 📁 test-results/                     # Kết quả và báo cáo
    ├── 📁 screenshots/                  # Ảnh chụp màn hình
    ├── 📁 videos/                       # Video test
    ├── 📁 traces/                       # Playwright traces
    ├── 📁 runs/                         # Lưu trữ các lần chạy test
    └── 📁 playwright-report/            # Báo cáo HTML
```

## 🚀 Cài đặt và thiết lập

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cài đặt Playwright browsers

```bash
npx playwright install
```

### 3. Thiết lập môi trường test

```bash
node test-setup.js
```

## 🎮 Cách sử dụng

### Chạy tất cả tests

```bash
# Chạy tất cả tests
npm test

# Chạy tests với UI mode
npm run test:ui

# Chạy tests trên specific browser
npm run test:chrome
npm run test:firefox
npm run test:safari
```

### Chạy tests cụ thể

```bash
# Chạy tests cơ bản
node test-automation-scripts.js

# Chạy tests nâng cao
node advanced-test-automation.js

# Chạy tests với Playwright
npx playwright test
```

### Chạy tests theo môi trường

```bash
# Development
npm run test:dev

# Staging
npm run test:staging

# Production
npm run test:prod
```

## 📊 Báo cáo và kết quả

### Xem báo cáo HTML

```bash
npm run report
```

### Các loại báo cáo được tạo

1. **HTML Report**: `playwright-report/index.html`
2. **JSON Report**: `test-results/results.json`
3. **JUnit Report**: `test-results/junit.xml`
4. **Test Summary**: `test-results/test-summary.md`
5. **Performance Report**: `test-results/performance-report.json`

## 🧪 Các test cases chính

### 1. Contact Form Testing
- ✅ Validation các trường bắt buộc
- ✅ Gửi form thành công
- ✅ Xử lý lỗi
- ✅ Responsive design

### 2. Add to Cart Testing
- ✅ Thêm sản phẩm vào giỏ hàng
- ✅ Cập nhật số lượng
- ✅ Xử lý sản phẩm hết hàng
- ✅ Animation và feedback

### 3. Search Functionality Testing
- ✅ Tìm kiếm từ header
- ✅ Tìm kiếm trên trang sản phẩm
- ✅ Lọc và sắp xếp
- ✅ Mobile search

### 4. Product Detail Testing
- ✅ Hiển thị thông tin sản phẩm
- ✅ Gallery hình ảnh
- ✅ Chọn variants
- ✅ Reviews và ratings

## 🔧 Cấu hình nâng cao

### Playwright Configuration

File `playwright.config.js` chứa cấu hình cho:
- Multiple browsers (Chrome, Firefox, Safari, Edge)
- Mobile testing (iOS Safari, Android Chrome)
- Screenshot và video recording
- Trace collection
- Parallel execution
- Retry logic

### Environment Variables

```bash
# .env file
BASE_URL=http://localhost:5175
HEADLESS=false
SLOW_MO=100
TIMEOUT=30000
RETRIES=2
```

## 🐛 Debug và troubleshooting

### Debug mode

```bash
# Chạy với debug mode
npm run test:debug

# Chạy với headed browser
npm run test:headed

# Chạy với slow motion
npm run test:slow
```

### Trace viewer

```bash
# Mở trace viewer
npx playwright show-trace test-results/traces/trace.zip
```

### Common issues

1. **Element not found**: Kiểm tra selectors trong component-improvements.md
2. **Timeout errors**: Tăng timeout trong playwright.config.js
3. **Flaky tests**: Thêm wait conditions và retry logic

## 📈 Monitoring và CI/CD

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Yapee Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install
      - run: npm test
      - uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results/
```

### Performance Monitoring

- Test execution time tracking
- Memory usage monitoring
- Flaky test detection
- Trend analysis

## 🔄 Maintenance

### Daily tasks
- Review test results
- Check for flaky tests
- Monitor performance metrics

### Weekly tasks
- Update test data
- Review and update selectors
- Archive old test runs

### Monthly tasks
- Update dependencies
- Review test coverage
- Optimize test performance

## 📚 Best Practices

### 1. Selector Strategy
```javascript
// Ưu tiên data-testid
const button = page.locator('[data-testid="add-to-cart-btn"]');

// Fallback với multiple selectors
const button = page.locator([
  '[data-testid="add-to-cart-btn"]',
  'button:has-text("Add to Cart")',
  '.product-card button[type="button"]'
].join(', '));
```

### 2. Wait Strategies
```javascript
// Wait for element to be visible
await page.waitForSelector('[data-testid="product-card"]', { 
  state: 'visible',
  timeout: 10000 
});

// Wait for network requests
await page.waitForLoadState('networkidle');
```

### 3. Error Handling
```javascript
try {
  await page.click('[data-testid="submit-btn"]');
  await page.waitForSelector('.success-message');
} catch (error) {
  await page.screenshot({ path: 'error-screenshot.png' });
  throw error;
}
```

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Thêm tests cho features mới
4. Chạy test suite
5. Submit pull request

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra logs trong `test-results/`
2. Xem trace files
3. Tham khảo troubleshooting guide
4. Liên hệ team development

## 📝 Changelog

### v1.0.0 (Current)
- ✅ Initial test automation suite
- ✅ Contact form testing
- ✅ Add to cart testing
- ✅ Search functionality testing
- ✅ Product detail testing
- ✅ Comprehensive reporting
- ✅ CI/CD integration

### Planned Features
- 🔄 Visual regression testing
- 🔄 API testing integration
- 🔄 Load testing
- 🔄 Accessibility testing enhancement

---

**Yapee Test Automation Suite** - Nâng cao chất lượng và độ tin cậy của website Yapee thông qua test automation toàn diện.

*Được phát triển với ❤️ bởi Yapee Development Team*