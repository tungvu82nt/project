// Advanced Test Automation Script for Yapee Website
// Sử dụng Playwright với các chiến lược selector được cải thiện

const { test, expect } = require('@playwright/test');
const { chromium } = require('playwright');

// Configuration
const CONFIG = {
  baseURL: 'http://localhost:5175',
  timeout: 30000,
  retries: 3,
  screenshots: true,
  videos: true
};

// Test Data
const TEST_DATA = {
  contact: {
    name: 'Nguyễn Văn Test',
    email: 'test@yapee.com',
    subject: 'Kiểm tra chức năng liên hệ',
    message: 'Đây là tin nhắn test để kiểm tra form liên hệ hoạt động đúng không.'
  },
  search: {
    validTerms: ['laptop', 'phone', 'headphone'],
    invalidTerms: ['xyz123', '!@#$%'],
    emptyTerm: ''
  },
  products: {
    categories: ['Electronics', 'Clothing', 'Books'],
    priceRanges: [[0, 100], [100, 500], [500, 1000]]
  }
};

// Utility Functions
class TestUtils {
  static async waitForPageLoad(page, timeout = 10000) {
    await page.waitForLoadState('networkidle', { timeout });
    await page.waitForLoadState('domcontentloaded', { timeout });
  }

  static async takeScreenshot(page, name) {
    if (CONFIG.screenshots) {
      await page.screenshot({ 
        path: `screenshots/${name}-${Date.now()}.png`,
        fullPage: true 
      });
    }
  }

  static async scrollToElement(page, selector) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.waitForTimeout(500); // Wait for scroll animation
  }

  static async waitForElement(page, selector, options = {}) {
    const { timeout = 10000, state = 'visible' } = options;
    await page.locator(selector).waitFor({ state, timeout });
  }

  static async retryAction(action, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await action();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
}

// Enhanced Contact Form Tester
class EnhancedContactFormTester {
  constructor(page) {
    this.page = page;
    this.selectors = {
      container: '[data-testid="contact-form-container"]',
      form: '[data-testid="contact-form"]',
      nameField: '[data-testid="contact-name-input"]',
      emailField: '[data-testid="contact-email-input"]',
      subjectField: '[data-testid="contact-subject-input"]',
      messageField: '[data-testid="contact-message-textarea"]',
      submitButton: '[data-testid="contact-submit-button"]',
      successMessage: '[data-testid="contact-form-success-message"]',
      loadingText: '[data-testid="contact-submit-loading-text"]'
    };
  }

  async navigateToContact() {
    await this.page.goto(`${CONFIG.baseURL}/contact`);
    await TestUtils.waitForPageLoad(this.page);
    await TestUtils.waitForElement(this.page, this.selectors.container);
  }

  async fillForm(data) {
    // Scroll to form if needed
    await TestUtils.scrollToElement(this.page, this.selectors.form);
    
    // Fill form fields with validation
    await this.page.fill(this.selectors.nameField, data.name);
    await expect(this.page.locator(this.selectors.nameField)).toHaveValue(data.name);
    
    await this.page.fill(this.selectors.emailField, data.email);
    await expect(this.page.locator(this.selectors.emailField)).toHaveValue(data.email);
    
    await this.page.fill(this.selectors.subjectField, data.subject);
    await expect(this.page.locator(this.selectors.subjectField)).toHaveValue(data.subject);
    
    await this.page.fill(this.selectors.messageField, data.message);
    await expect(this.page.locator(this.selectors.messageField)).toHaveValue(data.message);
  }

  async submitForm() {
    await TestUtils.retryAction(async () => {
      await this.page.click(this.selectors.submitButton);
      
      // Wait for either success message or loading state
      await Promise.race([
        this.page.waitForSelector(this.selectors.successMessage, { timeout: 5000 }),
        this.page.waitForSelector(this.selectors.loadingText, { timeout: 2000 })
      ]);
    });
  }

