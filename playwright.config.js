// Playwright Configuration for Yapee Website Testing
// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 4,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['line']
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:5175',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Record video on failure */
    video: 'retain-on-failure',
    
    /* Action timeout */
    actionTimeout: 10000,
    
    /* Navigation timeout */
    navigationTimeout: 30000,
    
    /* Global timeout for each test */
    timeout: 60000,
    
    /* Expect timeout */
    expect: {
      timeout: 5000
    },
    
    /* Ignore HTTPS errors */
    ignoreHTTPSErrors: true,
    
    /* Viewport size */
    viewport: { width: 1280, height: 720 },
    
    /* User agent */
    userAgent: 'Yapee-Test-Automation/1.0.0 (Playwright)'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    /* Test against branded browsers. */
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'echo "Please ensure your Yapee development server is running on http://localhost:5175"',
    url: 'http://localhost:5175',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
  
  /* Global setup and teardown */
  globalSetup: require.resolve('./test-setup.js'),
  globalTeardown: require.resolve('./test-teardown.js'),
  
  /* Test output directories */
  outputDir: 'test-results/',
  
  /* Maximum time one test can run for. */
  timeout: 60 * 1000,
  
  /* Maximum time expect() should wait for the condition to be met. */
  expect: {
    timeout: 5 * 1000,
  },
  
  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  testDir: './',
  
  /* Glob patterns or regular expressions that match test files. */
  testMatch: [
    '**/advanced-test-automation.js',
    '**/test-*.js',
    '**/*.test.js',
    '**/*.spec.js'
  ],
  
  /* Glob patterns or regular expressions to ignore test files. */
  testIgnore: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**'
  ],
  
  /* Whether to preserve output between test runs */
  preserveOutput: 'failures-only',
  
  /* Update snapshots */
  updateSnapshots: 'missing',
  
  /* Metadata */
  metadata: {
    'test-suite': 'Yapee Website Automation',
    'version': '1.0.0',
    'environment': process.env.NODE_ENV || 'development',
    'created': new Date().toISOString()
  }
});

// Environment-specific configurations
if (process.env.NODE_ENV === 'production') {
  module.exports.use.baseURL = 'https://yapee.com';
  module.exports.retries = 3;
  module.exports.workers = 2;
}

if (process.env.NODE_ENV === 'staging') {
  module.exports.use.baseURL = 'https://staging.yapee.com';
  module.exports.retries = 2;
}

// Debug mode configuration
if (process.env.DEBUG) {
  module.exports.use.headless = false;
  module.exports.use.slowMo = 1000;
  module.exports.workers = 1;
  module.exports.retries = 0;
}

// CI/CD specific configurations
if (process.env.CI) {
  module.exports.use.video = 'on';
  module.exports.use.screenshot = 'on';
  module.exports.reporter.push(['github']);
}

console.log('🎭 Playwright Configuration Loaded');
console.log(`📍 Base URL: ${module.exports.use.baseURL}`);
console.log(`🔄 Retries: ${module.exports.retries}`);
console.log(`👥 Workers: ${module.exports.workers}`);
console.log(`🎯 Test Directory: ${module.exports.testDir}`);
console.log(`📊 Projects: ${module.exports.projects.map(p => p.name).join(', ')}`);