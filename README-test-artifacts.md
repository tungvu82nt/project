# Yapee Test Automation Artifacts

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
```bash
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
```

### Viewing Reports
```bash
# Open HTML report
npm run test:report
```

### Cleaning Artifacts
```bash
# Clean all test artifacts
npm run clean
```

## Generated: 2025-07-12T11:12:05.529Z
