// Global Test Teardown for Yapee Website Automation
// This file runs after all tests to clean up and generate final reports

const fs = require('fs-extra');
const path = require('path');

/**
 * Global teardown function that runs after all tests
 * @param {import('@playwright/test').FullConfig} config
 */
async function globalTeardown(config) {
  console.log('🏁 Starting Yapee Test Automation Teardown...');
  
  try {
    // Generate test summary report
    await generateTestSummary();
    
    // Organize test artifacts
    await organizeArtifacts();
    
    // Clean up temporary files if needed
    await cleanupTemporaryFiles();
    
    // Generate performance report
    await generatePerformanceReport();
    
    // Archive old test runs if needed
    await archiveOldTestRuns();
    
    console.log('✅ Test teardown completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during test teardown:', error.message);
  }
}

/**
 * Generate a comprehensive test summary report
 */
async function generateTestSummary() {
  console.log('📊 Generating test summary report...');
  
  try {
    // Read test results if available
    let testResults = {};
    const resultsPath = 'test-results/results.json';
    
    if (await fs.pathExists(resultsPath)) {
      testResults = await fs.readJSON(resultsPath);
    }
    
    // Count artifacts
    const artifactCounts = {
      screenshots: await countFiles('screenshots', '.png'),
      videos: await countFiles('videos', '.webm'),
      traces: await countFiles('traces', '.zip'),
      reports: await countFiles('playwright-report', '.html')
    };
    
    // Generate summary
    const summary = {
      testRun: {
        id: `test-run-${Date.now()}`,
        timestamp: new Date().toISOString(),
        duration: Date.now() - (testResults.startTime || Date.now()),
        environment: process.env.NODE_ENV || 'development'
      },
      results: {
        total: testResults.stats?.total || 0,
        passed: testResults.stats?.passed || 0,
        failed: testResults.stats?.failed || 0,
        skipped: testResults.stats?.skipped || 0,
        flaky: testResults.stats?.flaky || 0
      },
      artifacts: artifactCounts,
      performance: {
        avgTestDuration: calculateAverageTestDuration(testResults),
        slowestTest: findSlowestTest(testResults),
        fastestTest: findFastestTest(testResults)
      },
      coverage: {
        pagesVisited: extractPagesVisited(testResults),
        featuresTestedCount: extractFeaturesCovered(testResults)
      },
      issues: {
        failures: extractFailures(testResults),
        warnings: extractWarnings(testResults)
      }
    };
    
    // Save summary
    await fs.writeJSON('test-results/test-summary.json', summary, { spaces: 2 });
    console.log('   ✅ Created: test-results/test-summary.json');
    
    // Generate human-readable summary
    const readableSummary = generateReadableSummary(summary);
    await fs.writeFile('test-results/test-summary.md', readableSummary);
    console.log('   ✅ Created: test-results/test-summary.md');
    
  } catch (error) {
    console.error('   ❌ Failed to generate test summary:', error.message);
  }
}

/**
 * Organize test artifacts into structured directories
 */
async function organizeArtifacts() {
  console.log('📁 Organizing test artifacts...');
  
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const runDir = `test-results/runs/run-${timestamp}`;
    
    // Create run directory
    await fs.ensureDir(runDir);
    
    // Move artifacts to run directory
    const artifactDirs = ['screenshots', 'videos', 'traces'];
    
    for (const dir of artifactDirs) {
      if (await fs.pathExists(dir)) {
        const files = await fs.readdir(dir);
        if (files.length > 0) {
          await fs.ensureDir(`${runDir}/${dir}`);
          
          for (const file of files) {
            const srcPath = path.join(dir, file);
            const destPath = path.join(runDir, dir, file);
            await fs.copy(srcPath, destPath);
          }
          
          console.log(`   📦 Archived ${files.length} files from ${dir}/`);
        }
      }
    }
    
    // Copy reports
    if (await fs.pathExists('playwright-report')) {
      await fs.copy('playwright-report', `${runDir}/report`);
      console.log('   📦 Archived HTML report');
    }
    
    console.log(`   ✅ Artifacts organized in: ${runDir}`);
    
  } catch (error) {
    console.error('   ❌ Failed to organize artifacts:', error.message);
  }
}

/**
 * Clean up temporary files and empty directories
 */