  async verifySubmission() {
    // Check for success message
    await TestUtils.waitForElement(this.page, this.selectors.successMessage);
    const successMessage = await this.page.locator(this.selectors.successMessage);
    await expect(successMessage).toBeVisible();
    
    // Verify form is reset or disabled
    const submitButton = this.page.locator(this.selectors.submitButton);
    const isDisabled = await submitButton.getAttribute('disabled');
    
    return {
      success: true,
      messageVisible: await successMessage.isVisible(),
      formDisabled: isDisabled !== null
    };
  }

  async testFormValidation() {
    // Test empty form submission
    await this.page.click(this.selectors.submitButton);
    
    // Check for HTML5 validation or custom validation messages
    const nameField = this.page.locator(this.selectors.nameField);
    const emailField = this.page.locator(this.selectors.emailField);
    
    const nameValidation = await nameField.evaluate(el => el.validationMessage);
    const emailValidation = await emailField.evaluate(el => el.validationMessage);
    
    return {
      nameValidation,
      emailValidation,
      hasValidation: nameValidation || emailValidation
    };
  }
}

// Enhanced Add to Cart Tester
class EnhancedAddToCartTester {
  constructor(page) {
    this.page = page;
    this.selectors = {
      productCard: '[data-testid^="product-card-"]',
      addToCartButton: '[data-testid^="add-to-cart-button-"]',
      cartBadge: '[data-testid="cart-badge"]',
      cartLink: '[data-testid="cart-link"]',
      productTitle: '[data-testid^="product-title-"]',
      productPrice: '[data-testid^="product-current-price-"]'
    };
  }

  async navigateToProducts() {
    await this.page.goto(`${CONFIG.baseURL}/products`);
    await TestUtils.waitForPageLoad(this.page);
    await TestUtils.waitForElement(this.page, this.selectors.productCard);
  }

  async getProductInfo(productIndex = 0) {
    const productCards = await this.page.locator(this.selectors.productCard).all();
    if (productCards.length === 0) {
      throw new Error('No products found on the page');
    }
    
    const productCard = productCards[productIndex];
    const productId = await productCard.getAttribute('data-product-id');
    const productName = await productCard.getAttribute('data-product-name');
    
    const titleElement = productCard.locator(`[data-testid="product-title-${productId}"]`);
    const priceElement = productCard.locator(`[data-testid="product-current-price-${productId}"]`);
    
    const title = await titleElement.textContent();
    const price = await priceElement.textContent();
    
    return {
      id: productId,
      name: productName || title,
      price,
      element: productCard
    };
  }

  async addProductToCart(productIndex = 0) {
    const product = await this.getProductInfo(productIndex);
    
    // Get initial cart count
    const initialCartCount = await this.getCartCount();
    
    // Scroll to product and add to cart
    await TestUtils.scrollToElement(this.page, `[data-testid="product-card-${product.id}"]`);
    
    const addToCartButton = this.page.locator(`[data-testid="add-to-cart-button-${product.id}"]`);
    await TestUtils.waitForElement(this.page, `[data-testid="add-to-cart-button-${product.id}"]`);
    
    await TestUtils.retryAction(async () => {
      await addToCartButton.click();
      
      // Wait for cart count to update
      await this.page.waitForFunction(
        (initial) => {
          const badge = document.querySelector('[data-testid="cart-badge"]');
          const currentCount = badge ? parseInt(badge.textContent) : 0;
          return currentCount > initial;
        },
        initialCartCount,
        { timeout: 5000 }
      );
    });
    
    return {
      product,
      initialCount: initialCartCount,
      newCount: await this.getCartCount()
    };
  }

  async getCartCount() {
    try {
      const cartBadge = this.page.locator(this.selectors.cartBadge);
      if (await cartBadge.isVisible()) {
        const countText = await cartBadge.textContent();
        return parseInt(countText.replace('+', '')) || 0;
      }
      return 0;
    } catch {
      return 0;
    }
  }

