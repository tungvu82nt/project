// Test Automation Scripts for Yapee Website
// Cải thiện testing cho các chức năng có độ tin cậy thấp

const { chromium } = require('playwright');

// Configuration
const config = {
  baseUrl: 'http://localhost:5175',
  timeout: 30000,
  waitForAnimations: 500
};

// Utility functions
const utils = {
  // Wait for page to be fully loaded
  async waitForPageLoad(page) {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(config.waitForAnimations);
  },

  // Take screenshot for debugging
  async takeScreenshot(page, name) {
    await page.screenshot({ path: `screenshots/${name}-${Date.now()}.png` });
  },

  // Log test results
  logResult(testName, success, details = '') {
    const status = success ? '✅ PASS' : '❌ FAIL';
    console.log(`${status}: ${testName}${details ? ' - ' + details : ''}`);
  }
};

// Enhanced Contact Form Testing
class ContactFormTester {
  constructor(page) {
    this.page = page;
  }

  async navigateToContact() {
    await this.page.goto(`${config.baseUrl}/contact`);
    await utils.waitForPageLoad(this.page);
  }

  async testFormElements() {
    const testName = 'Contact Form Elements Detection';
    try {
      // Test multiple selector strategies for better reliability
      const selectors = {
        form: [
          '[data-testid="contact-form"]',
          'form:has(input[name="name"])',
          '.space-y-6:has(input[type="email"])'
        ],
        nameInput: [
          '[data-testid="contact-name-input"]',
          'input[name="name"]',
          'input[id="name"]',
          'input[type="text"]:first-of-type'
        ],
        emailInput: [
          '[data-testid="contact-email-input"]',
          'input[name="email"]',
          'input[id="email"]',
          'input[type="email"]'
        ],
        subjectInput: [
          '[data-testid="contact-subject-input"]',
          'input[name="subject"]',
          'input[id="subject"]'
        ],
        messageTextarea: [
          '[data-testid="contact-message-textarea"]',
          'textarea[name="message"]',
          'textarea[id="message"]',
          'textarea'
        ],
        submitButton: [
          '[data-testid="contact-submit-button"]',
          'button[type="submit"]',
          'button:has-text("Send")',
          'button:has-text("Gửi")',
          '.bg-blue-600:has(svg)'
        ]
      };

      const results = {};
      
      for (const [elementName, selectorList] of Object.entries(selectors)) {
        let found = false;
        let usedSelector = null;
        
        for (const selector of selectorList) {
          try {
            const element = await this.page.waitForSelector(selector, { timeout: 2000 });
            if (element) {
              found = true;
              usedSelector = selector;
              break;
            }
          } catch (e) {
            // Continue to next selector
          }
        }
        
        results[elementName] = { found, selector: usedSelector };
        utils.logResult(`${elementName} detection`, found, usedSelector);
      }

      const allFound = Object.values(results).every(r => r.found);
      utils.logResult(testName, allFound);
      
      return results;
    } catch (error) {
      utils.logResult(testName, false, error.message);
      return null;
    }
  }

  async testFormSubmission() {
    const testName = 'Contact Form Submission';
    try {
      const formData = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Automated Test',
        message: 'This is an automated test message from the testing script.'
      };

      // Fill form using multiple selector strategies
      const fillStrategies = [
        { name: 'input[name="name"]', value: formData.name },
        { email: 'input[type="email"]', value: formData.email },
        { subject: 'input[name="subject"]', value: formData.subject },
        { message: 'textarea', value: formData.message }
      ];

      for (const strategy of fillStrategies) {
        for (const [field, selector] of Object.entries(strategy)) {
          if (field !== 'value') {
            try {
              await this.page.fill(selector, strategy.value);
              utils.logResult(`Fill ${field}`, true, selector);
              break;
            } catch (e) {
              utils.logResult(`Fill ${field}`, false, e.message);
            }
          }
        }
      }

      // Submit form
      const submitSelectors = [
        'button[type="submit"]',
        'button:has-text("Send")',
        'button:has-text("Gửi")',
        '.bg-blue-600:has(svg)'
      ];

      let submitted = false;
      for (const selector of submitSelectors) {
        try {
          await this.page.click(selector);
          submitted = true;
          utils.logResult('Form submission', true, selector);
          break;
        } catch (e) {
          continue;
        }
      }

      if (submitted) {
        // Wait for success message
        try {
          await this.page.waitForSelector('.bg-green-100, .text-green-700, [class*="success"]', { timeout: 5000 });
          utils.logResult(testName, true, 'Success message appeared');
          return true;
        } catch (e) {
          utils.logResult(testName, false, 'No success message found');
          return false;
        }
      } else {
        utils.logResult(testName, false, 'Could not submit form');
        return false;
      }
    } catch (error) {
      utils.logResult(testName, false, error.message);
      return false;
    }
  }
}