async function cleanupTemporaryFiles() {
  console.log('🧹 Cleaning up temporary files...');
  
  try {
    const tempPatterns = [
      'test-results/*.tmp',
      'test-results/*.temp',
      'screenshots/.DS_Store',
      'videos/.DS_Store',
      'traces/.DS_Store'
    ];
    
    let cleanedCount = 0;
    
    for (const pattern of tempPatterns) {
      try {
        const files = await fs.glob(pattern);
        for (const file of files) {
          await fs.remove(file);
          cleanedCount++;
        }
      } catch (error) {
        // Ignore glob errors
      }
    }
    
    // Remove empty directories
    const dirs = ['screenshots', 'videos', 'traces'];
    for (const dir of dirs) {
      if (await fs.pathExists(dir)) {
        const files = await fs.readdir(dir);
        if (files.length === 0) {
          // Keep directories but add .gitkeep
          await fs.writeFile(path.join(dir, '.gitkeep'), '');
        }
      }
    }
    
    if (cleanedCount > 0) {
      console.log(`   ✅ Cleaned ${cleanedCount} temporary files`);
    } else {
      console.log('   ✅ No temporary files to clean');
    }
    
  } catch (error) {
    console.error('   ❌ Failed to cleanup temporary files:', error.message);
  }
}

/**
 * Generate performance analysis report
 */
