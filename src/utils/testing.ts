// Testing utilities and helpers
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';

// Mock data generators
export const generateMockProduct = (overrides = {}) => ({
  id: Math.random().toString(36).substr(2, 9),
  name: 'Test Product',
  price: 99.99,
  originalPrice: 129.99,
  description: 'Test product description',
  category: 'Electronics',
  images: ['https://via.placeholder.com/400'],
  colors: ['Black', 'White'],
  sizes: ['One Size'],
  rating: 4.5,
  reviews: 123,
  inStock: true,
  features: ['Feature 1', 'Feature 2'],
  specifications: { 'Spec 1': 'Value 1' },
  ...overrides
});

export const generateMockUser = (overrides = {}) => ({
  id: Math.random().toString(36).substr(2, 9),
  name: 'Test User',
  email: 'test@example.com',
  role: 'customer' as const,
  ...overrides
});

export const generateMockOrder = (overrides = {}) => ({
  id: `ORD-${Math.random().toString(36).substr(2, 9)}`,
  customerName: 'Test Customer',
  customerEmail: 'customer@example.com',
  items: [],
  total: 199.99,
  status: 'pending' as const,
  createdAt: new Date().toISOString(),
  shippingAddress: '123 Test St, Test City, TC 12345',
  ...overrides
});

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
  user?: any;
}

export const renderWithProviders = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { initialEntries = ['/'], user = null, ...renderOptions } = options;

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
      <AuthProvider>
        {children}
      </AuthProvider>
    </BrowserRouter>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// API mocking utilities
export const createMockApiResponse = <T>(data: T, status = 200, delay = 0) => {
  return new Promise<{ data: T; status: number }>((resolve) => {
    setTimeout(() => {
      resolve({ data, status });
    }, delay);
  });
};

export const createMockApiError = (message: string, status = 500, delay = 0) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(message));
    }, delay);
  });
};

// Local storage mocking
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
    length: Object.keys(store).length,
    key: jest.fn((index: number) => Object.keys(store)[index] || null)
  };
};

// Performance testing utilities
export const measureRenderTime = async (renderFn: () => void): Promise<number> => {
  const start = performance.now();
  await renderFn();
  const end = performance.now();
  return end - start;
};

// Accessibility testing helpers
export const checkAccessibility = (element: HTMLElement): string[] => {
  const issues: string[] = [];

  // Check for alt text on images
  const images = element.querySelectorAll('img');
  images.forEach((img, index) => {
    if (!img.alt) {
      issues.push(`Image ${index + 1} missing alt text`);
    }
  });

  // Check for form labels
  const inputs = element.querySelectorAll('input, select, textarea');
  inputs.forEach((input, index) => {
    const id = input.getAttribute('id');
    const label = element.querySelector(`label[for="${id}"]`);
    const ariaLabel = input.getAttribute('aria-label');
    
    if (!label && !ariaLabel) {
      issues.push(`Form input ${index + 1} missing label`);
    }
  });

  // Check for heading hierarchy
  const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let lastLevel = 0;
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));
    if (level > lastLevel + 1) {
      issues.push(`Heading ${index + 1} skips levels (h${lastLevel} to h${level})`);
    }
    lastLevel = level;
  });

  // Check for color contrast (basic check)
  const elements = element.querySelectorAll('*');
  elements.forEach((el, index) => {
    const styles = window.getComputedStyle(el);
    const color = styles.color;
    const backgroundColor = styles.backgroundColor;
    
    // This is a simplified check - in practice, use a proper contrast ratio calculator
    if (color === backgroundColor) {
      issues.push(`Element ${index + 1} may have insufficient color contrast`);
    }
  });

  return issues;
};

// E2E testing helpers
export const waitForElement = (selector: string, timeout = 5000): Promise<Element> => {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found within ${timeout}ms`));
    }, timeout);
  });
};

// Form testing utilities
export const fillForm = (form: HTMLFormElement, data: Record<string, string>) => {
  Object.entries(data).forEach(([name, value]) => {
    const input = form.querySelector(`[name="${name}"]`) as HTMLInputElement;
    if (input) {
      input.value = value;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
};

// Network testing utilities
export const mockFetch = (responses: Record<string, any>) => {
  const originalFetch = global.fetch;
  
  global.fetch = jest.fn((url: string) => {
    const response = responses[url];
    if (response) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(response),
        text: () => Promise.resolve(JSON.stringify(response))
      } as Response);
    }
    
    return Promise.reject(new Error(`No mock response for ${url}`));
  });

  return () => {
    global.fetch = originalFetch;
  };
};

// Component testing utilities
export const getByTestId = (container: HTMLElement, testId: string): HTMLElement => {
  const element = container.querySelector(`[data-testid="${testId}"]`);
  if (!element) {
    throw new Error(`Element with data-testid="${testId}" not found`);
  }
  return element as HTMLElement;
};

export const queryByTestId = (container: HTMLElement, testId: string): HTMLElement | null => {
  return container.querySelector(`[data-testid="${testId}"]`) as HTMLElement | null;
};

// Snapshot testing utilities
export const createSnapshot = (component: ReactElement, name: string) => {
  const { container } = renderWithProviders(component);
  expect(container.firstChild).toMatchSnapshot(name);
};

// Performance testing
export const measureComponentPerformance = async (
  component: ReactElement,
  iterations = 100
): Promise<{ average: number; min: number; max: number }> => {
  const times: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    renderWithProviders(component);
    const end = performance.now();
    times.push(end - start);
  }

  return {
    average: times.reduce((a, b) => a + b, 0) / times.length,
    min: Math.min(...times),
    max: Math.max(...times)
  };
};

// Visual regression testing helpers
export const captureScreenshot = async (element: HTMLElement, name: string): Promise<string> => {
  // This would integrate with a visual testing service like Percy or Chromatic
  // For now, return a placeholder
  return `screenshot-${name}-${Date.now()}.png`;
};

// Test data cleanup
export const cleanupTestData = () => {
  // Clear localStorage
  localStorage.clear();
  
  // Clear sessionStorage
  sessionStorage.clear();
  
  // Reset any global state
  // This would depend on your state management solution
};

// Test environment setup
export const setupTestEnvironment = () => {
  // Mock console methods to reduce noise in tests
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };

  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  // Mock IntersectionObserver
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));

  // Mock ResizeObserver
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
};

// Test teardown
export const teardownTestEnvironment = () => {
  cleanupTestData();
  jest.clearAllMocks();
  jest.restoreAllMocks();
};