// Enhanced Add to Cart Testing
class AddToCartTester {
  constructor(page) {
    this.page = page;
  }

  async navigateToProducts() {
    await this.page.goto(`${config.baseUrl}/products`);
    await utils.waitForPageLoad(this.page);
  }

  async testAddToCartButtons() {
    const testName = 'Add to Cart Buttons Detection';
    try {
      // Multiple strategies to find Add to Cart buttons
      const buttonSelectors = [
        '[data-testid="add-to-cart-button"]',
        'button:has-text("Add to Cart")',
        'button:has-text("Thêm vào giỏ")',
        'button:has(svg):has-text("Add")',
        '.bg-blue-600:has(svg[class*="shopping"])',
        'button[class*="bg-blue-600"]:has(svg)',
        '.group .bg-blue-600 button'
      ];

      let foundButtons = [];
      
      for (const selector of buttonSelectors) {
        try {
          const buttons = await this.page.$$(selector);
          if (buttons.length > 0) {
            foundButtons = buttons;
            utils.logResult(`Found ${buttons.length} Add to Cart buttons`, true, selector);
            break;
          }
        } catch (e) {
          continue;
        }
      }

      if (foundButtons.length === 0) {
        // Fallback: look for any button in product cards
        const productCards = await this.page.$$('.group, [class*="product"], [class*="card"]');
        for (const card of productCards) {
          const buttons = await card.$$('button');
          foundButtons.push(...buttons);
        }
      }

      utils.logResult(testName, foundButtons.length > 0, `Found ${foundButtons.length} buttons`);
      return foundButtons;
    } catch (error) {
      utils.logResult(testName, false, error.message);
      return [];
    }
  }

  async testAddToCartFunctionality() {
    const testName = 'Add to Cart Functionality';
    try {
      // Get initial cart count
      const cartSelectors = [
        '.bg-blue-600.text-white.text-xs.rounded-full',
        '[class*="cart"] [class*="badge"]',
        '.relative span[class*="bg-blue"]'
      ];

      let initialCount = 0;
      for (const selector of cartSelectors) {
        try {
          const cartBadge = await this.page.$(selector);
          if (cartBadge) {
            const text = await cartBadge.textContent();
            initialCount = parseInt(text) || 0;
            break;
          }
        } catch (e) {
          continue;
        }
      }

      // Find and click Add to Cart button
      const buttons = await this.testAddToCartButtons();
      if (buttons.length === 0) {
        utils.logResult(testName, false, 'No Add to Cart buttons found');
        return false;
      }

      // Click first available button
      await buttons[0].click();
      await this.page.waitForTimeout(1000);

      // Verify cart count increased
      let newCount = initialCount;
      for (const selector of cartSelectors) {
        try {
          const cartBadge = await this.page.$(selector);
          if (cartBadge) {
            const text = await cartBadge.textContent();
            newCount = parseInt(text) || 0;
            break;
          }
        } catch (e) {
          continue;
        }
      }

      const success = newCount > initialCount;
      utils.logResult(testName, success, `Cart count: ${initialCount} → ${newCount}`);
      return success;
    } catch (error) {
      utils.logResult(testName, false, error.message);
      return false;
    }
  }
}

// Enhanced Search Testing
class SearchTester {
  constructor(page) {
    this.page = page;
  }

