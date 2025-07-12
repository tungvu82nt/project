#!/usr/bin/env node

// Main Test Runner for Yapee Website Automation
// This script provides a unified interface to run all test automation

import { spawn, exec } from 'child_process';
import http from 'http';
import fs from 'fs-extra';
import path from 'path';
import readline from 'readline';

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Test configuration
const testConfig = {
  baseUrl: process.env.BASE_URL || 'http://localhost:5175',
  headless: process.env.HEADLESS !== 'false',
  slowMo: parseInt(process.env.SLOW_MO) || 0,
  timeout: parseInt(process.env.TIMEOUT) || 30000,
  retries: parseInt(process.env.RETRIES) || 2,
  workers: parseInt(process.env.WORKERS) || 4
};

// Available test suites
const testSuites = {
  basic: {
    name: 'Basic Test Suite',
    description: 'Chạy các test cơ bản với script tự viết',
    command: 'node test-automation-scripts.js',
    file: 'test-automation-scripts.js'
  },
  advanced: {
    name: 'Advanced Test Suite',
    description: 'Chạy test suite nâng cao với nhiều tính năng',
    command: 'node advanced-test-automation.js',
    file: 'advanced-test-automation.js'
  },
  playwright: {
    name: 'Playwright Test Suite',
    description: 'Chạy tests với Playwright framework',
    command: 'npx playwright test',
    file: 'playwright.config.js'
  },
  contact: {
    name: 'Contact Form Tests',
    description: 'Kiểm thử chuyên sâu form liên hệ',
    command: 'npx playwright test --grep "Contact Form"',
    file: null
  },
  cart: {
    name: 'Add to Cart Tests',
    description: 'Kiểm thử chức năng thêm vào giỏ hàng',
    command: 'npx playwright test --grep "Add to Cart"',
    file: null
  },
  search: {
    name: 'Search Functionality Tests',
    description: 'Kiểm thử chức năng tìm kiếm',
    command: 'npx playwright test --grep "Search"',
    file: null
  },
  mobile: {
    name: 'Mobile Tests',
    description: 'Kiểm thử trên thiết bị di động',
    command: 'npx playwright test --project="Mobile Chrome"',
    file: null
  },
  all: {
    name: 'All Tests',
    description: 'Chạy tất cả test suites',
    command: 'all',
    file: null
  }
};

// Browser options
const browsers = {
  chromium: 'Chromium',
  firefox: 'Firefox',
  webkit: 'Safari/WebKit',
  chrome: 'Google Chrome',
  edge: 'Microsoft Edge'
};

