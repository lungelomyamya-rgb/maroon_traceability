// src/core/testing/AdapterTestFramework.ts
// Comprehensive testing framework for adapters

import { BaseAdapter } from '../adapters';

/**
 * Test result interface
 */
export interface TestResult {
  testName: string;
  passed: boolean;
  duration: number;
  error?: string;
  warnings?: string[];
  metrics?: PerformanceMetrics;
}

/**
 * Test case interface
 */
export interface AdapterTestCase {
  /** Test case name */
  name: string;
  /** Test description */
  description: string;
  /** Test function */
  test: (adapter: BaseAdapter<unknown, unknown>) => Promise<TestResult>;
  /** Expected result */
  expected?: unknown;
  /** Test timeout in milliseconds */
  timeout?: number;
  /** Whether to skip this test */
  skip?: boolean;
  /** Test category */
  category?: 'unit' | 'integration' | 'performance' | 'security';
}

/**
 * Test suite interface
 */
export interface TestSuite {
  /** Suite name */
  name: string;
  /** Suite description */
  description: string;
  /** Test cases */
  testCases: AdapterTestCase[];
  /** Setup function */
  setup?: () => Promise<void>;
  /** Teardown function */
  teardown?: () => Promise<void>;
  /** Suite timeout in milliseconds */
  timeout?: number;
}

/**
 * Test runner configuration
 */
export interface TestRunnerConfig {
  /** Default test timeout */
  defaultTimeout: number;
  /** Whether to run tests in parallel */
  parallel: boolean;
  /** Maximum parallel tests */
  maxParallelTests: number;
  /** Whether to continue on failure */
  continueOnFailure: boolean;
  /** Test categories to include */
  includeCategories?: string[];
  /** Test categories to exclude */
  excludeCategories?: string[];
}

/**
 * Performance test metrics
 */
export interface PerformanceMetrics {
  /** Average response time */
  avgResponseTime: number;
  /** Minimum response time */
  minResponseTime: number;
  /** Maximum response time */
  maxResponseTime: number;
  /** 95th percentile response time */
  p95ResponseTime: number;
  /** Total operations */
  totalOperations: number;
  /** Operations per second */
  opsPerSecond: number;
  /** Memory usage in bytes */
  memoryUsage?: number;
}

/**
 * Adapter test framework
 */
export class AdapterTestFramework {
  private static instance: AdapterTestFramework;
  private testSuites = new Map<string, TestSuite>();
  private config: TestRunnerConfig = {
    defaultTimeout: 5000,
    parallel: true,
    maxParallelTests: 5,
    continueOnFailure: true,
  };

  private constructor() {
    // Intentionally empty - singleton pattern
  }

  static getInstance(): AdapterTestFramework {
    if (!AdapterTestFramework.instance) {
      AdapterTestFramework.instance = new AdapterTestFramework();
    }
    return AdapterTestFramework.instance;
  }

  /**
   * Register a test suite
   */
  registerTestSuite(suite: TestSuite): void {
    this.testSuites.set(suite.name, suite);
  }

  /**
   * Get all registered test suites
   */
  getTestSuites(): TestSuite[] {
    return Array.from(this.testSuites.values());
  }

  /**
   * Get a specific test suite
   */
  getTestSuite(name: string): TestSuite | undefined {
    return this.testSuites.get(name);
  }

  /**
   * Run all test suites
   */
  async runAllTests(adapter: BaseAdapter<unknown, unknown>): Promise<TestSuiteResult[]> {
    const suites = Array.from(this.testSuites.values());
    const results: TestSuiteResult[] = [];

    if (this.config.parallel) {
      // Run suites in parallel
      const suitePromises = suites.map(suite => this.runTestSuite(suite, adapter));
      const suiteResults = await Promise.all(suitePromises);
      results.push(...suiteResults);
    } else {
      // Run suites sequentially
      for (const suite of suites) {
        const result = await this.runTestSuite(suite, adapter);
        results.push(result);

        if (!result.passed && !this.config.continueOnFailure) {
          break;
        }
      }
    }

    return results;
  }

  /**
   * Run a specific test suite
   */
  async runTestSuite(suite: TestSuite, adapter: BaseAdapter<unknown, unknown>): Promise<TestSuiteResult> {
    const startTime = Date.now();
    const results: TestResult[] = [];

    try {
      // Run setup
      if (suite.setup) {
        await suite.setup();
      }

      // Filter test cases based on configuration
      const filteredTestCases = suite.testCases.filter(testCase => {
        if (testCase.skip) {
          return false;
        }
        if (this.config.includeCategories && !this.config.includeCategories.includes(testCase.category || 'unit')) {
          return false;
        }
        if (this.config.excludeCategories && this.config.excludeCategories.includes(testCase.category || 'unit')) {
          return false;
        }
        return true;
      });

      // Run test cases
      if (this.config.parallel) {
        // Run tests in parallel (with limit)
        const chunks = this.chunkArray(filteredTestCases, this.config.maxParallelTests);
        for (const chunk of chunks) {
          const chunkPromises = chunk.map(testCase => this.runTestCase(testCase, adapter));
          const chunkResults = await Promise.all(chunkPromises);
          results.push(...chunkResults);
        }
      } else {
        // Run tests sequentially
        for (const testCase of filteredTestCases) {
          const result = await this.runTestCase(testCase, adapter);
          results.push(result);

          if (!result.passed && !this.config.continueOnFailure) {
            break;
          }
        }
      }

    } catch (error: unknown) {
      results.push({
        testName: 'Suite Error',
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : String(error),
        warnings: [],
      });
    } finally {
      // Run teardown
      if (suite.teardown) {
        try {
          await suite.teardown();
        } catch (error: unknown) {
          console.error('Teardown failed:', error instanceof Error ? error.message : String(error));
        }
      }
    }

    const suiteResult: TestSuiteResult = {
      suiteName: suite.name,
      description: suite.description,
      duration: Date.now() - startTime,
      passed: results.every(r => r.passed),
      totalTests: results.length,
      passedTests: results.filter(r => r.passed).length,
      failedTests: results.filter(r => !r.passed).length,
      results,
    };

    return suiteResult;
  }