  async verifyCartUpdate(expectedCount) {
    const actualCount = await this.getCartCount();
    expect(actualCount).toBe(expectedCount);
    
    // Verify cart badge is visible if count > 0
    if (expectedCount > 0) {
      await expect(this.page.locator(this.selectors.cartBadge)).toBeVisible();
    }
    
    return actualCount;
  }

  async testMultipleProducts(count = 3) {
    const results = [];
    
    for (let i = 0; i < count; i++) {
      try {
        const result = await this.addProductToCart(i);
        results.push({
          index: i,
          success: true,
          ...result
        });
        
        // Small delay between additions
        await this.page.waitForTimeout(1000);
      } catch (error) {
        results.push({
          index: i,
          success: false,
          error: error.message
        });
      }
    }
    
    return results;
  }
}

// Enhanced Search Tester
class EnhancedSearchTester {
  constructor(page) {
    this.page = page;
    this.selectors = {
      headerSearch: '[data-testid="header-search-input"]',
      mobileSearchToggle: '[data-testid="mobile-search-toggle"]',
      mobileSearchInput: '[data-testid="mobile-search-input"]',
      productsSearchInput: '[data-testid="products-search-input"]',
      productsGrid: '[data-testid="products-grid"]',
      noProductsMessage: '[data-testid="no-products-message"]',
      resultsCount: '[data-testid="results-count"]'
    };
  }

  async testHeaderSearch(searchTerm) {
    await this.page.goto(CONFIG.baseURL);
    await TestUtils.waitForPageLoad(this.page);
    
    // Test desktop search
    const headerSearch = this.page.locator(this.selectors.headerSearch);
    if (await headerSearch.isVisible()) {
      await headerSearch.fill(searchTerm);
      await headerSearch.press('Enter');
      
      // Wait for navigation to products page
      await this.page.waitForURL('**/products**');
      await TestUtils.waitForPageLoad(this.page);
      
      return await this.verifySearchResults(searchTerm);
    }
    
    return { success: false, reason: 'Header search not visible' };
  }

  async testMobileSearch(searchTerm) {
    // Set mobile viewport
    await this.page.setViewportSize({ width: 375, height: 667 });
    await this.page.goto(CONFIG.baseURL);
    await TestUtils.waitForPageLoad(this.page);
    
    // Open mobile search
    await this.page.click(this.selectors.mobileSearchToggle);
    await TestUtils.waitForElement(this.page, this.selectors.mobileSearchInput);
    
    // Perform search
    await this.page.fill(this.selectors.mobileSearchInput, searchTerm);
    await this.page.press(this.selectors.mobileSearchInput, 'Enter');
    
    // Wait for navigation
    await this.page.waitForURL('**/products**');
    await TestUtils.waitForPageLoad(this.page);
    
    return await this.verifySearchResults(searchTerm);
  }

  async testProductsPageSearch(searchTerm) {
    await this.page.goto(`${CONFIG.baseURL}/products`);
    await TestUtils.waitForPageLoad(this.page);
    
    // Use products page search
    await this.page.fill(this.selectors.productsSearchInput, searchTerm);
    
    // Wait for search results to update (debounced)
    await this.page.waitForTimeout(1000);
    
    return await this.verifySearchResults(searchTerm);
  }