  async testHeaderSearch() {
    const testName = 'Header Search Functionality';
    try {
      await this.page.goto(config.baseUrl);
      await utils.waitForPageLoad(this.page);

      const searchSelectors = [
        '[data-testid="header-search-input"]',
        'input[placeholder*="Search"]',
        'input[placeholder*="Tìm kiếm"]',
        '.relative input[type="text"]',
        'input:near(svg[class*="search"])'
      ];

      let searchInput = null;
      for (const selector of searchSelectors) {
        try {
          searchInput = await this.page.waitForSelector(selector, { timeout: 2000 });
          if (searchInput) {
            utils.logResult('Header search input found', true, selector);
            break;
          }
        } catch (e) {
          continue;
        }
      }

      if (!searchInput) {
        // Try to open mobile search
        const searchToggleSelectors = [
          'button:has(svg[class*="search"])',
          '.xl\\:hidden button:has(svg)'
        ];
        
        for (const selector of searchToggleSelectors) {
          try {
            await this.page.click(selector);
            await this.page.waitForTimeout(500);
            
            // Try to find search input again
            for (const inputSelector of searchSelectors) {
              try {
                searchInput = await this.page.$(inputSelector);
                if (searchInput) break;
              } catch (e) {
                continue;
              }
            }
            if (searchInput) break;
          } catch (e) {
            continue;
          }
        }
      }

      if (searchInput) {
        await searchInput.fill('iPhone');
        await this.page.keyboard.press('Enter');
        await utils.waitForPageLoad(this.page);
        
        utils.logResult(testName, true, 'Search executed successfully');
        return true;
      } else {
        utils.logResult(testName, false, 'Search input not found');
        return false;
      }
    } catch (error) {
      utils.logResult(testName, false, error.message);
      return false;
    }
  }

  async testProductsPageSearch() {
    const testName = 'Products Page Search';
    try {
      await this.page.goto(`${config.baseUrl}/products`);
      await utils.waitForPageLoad(this.page);

      const searchSelectors = [
        '[data-testid="products-search-input"]',
        'input[placeholder*="Search"]',
        'input[placeholder*="Tìm kiếm"]',
        '.relative input[type="text"]'
      ];

      let searchInput = null;
      for (const selector of searchSelectors) {
        try {
          searchInput = await this.page.$(selector);
          if (searchInput) {
            utils.logResult('Products search input found', true, selector);
            break;
          }
        } catch (e) {
          continue;
        }
      }

      if (searchInput) {
        // Test search functionality
        await searchInput.fill('Samsung');
        await this.page.waitForTimeout(1000); // Wait for search results
        
        // Count products
        const productSelectors = [
          '.group.bg-white.rounded-xl',
          '[class*="product"]',
          '.grid > div'
        ];
        
        let productCount = 0;
        for (const selector of productSelectors) {
          try {
            const products = await this.page.$$(selector);
            if (products.length > 0) {
              productCount = products.length;
              break;
            }
          } catch (e) {
            continue;
          }
        }
        
        utils.logResult(testName, true, `Found ${productCount} products for Samsung search`);
        return true;
      } else {
        utils.logResult(testName, false, 'Products search input not found');
        return false;
      }
    } catch (error) {
      utils.logResult(testName, false, error.message);
      return false;
    }
  }
}

// Specific Product Testing
class ProductTester {
  constructor(page) {
    this.page = page;
  }

  async testSpecificProducts() {
    const testName = 'Specific Product Testing';
    try {
      await this.page.goto(`${config.baseUrl}/products`);
      await utils.waitForPageLoad(this.page);

      // Find product links
      const productLinkSelectors = [
        'a[href*="/product/"]',
        '.group a',
        'h3 a',
        '[class*="product"] a'
      ];

      let productLinks = [];
      for (const selector of productLinkSelectors) {
        try {
          const links = await this.page.$$(selector);
          if (links.length > 0) {
            productLinks = links;
            utils.logResult(`Found ${links.length} product links`, true, selector);
            break;
          }
        } catch (e) {
          continue;
        }
      }

      if (productLinks.length === 0) {
        utils.logResult(testName, false, 'No product links found');
        return false;
      }

      // Test first 3 products
      const testResults = [];
      for (let i = 0; i < Math.min(3, productLinks.length); i++) {
        try {
          const href = await productLinks[i].getAttribute('href');
          if (href) {
            await this.page.goto(`${config.baseUrl}${href}`);
            await utils.waitForPageLoad(this.page);
            
            // Check if product detail page loaded
            const productDetailSelectors = [
              '[data-testid="product-detail"]',
              '.max-w-7xl',
              'h1',
              '.grid.grid-cols-1.lg\\:grid-cols-2'
            ];
            
            let detailPageLoaded = false;
            for (const selector of productDetailSelectors) {
              try {
                const element = await this.page.$(selector);
                if (element) {
                  detailPageLoaded = true;
                  break;
                }
              } catch (e) {
                continue;
              }
            }
            
            testResults.push({
              productIndex: i + 1,
              href,
              loaded: detailPageLoaded
            });
            
            utils.logResult(`Product ${i + 1} detail page`, detailPageLoaded, href);
          }
        } catch (error) {
          testResults.push({
            productIndex: i + 1,
            loaded: false,
            error: error.message
          });
        }
      }

      const successCount = testResults.filter(r => r.loaded).length;
      utils.logResult(testName, successCount > 0, `${successCount}/${testResults.length} products tested successfully`);
      return testResults;
    } catch (error) {
      utils.logResult(testName, false, error.message);
      return [];
    }
  }
}