async function generatePerformanceReport() {
  console.log('⚡ Generating performance report...');
  
  try {
    // Read test results for performance data
    const resultsPath = 'test-results/results.json';
    let performanceData = {
      loadTimes: [],
      testDurations: [],
      memoryUsage: process.memoryUsage(),
      timestamp: new Date().toISOString()
    };
    
    if (await fs.pathExists(resultsPath)) {
      const results = await fs.readJSON(resultsPath);
      
      // Extract performance metrics from test results
      if (results.suites) {
        results.suites.forEach(suite => {
          if (suite.specs) {
            suite.specs.forEach(spec => {
              if (spec.tests) {
                spec.tests.forEach(test => {
                  if (test.results) {
                    test.results.forEach(result => {
                      if (result.duration) {
                        performanceData.testDurations.push({
                          test: test.title,
                          duration: result.duration,
                          status: result.status
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    }
    
    // Calculate performance metrics
    const metrics = {
      averageTestDuration: calculateAverage(performanceData.testDurations.map(t => t.duration)),
      slowestTests: performanceData.testDurations
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 5),
      fastestTests: performanceData.testDurations
        .sort((a, b) => a.duration - b.duration)
        .slice(0, 5),
      totalDuration: performanceData.testDurations.reduce((sum, t) => sum + t.duration, 0),
      memoryUsage: performanceData.memoryUsage
    };
    
    await fs.writeJSON('test-results/performance-report.json', {
      ...performanceData,
      metrics
    }, { spaces: 2 });
    
    console.log('   ✅ Created: test-results/performance-report.json');
    
  } catch (error) {
    console.error('   ❌ Failed to generate performance report:', error.message);
  }
}

/**
 * Archive old test runs to prevent disk space issues
 */
async function archiveOldTestRuns() {
  console.log('📦 Archiving old test runs...');
  
  try {
    const runsDir = 'test-results/runs';
    
    if (await fs.pathExists(runsDir)) {
      const runs = await fs.readdir(runsDir);
      const maxRuns = 10; // Keep last 10 runs
      
      if (runs.length > maxRuns) {
        // Sort by creation time (oldest first)
        const runStats = await Promise.all(
          runs.map(async (run) => {
            const stat = await fs.stat(path.join(runsDir, run));
            return { name: run, ctime: stat.ctime };
          })
        );
        
        runStats.sort((a, b) => a.ctime - b.ctime);
        
        // Remove oldest runs
        const runsToRemove = runStats.slice(0, runs.length - maxRuns);
        
        for (const run of runsToRemove) {
          await fs.remove(path.join(runsDir, run.name));
        }
        
        console.log(`   ✅ Archived ${runsToRemove.length} old test runs`);
      } else {
        console.log('   ✅ No old test runs to archive');
      }
    }
    
  } catch (error) {
    console.error('   ❌ Failed to archive old test runs:', error.message);
  }
}

// Helper functions

async function countFiles(directory, extension) {
  try {
    if (!(await fs.pathExists(directory))) return 0;
    
    const files = await fs.readdir(directory);
    return files.filter(file => file.endsWith(extension)).length;
  } catch {
    return 0;
  }
}

function calculateAverageTestDuration(results) {
  if (!results.suites) return 0;
  
  const durations = [];
  results.suites.forEach(suite => {
    if (suite.specs) {
      suite.specs.forEach(spec => {
        if (spec.tests) {
          spec.tests.forEach(test => {
            if (test.results) {
              test.results.forEach(result => {
                if (result.duration) durations.push(result.duration);
              });
            }
          });
        }
      });
    }
  });
  
  return durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;
}

function findSlowestTest(results) {
  let slowest = { title: 'N/A', duration: 0 };
  
  if (!results.suites) return slowest;
  
  results.suites.forEach(suite => {
    if (suite.specs) {
      suite.specs.forEach(spec => {
        if (spec.tests) {
          spec.tests.forEach(test => {
            if (test.results) {
              test.results.forEach(result => {
                if (result.duration && result.duration > slowest.duration) {
                  slowest = { title: test.title, duration: result.duration };
                }
              });
            }
          });
        }
      });
    }
  });
  
  return slowest;
}

function findFastestTest(results) {
  let fastest = { title: 'N/A', duration: Infinity };
  
  if (!results.suites) return { title: 'N/A', duration: 0 };
  
  results.suites.forEach(suite => {
    if (suite.specs) {
      suite.specs.forEach(spec => {
        if (spec.tests) {
          spec.tests.forEach(test => {
            if (test.results) {
              test.results.forEach(result => {
                if (result.duration && result.duration < fastest.duration) {
                  fastest = { title: test.title, duration: result.duration };
                }
              });
            }
          });
        }
      });
    }
  });
  
  return fastest.duration === Infinity ? { title: 'N/A', duration: 0 } : fastest;
}

function extractPagesVisited(results) {
  // Extract unique pages visited during tests
  const pages = new Set();
  // This would need to be implemented based on actual test structure
  return Array.from(pages);
}

function extractFeaturesCovered(results) {
  // Extract features that were tested
  const features = new Set();
  
  if (results.suites) {
    results.suites.forEach(suite => {
      if (suite.title) {
        features.add(suite.title);
      }
    });
  }
  
  return Array.from(features);
}

function extractFailures(results) {
  const failures = [];
  
  if (!results.suites) return failures;
  
  results.suites.forEach(suite => {
    if (suite.specs) {
      suite.specs.forEach(spec => {
        if (spec.tests) {
          spec.tests.forEach(test => {
            if (test.results) {
              test.results.forEach(result => {
                if (result.status === 'failed') {
                  failures.push({
                    test: test.title,
                    error: result.error?.message || 'Unknown error',
                    duration: result.duration
                  });
                }
              });
            }
          });
        }
      });
    }
  });
  
  return failures;
}

function extractWarnings(results) {
  // Extract warnings from test results
  return [];
}

function calculateAverage(numbers) {
  if (numbers.length === 0) return 0;
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}

function generateReadableSummary(summary) {
  return `# Yapee Test Automation Summary

## Test Run Information
- **Run ID**: ${summary.testRun.id}
- **Timestamp**: ${summary.testRun.timestamp}
- **Environment**: ${summary.testRun.environment}
- **Duration**: ${Math.round(summary.testRun.duration / 1000)}s

## Test Results
- **Total Tests**: ${summary.results.total}
- **Passed**: ${summary.results.passed} ✅
- **Failed**: ${summary.results.failed} ❌
- **Skipped**: ${summary.results.skipped} ⏭️
- **Flaky**: ${summary.results.flaky} 🔄

## Artifacts Generated
- **Screenshots**: ${summary.artifacts.screenshots}
- **Videos**: ${summary.artifacts.videos}
- **Traces**: ${summary.artifacts.traces}
- **Reports**: ${summary.artifacts.reports}

## Performance Metrics
- **Average Test Duration**: ${Math.round(summary.performance.avgTestDuration)}ms
- **Slowest Test**: ${summary.performance.slowestTest.title} (${Math.round(summary.performance.slowestTest.duration)}ms)
- **Fastest Test**: ${summary.performance.fastestTest.title} (${Math.round(summary.performance.fastestTest.duration)}ms)

## Coverage
- **Pages Visited**: ${summary.coverage.pagesVisited.length}
- **Features Tested**: ${summary.coverage.featuresTestedCount.length}

## Issues
- **Failures**: ${summary.issues.failures.length}
- **Warnings**: ${summary.issues.warnings.length}

---
*Generated by Yapee Test Automation Suite*
`;
}

module.exports = globalTeardown;