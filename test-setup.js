// Global Test Setup for Yapee Website Automation
// This file runs before all tests to prepare the testing environment

import fs from 'fs-extra';
import path from 'path';

/**
 * Global setup function that runs before all tests
 * @param {import('@playwright/test').FullConfig} config
 */
async function globalSetup(config) {
  console.log('🚀 Starting Yapee Test Automation Setup...');
  
  // Create necessary directories
  const directories = [
    'screenshots',
    'videos', 
    'test-results',
    'playwright-report',
    'traces',
    'downloads'
  ];
  
  console.log('📁 Creating test directories...');
  for (const dir of directories) {
    await fs.ensureDir(dir);
    console.log(`   ✅ Created: ${dir}/`);
  }
  
  // Clean up old test artifacts if needed
  if (process.env.CLEAN_BEFORE_TEST) {
    console.log('🧹 Cleaning old test artifacts...');
    for (const dir of directories) {
      await fs.emptyDir(dir);
      console.log(`   🗑️  Cleaned: ${dir}/`);
    }
  }
  
  // Check if Yapee server is running
  console.log('🔍 Checking Yapee server availability...');
  const baseURL = config.use?.baseURL || 'http://localhost:5175';
  
  try {
    const { chromium } = await import('playwright');
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    // Try to access the homepage
    await page.goto(baseURL, { timeout: 10000 });
    
    // Check if the page loaded successfully
    const title = await page.title();
    console.log(`   ✅ Server is running: ${baseURL}`);
    console.log(`   📄 Page title: ${title}`);
    
    // Verify essential elements exist
    const hasHeader = await page.locator('header, nav, [role="banner"]').count() > 0;
    const hasMain = await page.locator('main, [role="main"], .main-content').count() > 0;
    
    if (hasHeader && hasMain) {
      console.log('   ✅ Essential page structure detected');
    } else {
      console.warn('   ⚠️  Warning: Basic page structure may be incomplete');
    }
    
    await browser.close();
    
  } catch (error) {
    console.error(`   ❌ Failed to connect to server: ${baseURL}`);
    console.error(`   Error: ${error.message}`);
    console.log('\n📋 Setup Instructions:');
    console.log('   1. Make sure your Yapee development server is running');
    console.log(`   2. Verify the server is accessible at: ${baseURL}`);
    console.log('   3. Check that all dependencies are installed');
    console.log('   4. Ensure no firewall is blocking the connection\n');
    
    // Don't fail setup, just warn
    console.warn('⚠️  Continuing with setup despite server connection issues...');
  }
  
  // Create test data files
  console.log('📝 Creating test data files...');
  
  const testData = {
    users: {
      testUser: {
        name: 'Nguyễn Văn Test',
        email: 'test@yapee.com',
        phone: '+84123456789'
      },
      adminUser: {
        name: 'Admin User',
        email: 'admin@yapee.com',
        phone: '+84987654321'
      }
    },
    products: {
      searchTerms: {
        valid: ['laptop', 'phone', 'headphone', 'camera', 'tablet'],
        invalid: ['xyz123', '!@#$%', 'nonexistent'],
        empty: ''
      },
      categories: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'],
      priceRanges: [
        { min: 0, max: 100 },
        { min: 100, max: 500 },
        { min: 500, max: 1000 },
        { min: 1000, max: 5000 }
      ]
    },
    contact: {
      validForm: {
        name: 'Nguyễn Văn Test',
        email: 'test@yapee.com',
        subject: 'Kiểm tra chức năng liên hệ',
        message: 'Đây là tin nhắn test để kiểm tra form liên hệ hoạt động đúng không. Xin chào từ automation test!'
      },
      invalidForm: {
        name: '',
        email: 'invalid-email',
        subject: '',
        message: ''
      }
    },
    urls: {
      home: '/',
      products: '/products',
      contact: '/contact',
      cart: '/cart',
      about: '/about'
    }
  };
  
  await fs.writeJSON('test-data.json', testData, { spaces: 2 });
  console.log('   ✅ Created: test-data.json');
  
  // Create test configuration
  const testConfig = {
    timeouts: {
      short: 5000,
      medium: 10000,
      long: 30000
    },
    retries: {
      flaky: 3,
      stable: 1
    },
    screenshots: {
      onFailure: true,
      onSuccess: false,
      fullPage: true
    },
    videos: {
      onFailure: true,
      onSuccess: false
    },
    performance: {
      maxLoadTime: 5000,
      maxInteractionTime: 2000
    },
    accessibility: {
      checkContrast: true,
      checkKeyboard: true,
      checkScreenReader: true
    }
  };
  
  await fs.writeJSON('test-config.json', testConfig, { spaces: 2 });
  console.log('   ✅ Created: test-config.json');
  
  // Create test report template
  const reportTemplate = {
    testRun: {
      id: `test-run-${Date.now()}`,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      baseURL: baseURL,
      browser: 'multiple',
      platform: process.platform
    },
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      duration: 0
    },
    tests: [],
    errors: [],
    performance: {},
    screenshots: [],
    videos: []
  };
  
  await fs.writeJSON('test-results/report-template.json', reportTemplate, { spaces: 2 });
  console.log('   ✅ Created: test-results/report-template.json');
  
  // Create environment info file
  const envInfo = {
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    memory: process.memoryUsage(),
    env: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    playwright: {
      version: 'latest' // Will be updated dynamically
    },
    config: {
      baseURL: baseURL,
      timeout: config.timeout,
      retries: config.retries,
      workers: config.workers
    }
  };
  
  await fs.writeJSON('test-results/environment.json', envInfo, { spaces: 2 });
  console.log('   ✅ Created: test-results/environment.json');
  
  // Create README for test artifacts
  const readmeContent = `# Yapee Test Automation Artifacts

This directory contains test artifacts generated during automated testing.

## Directory Structure

- **screenshots/**: Screenshots taken during test execution
- **videos/**: Video recordings of test runs
- **test-results/**: Test results, reports, and metadata
- **playwright-report/**: HTML test reports
- **traces/**: Playwright traces for debugging
- **downloads/**: Files downloaded during tests

## Files

- **test-data.json**: Test data used across all tests
- **test-config.json**: Test configuration settings
- **environment.json**: Environment information
- **report-template.json**: Template for test reports

## Usage

### Running Tests
\`\`\`bash
# Run all tests
npm test

# Run specific test suites
npm run test:contact
npm run test:cart
npm run test:search

# Run in headed mode (visible browser)
npm run test:headed

# Debug mode
npm run test:debug
\`\`\`

### Viewing Reports
\`\`\`bash
# Open HTML report
npm run test:report
\`\`\`

### Cleaning Artifacts
\`\`\`bash
# Clean all test artifacts
npm run clean
\`\`\`

## Generated: ${new Date().toISOString()}
`;
  
  await fs.writeFile('README-test-artifacts.md', readmeContent);
  console.log('   ✅ Created: README-test-artifacts.md');
  
  console.log('\n✅ Test setup completed successfully!');
  console.log('🎯 Ready to run Yapee automation tests');
  console.log('\n📋 Quick Start:');
  console.log('   npx playwright test                    # Run all tests');
  console.log('   npx playwright test --headed           # Run with visible browser');
  console.log('   npx playwright test --debug            # Debug mode');
  console.log('   npx playwright show-report             # View test report\n');
}

export default globalSetup;