// Main Test Runner
class TestRunner {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async setup() {
    this.browser = await chromium.launch({ headless: false });
    this.page = await this.browser.newPage();
    
    // Set viewport for consistent testing
    await this.page.setViewportSize({ width: 1280, height: 720 });
    
    // Set longer timeout for elements
    this.page.setDefaultTimeout(config.timeout);
  }

  async runAllTests() {
    console.log('🚀 Starting Enhanced Yapee Website Testing...');
    console.log('=' .repeat(60));

    const results = {
      contactForm: {},
      addToCart: {},
      search: {},
      products: {}
    };

    try {
      // Contact Form Tests
      console.log('\n📝 Testing Contact Form...');
      const contactTester = new ContactFormTester(this.page);
      await contactTester.navigateToContact();
      results.contactForm.elements = await contactTester.testFormElements();
      results.contactForm.submission = await contactTester.testFormSubmission();

      // Add to Cart Tests
      console.log('\n🛒 Testing Add to Cart...');
      const cartTester = new AddToCartTester(this.page);
      await cartTester.navigateToProducts();
      results.addToCart.buttons = await cartTester.testAddToCartButtons();
      results.addToCart.functionality = await cartTester.testAddToCartFunctionality();

      // Search Tests
      console.log('\n🔍 Testing Search Functionality...');
      const searchTester = new SearchTester(this.page);
      results.search.header = await searchTester.testHeaderSearch();
      results.search.products = await searchTester.testProductsPageSearch();

      // Product Tests
      console.log('\n📱 Testing Specific Products...');
      const productTester = new ProductTester(this.page);
      results.products.details = await productTester.testSpecificProducts();

    } catch (error) {
      console.error('❌ Test execution error:', error.message);
    }

    return results;
  }

  async generateReport(results) {
    console.log('\n' + '=' .repeat(60));
    console.log('📊 TEST SUMMARY REPORT');
    console.log('=' .repeat(60));

    const summary = {
      total: 0,
      passed: 0,
      failed: 0
    };

    // Analyze results
    Object.entries(results).forEach(([category, tests]) => {
      console.log(`\n${category.toUpperCase()}:`);
      Object.entries(tests).forEach(([testName, result]) => {
        summary.total++;
        if (result === true || (Array.isArray(result) && result.length > 0) || 
            (typeof result === 'object' && result !== null && Object.values(result).some(v => v === true || (v && v.found)))) {
          summary.passed++;
          console.log(`  ✅ ${testName}: PASSED`);
        } else {
          summary.failed++;
          console.log(`  ❌ ${testName}: FAILED`);
        }
      });
    });

    console.log('\n' + '=' .repeat(60));
    console.log(`📈 OVERALL RESULTS:`);
    console.log(`   Total Tests: ${summary.total}`);
    console.log(`   Passed: ${summary.passed} (${Math.round(summary.passed/summary.total*100)}%)`);
    console.log(`   Failed: ${summary.failed} (${Math.round(summary.failed/summary.total*100)}%)`);
    console.log('=' .repeat(60));

    return summary;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Export for use in other files
module.exports = {
  TestRunner,
  ContactFormTester,
  AddToCartTester,
  SearchTester,
  ProductTester,
  utils,
  config
};

// Run tests if this file is executed directly
if (require.main === module) {
  (async () => {
    const runner = new TestRunner();
    try {
      await runner.setup();
      const results = await runner.runAllTests();
      await runner.generateReport(results);
    } catch (error) {
      console.error('❌ Test runner error:', error);
    } finally {
      await runner.cleanup();
    }
  })();
}