  /**
   * Run a single test case
   */
  async runTestCase(testCase: AdapterTestCase, adapter: BaseAdapter<unknown, unknown>): Promise<TestResult> {
    const startTime = Date.now();
    const timeout = testCase.timeout || this.config.defaultTimeout;

    try {
      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`Test timeout after ${timeout}ms`)), timeout);
      });

      // Run the test
      const testPromise = testCase.test(adapter);

      // Race between test and timeout
      const _result = await Promise.race([testPromise, timeoutPromise]);

      return {
        testName: testCase.name,
        passed: true,
        duration: Date.now() - startTime,
        warnings: [],
      };

    } catch (error: unknown) {
      const result: TestResult = {
        testName: testCase.name,
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Test execution failed',
        warnings: [],
      };

      return result;
    }
  }

  /**
   * Run performance tests
   */
  async runPerformanceTests(
    adapter: BaseAdapter<unknown, unknown>,
    operation: (adapter: BaseAdapter<unknown, unknown>) => Promise<unknown>,
    iterations: number = 100,
  ): Promise<PerformanceMetrics> {
    const responseTimes: number[] = [];
    const startMemory = this.getMemoryUsage();

    for (let i = 0; i < iterations; i++) {
      const startTime = Date.now();
      try {
        await operation(adapter);
        const endTime = Date.now();
        responseTimes.push(endTime - startTime);
      } catch (_error) {
        // Skip failed iterations
        continue;
      }
    }

    const endMemory = this.getMemoryUsage();
    const sortedTimes = responseTimes.sort((a, b) => a - b);

    const metrics: PerformanceMetrics = {
      avgResponseTime: responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length,
      minResponseTime: Math.min(...responseTimes),
      maxResponseTime: Math.max(...responseTimes),
      p95ResponseTime: sortedTimes[Math.floor(sortedTimes.length * 0.95)],
      totalOperations: responseTimes.length,
      opsPerSecond: responseTimes.length / ((Date.now() - startMemory) / 1000),
      memoryUsage: endMemory - startMemory,
    };

    return metrics;
  }

  /**
   * Get memory usage (approximate)
   */
  private getMemoryUsage(): number {
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      const perfMemory = performance as Performance & {
        memory: {
          usedJSHeapSize: number;
        };
      };
      return perfMemory.memory.usedJSHeapSize;
    }
    return 0;
  }

  /**
   * Chunk array into smaller arrays
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Update test runner configuration
   */
  updateConfig(config: Partial<TestRunnerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): TestRunnerConfig {
    return { ...this.config };
  }

  /**
   * Generate test report
   */
  generateReport(results: TestSuiteResult[]): TestReport {
    const totalSuites = results.length;
    const passedSuites = results.filter(r => r.passed).length;
    const totalTests = results.reduce((sum, r) => sum + r.totalTests, 0);
    const passedTests = results.reduce((sum, r) => sum + r.passedTests, 0);
    const failedTests = results.reduce((sum, r) => sum + r.failedTests, 0);
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

    const report: TestReport = {
      summary: {
        totalSuites,
        passedSuites,
        failedSuites: totalSuites - passedSuites,
        totalTests,
        passedTests,
        failedTests,
        totalDuration,
        successRate: (passedTests / totalTests) * 100,
      },
      suites: results,
      generatedAt: new Date().toISOString(),
    };

    return report;
  }
}

/**
 * Test suite result interface
 */
export interface TestSuiteResult {
  /** Suite name */
  suiteName: string;
  /** Suite description */
  description: string;
  /** Total execution time */
  duration: number;
  /** Whether all tests passed */
  passed: boolean;
  /** Total number of tests */
  totalTests: number;
  /** Number of passed tests */
  passedTests: number;
  /** Number of failed tests */
  failedTests: number;
  /** Individual test results */
  results: TestResult[];
}

/**
 * Test report interface
 */
export interface TestReport {
  /** Test summary */
  summary: {
    totalSuites: number;
    passedSuites: number;
    failedSuites: number;
    totalTests: number;
    passedTests: number;
    failedTests: number;
    totalDuration: number;
    successRate: number;
  };
  /** Suite results */
  suites: TestSuiteResult[];
  /** Report generation timestamp */
  generatedAt: string;
}

// Export singleton instance
export const adapterTestFramework = AdapterTestFramework.getInstance();