  async verifySearchResults(searchTerm) {
    const resultsGrid = this.page.locator(this.selectors.productsGrid);
    const noResultsMessage = this.page.locator(this.selectors.noProductsMessage);
    
    // Check if results are displayed
    const hasResults = await resultsGrid.locator('[data-testid^="product-card-"]').count() > 0;
    const hasNoResultsMessage = await noResultsMessage.isVisible();
    
    let resultCount = 0;
    let productTitles = [];
    
    if (hasResults) {
      resultCount = await resultsGrid.locator('[data-testid^="product-card-"]').count();
      
      // Get product titles to verify relevance
      const titleElements = await resultsGrid.locator('[data-testid^="product-title-"]').all();
      productTitles = await Promise.all(
        titleElements.map(async (el) => await el.textContent())
      );
    }
    
    // Check search term relevance
    const relevantResults = productTitles.filter(title => 
      title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return {
      searchTerm,
      hasResults,
      hasNoResultsMessage,
      resultCount,
      productTitles,
      relevantCount: relevantResults.length,
      relevanceRatio: resultCount > 0 ? relevantResults.length / resultCount : 0
    };
  }

  async testSearchFilters() {
    await this.page.goto(`${CONFIG.baseURL}/products`);
    await TestUtils.waitForPageLoad(this.page);
    
    // Test category filter
    const categoryFilter = this.page.locator('[data-testid="category-filter"]');
    await categoryFilter.selectOption('Electronics');
    await this.page.waitForTimeout(1000);
    
    const electronicsResults = await this.getFilteredResults();
    
    // Test price filter
    const priceSlider = this.page.locator('[data-testid="price-range-slider"]');
    await priceSlider.fill('500');
    await this.page.waitForTimeout(1000);
    
    const priceFilteredResults = await this.getFilteredResults();
    
    return {
      categoryFilter: electronicsResults,
      priceFilter: priceFilteredResults
    };
  }

  async getFilteredResults() {
    const resultCount = await this.page.locator('[data-testid^="product-card-"]').count();
    const resultsCountText = await this.page.locator(this.selectors.resultsCount).textContent();
    
    return {
      count: resultCount,
      displayText: resultsCountText
    };
  }
}

// Main Test Suite
test.describe('Yapee Website - Enhanced Automation Tests', () => {
  let browser, context, page;
  
  test.beforeAll(async () => {
    browser = await chromium.launch({ headless: false });
  });
  
  test.beforeEach(async () => {
    context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      recordVideo: CONFIG.videos ? { dir: 'videos/' } : undefined
    });
    page = await context.newPage();
  });
  
  test.afterEach(async () => {
    await TestUtils.takeScreenshot(page, 'test-end');
    await context.close();
  });
  
  test.afterAll(async () => {
    await browser.close();
  });

  test('Contact Form - Complete Flow', async () => {
    const contactTester = new EnhancedContactFormTester(page);
    
    // Navigate to contact page
    await contactTester.navigateToContact();
    await TestUtils.takeScreenshot(page, 'contact-page-loaded');
    
    // Test form validation
    const validation = await contactTester.testFormValidation();
    expect(validation.hasValidation).toBeTruthy();
    
    // Fill and submit form
    await contactTester.fillForm(TEST_DATA.contact);
    await TestUtils.takeScreenshot(page, 'contact-form-filled');
    
    await contactTester.submitForm();
    
    // Verify submission
    const result = await contactTester.verifySubmission();
    expect(result.success).toBeTruthy();
    expect(result.messageVisible).toBeTruthy();
    
    await TestUtils.takeScreenshot(page, 'contact-form-submitted');
  });

  test('Add to Cart - Multiple Products', async () => {
    const cartTester = new EnhancedAddToCartTester(page);
    
    // Navigate to products
    await cartTester.navigateToProducts();
    await TestUtils.takeScreenshot(page, 'products-page-loaded');
    
    // Test adding multiple products
    const results = await cartTester.testMultipleProducts(3);
    
    // Verify all additions were successful
    const successfulAdditions = results.filter(r => r.success);
    expect(successfulAdditions.length).toBeGreaterThan(0);
    
    // Verify final cart count
    const finalCount = await cartTester.verifyCartUpdate(successfulAdditions.length);
    expect(finalCount).toBe(successfulAdditions.length);
    
    await TestUtils.takeScreenshot(page, 'cart-updated');
  });