class TestRunner {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    this.startTime = Date.now();
    this.results = {
      passed: 0,
      failed: 0,
      skipped: 0,
      total: 0
    };
  }

  // Print colored output
  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  // Print banner
  printBanner() {
    this.log('\n' + '='.repeat(60), 'cyan');
    this.log('🚀 YAPEE WEBSITE TEST AUTOMATION SUITE 🚀', 'bright');
    this.log('='.repeat(60), 'cyan');
    this.log(`📍 Base URL: ${testConfig.baseUrl}`, 'blue');
    this.log(`⚙️  Headless: ${testConfig.headless}`, 'blue');
    this.log(`⏱️  Timeout: ${testConfig.timeout}ms`, 'blue');
    this.log(`🔄 Retries: ${testConfig.retries}`, 'blue');
    this.log('='.repeat(60), 'cyan');
  }

  // Show available test suites
  showTestSuites() {
    this.log('\n📋 Available Test Suites:', 'bright');
    this.log('-'.repeat(50), 'cyan');
    
    Object.entries(testSuites).forEach(([key, suite], index) => {
      this.log(`${index + 1}. ${suite.name}`, 'green');
      this.log(`   ${suite.description}`, 'yellow');
      if (suite.file) {
        const exists = fs.existsSync(suite.file);
        this.log(`   📄 File: ${suite.file} ${exists ? '✅' : '❌'}`, exists ? 'green' : 'red');
      }
      this.log('');
    });
  }

  // Show browser options
  showBrowserOptions() {
    this.log('\n🌐 Available Browsers:', 'bright');
    this.log('-'.repeat(30), 'cyan');
    
    Object.entries(browsers).forEach(([key, name], index) => {
      this.log(`${index + 1}. ${name} (${key})`, 'green');
    });
    this.log('');
  }

  // Prompt user for input
  async prompt(question) {
    return new Promise((resolve) => {
      this.rl.question(question, resolve);
    });
  }

  // Check if server is running
  async checkServer() {
    this.log('\n🔍 Checking if Yapee server is running...', 'yellow');
    
    return new Promise((resolve) => {
      let resolved = false;
      const url = new URL(testConfig.baseUrl);
      
      const req = http.request({
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: '/',
        method: 'GET',
        timeout: 5000
      }, (res) => {
        if (!resolved) {
          resolved = true;
          this.log('✅ Server is running!', 'green');
          resolve(true);
        }
      });
      
      req.on('error', (error) => {
        if (!resolved) {
          resolved = true;
          this.log('❌ Server is not running!', 'red');
          this.log(`   Please start the server at ${testConfig.baseUrl}`, 'yellow');
          this.log(`   Error: ${error.message}`, 'red');
          resolve(false);
        }
      });
      
      req.on('timeout', () => {
        if (!resolved) {
          resolved = true;
          this.log('⏰ Server check timeout!', 'red');
          resolve(false);
        }
      });
      
      req.end();
    });
  }

  // Setup test environment
  async setupEnvironment() {
    this.log('\n🔧 Setting up test environment...', 'yellow');
    
    try {
      // Run setup script if exists
      if (fs.existsSync('test-setup.js')) {
        await this.runCommand('node test-setup.js', 'Setup');
      }
      
      // Ensure directories exist
      const dirs = ['test-results', 'screenshots', 'videos', 'traces'];
      for (const dir of dirs) {
        await fs.ensureDir(dir);
      }
      
      this.log('✅ Environment setup complete!', 'green');
      return true;
    } catch (error) {
      this.log(`❌ Environment setup failed: ${error.message}`, 'red');
      return false;
    }
  }

  // Run a command
  async runCommand(command, name = 'Command') {
    this.log(`\n🏃 Running ${name}...`, 'yellow');
    this.log(`📝 Command: ${command}`, 'blue');
    
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      const child = spawn(command, {
        shell: true,
        stdio: 'inherit',
        env: { ...process.env, ...testConfig }
      });
      
      child.on('close', (code) => {
        const duration = Date.now() - startTime;
        
        if (code === 0) {
          this.log(`✅ ${name} completed successfully! (${duration}ms)`, 'green');
          resolve({ success: true, code, duration });
        } else {
          this.log(`❌ ${name} failed with code ${code} (${duration}ms)`, 'red');
          resolve({ success: false, code, duration });
        }
      });
      
      child.on('error', (error) => {
        this.log(`❌ ${name} error: ${error.message}`, 'red');
        reject(error);
      });
    });
  }

  // Run specific test suite
  async runTestSuite(suiteKey) {
    const suite = testSuites[suiteKey];
    if (!suite) {
      this.log(`❌ Test suite '${suiteKey}' not found!`, 'red');
      return false;
    }

    this.log(`\n🎯 Running: ${suite.name}`, 'bright');
    this.log(`📝 Description: ${suite.description}`, 'yellow');
    
    // Check if required file exists
    if (suite.file && !fs.existsSync(suite.file)) {
      this.log(`❌ Required file not found: ${suite.file}`, 'red');
      return false;
    }

    if (suite.command === 'all') {
      return await this.runAllTests();
    }

    const result = await this.runCommand(suite.command, suite.name);
    return result.success;
  }

  // Run all test suites
  async runAllTests() {
    this.log('\n🎯 Running All Test Suites...', 'bright');
    
    const suitesToRun = ['basic', 'advanced', 'playwright'];
    const results = [];
    
    for (const suiteKey of suitesToRun) {
      const suite = testSuites[suiteKey];
      
      if (suite.file && !fs.existsSync(suite.file)) {
        this.log(`⏭️  Skipping ${suite.name} - file not found`, 'yellow');
        continue;
      }
      
      const result = await this.runCommand(suite.command, suite.name);
      results.push({ suite: suite.name, ...result });
    }
    
    // Print summary
    this.log('\n📊 All Tests Summary:', 'bright');
    this.log('-'.repeat(40), 'cyan');
    
    results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      const duration = `${result.duration}ms`;
      this.log(`${status} ${result.suite} (${duration})`, result.success ? 'green' : 'red');
    });
    
    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;
    
    this.log(`\n🎯 Overall: ${successCount}/${totalCount} test suites passed`, 
             successCount === totalCount ? 'green' : 'red');
    
    return successCount === totalCount;
  }

  // Generate final report
  async generateReport() {
    this.log('\n📊 Generating final report...', 'yellow');
    
    try {
      const totalDuration = Date.now() - this.startTime;
      
      const report = {
        timestamp: new Date().toISOString(),
        duration: totalDuration,
        config: testConfig,
        results: this.results,
        environment: {
          node: process.version,
          platform: process.platform,
          arch: process.arch
        }
      };
      
      await fs.writeJSON('test-results/run-report.json', report, { spaces: 2 });
      
      this.log('✅ Report generated: test-results/run-report.json', 'green');
      
      // Run teardown if exists
      if (fs.existsSync('test-teardown.js')) {
        await this.runCommand('node test-teardown.js', 'Teardown');
      }
      
    } catch (error) {
      this.log(`❌ Report generation failed: ${error.message}`, 'red');
    }
  }

  // Interactive mode
  async runInteractive() {
    this.printBanner();
    
    // Check server
    const serverRunning = await this.checkServer();
    if (!serverRunning) {
      const continueAnyway = await this.prompt('Continue anyway? (y/N): ');
      if (continueAnyway.toLowerCase() !== 'y') {
        this.log('\n👋 Exiting...', 'yellow');
        this.rl.close();
        return;
      }
    }
    
    // Setup environment
    const setupSuccess = await this.setupEnvironment();
    if (!setupSuccess) {
      this.log('\n❌ Cannot continue without proper setup', 'red');
      this.rl.close();
      return;
    }
    
    // Show options and get user choice
    this.showTestSuites();
    
    const choice = await this.prompt('Select test suite (1-9) or enter suite key: ');
    
    let suiteKey;
    if (/^\d+$/.test(choice)) {
      const index = parseInt(choice) - 1;
      const keys = Object.keys(testSuites);
      suiteKey = keys[index];
    } else {
      suiteKey = choice.toLowerCase();
    }
    
    if (!testSuites[suiteKey]) {
      this.log('❌ Invalid choice!', 'red');
      this.rl.close();
      return;
    }
    
    // Run selected test suite
    const success = await this.runTestSuite(suiteKey);
    
    // Generate report
    await this.generateReport();
    
    // Final message
    const totalDuration = Date.now() - this.startTime;
    this.log(`\n🏁 Test run completed in ${totalDuration}ms`, 'bright');
    this.log(success ? '✅ All tests passed!' : '❌ Some tests failed!', success ? 'green' : 'red');
    
    this.rl.close();
  }

  // Command line mode
  async runCommandLine() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
      return this.runInteractive();
    }
    
    const command = args[0];
    
    switch (command) {
      case 'list':
        this.printBanner();
        this.showTestSuites();
        break;
        
      case 'setup':
        await this.setupEnvironment();
        break;
        
      case 'check':
        await this.checkServer();
        break;
        
      default:
        if (testSuites[command]) {
          this.printBanner();
          await this.setupEnvironment();
          const success = await this.runTestSuite(command);
          await this.generateReport();
          process.exit(success ? 0 : 1);
        } else {
          this.log(`❌ Unknown command: ${command}`, 'red');
          this.log('Available commands: list, setup, check, or any test suite key', 'yellow');
          process.exit(1);
        }
    }
    
    this.rl.close();
  }
}

// Main execution - always run when this file is executed directly
const runner = new TestRunner();

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  runner.log('\n\n👋 Test run interrupted by user', 'yellow');
  runner.rl.close();
  process.exit(0);
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  runner.log(`\n❌ Uncaught error: ${error.message}`, 'red');
  runner.rl.close();
  process.exit(1);
});

runner.runCommandLine().catch((error) => {
  runner.log(`\n❌ Fatal error: ${error.message}`, 'red');
  process.exit(1);
});

export default TestRunner;