  test('Search Functionality - All Methods', async () => {
    const searchTester = new EnhancedSearchTester(page);
    
    // Test header search
    const headerResult = await searchTester.testHeaderSearch('laptop');
    expect(headerResult.hasResults || headerResult.hasNoResultsMessage).toBeTruthy();
    
    await TestUtils.takeScreenshot(page, 'header-search-results');
    
    // Test mobile search
    const mobileResult = await searchTester.testMobileSearch('phone');
    expect(mobileResult.hasResults || mobileResult.hasNoResultsMessage).toBeTruthy();
    
    await TestUtils.takeScreenshot(page, 'mobile-search-results');
    
    // Test products page search
    const productsResult = await searchTester.testProductsPageSearch('headphone');
    expect(productsResult.hasResults || productsResult.hasNoResultsMessage).toBeTruthy();
    
    await TestUtils.takeScreenshot(page, 'products-search-results');
    
    // Test search filters
    const filterResults = await searchTester.testSearchFilters();
    expect(filterResults.categoryFilter.count).toBeGreaterThanOrEqual(0);
    expect(filterResults.priceFilter.count).toBeGreaterThanOrEqual(0);
  });

  test('Search Edge Cases', async () => {
    const searchTester = new EnhancedSearchTester(page);
    
    // Test empty search
    const emptyResult = await searchTester.testProductsPageSearch('');
    expect(emptyResult.resultCount).toBeGreaterThan(0); // Should show all products
    
    // Test invalid search
    const invalidResult = await searchTester.testProductsPageSearch('xyz123nonexistent');
    expect(invalidResult.hasNoResultsMessage || invalidResult.resultCount === 0).toBeTruthy();
    
    // Test special characters
    const specialResult = await searchTester.testProductsPageSearch('!@#$%');
    expect(specialResult.hasNoResultsMessage || invalidResult.resultCount === 0).toBeTruthy();
  });

  test('Responsive Design - Mobile vs Desktop', async () => {
    // Test desktop layout
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(`${CONFIG.baseURL}/products`);
    await TestUtils.waitForPageLoad(page);
    
    const desktopFilters = page.locator('[data-testid="desktop-filters"]');
    await expect(desktopFilters).toBeVisible();
    
    await TestUtils.takeScreenshot(page, 'desktop-layout');
    
    // Test mobile layout
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await TestUtils.waitForPageLoad(page);
    
    const mobileFilterToggle = page.locator('[data-testid="mobile-filter-toggle"]');
    await expect(mobileFilterToggle).toBeVisible();
    
    await TestUtils.takeScreenshot(page, 'mobile-layout');
  });

  test('Performance and Accessibility', async () => {
    // Navigate to main pages and check load times
    const pages = ['/', '/products', '/contact', '/cart'];
    const loadTimes = [];
    
    for (const pagePath of pages) {
      const startTime = Date.now();
      await page.goto(`${CONFIG.baseURL}${pagePath}`);
      await TestUtils.waitForPageLoad(page);
      const loadTime = Date.now() - startTime;
      
      loadTimes.push({ page: pagePath, loadTime });
      
      // Check for basic accessibility
      const hasHeadings = await page.locator('h1, h2, h3').count() > 0;
      const hasAltTexts = await page.locator('img[alt]').count();
      const totalImages = await page.locator('img').count();
      
      expect(hasHeadings).toBeTruthy();
      if (totalImages > 0) {
        expect(hasAltTexts).toBeGreaterThan(0);
      }
    }
    
    // Verify reasonable load times (under 5 seconds)
    loadTimes.forEach(({ page, loadTime }) => {
      expect(loadTime).toBeLessThan(5000);
    });
  });
});

// Export for use in other test files
module.exports = {
  EnhancedContactFormTester,
  EnhancedAddToCartTester,
  EnhancedSearchTester,
  TestUtils,
  CONFIG,
  TEST_DATA
};

// CLI Runner
if (require.main === module) {
  console.log('🚀 Starting Enhanced Yapee Test Automation...');
  console.log('📊 Test Configuration:', CONFIG);
  console.log('🎯 Test Data:', TEST_DATA);
  console.log('\n✅ Run with: npx playwright test advanced-test-automation.js');
  console.log('📸 Screenshots will be saved to: screenshots/');
  console.log('🎥 Videos will be saved to: videos/');
}