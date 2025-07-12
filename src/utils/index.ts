/**
 * Central export file for all utilities
 * Organize exports by functionality
 */

// Internationalization utilities
export {
  getLanguageDirection,
  getLanguageCode,
  formatRelativeTime,
  formatCurrency,
  formatDate,
  detectBrowserLanguage,
  validateTranslationKey
} from './i18n';

// Security utilities
export {
  hashPassword,
  verifyPassword,
  generateSessionId,
  isSessionValid,
  validatePasswordStrength,
  sanitizeInput,
  validateCSRFToken,
  encryptData,
  decryptData,
  rateLimiter,
  createSecureRequest,
  handleSecureError,
  createAuditLog
} from './security';

// Performance utilities
export {
  PerformanceMonitor,
  useDebounce,
  useMemoizedCallback,
  useVirtualization,
  cacheManager
} from './performance';

// Testing utilities
export {
  renderWithProviders,
  setupTestEnvironment,
  createMockUser,
  createMockProduct,
  createMockOrder
} from './testing';

// Encoding utilities
export {
  normalizeText,
  isValidUTF8,
  sanitizeText,
  encodeToBase64UTF8,
  decodeFromBase64UTF8,
  fixVietnameseEncoding,
  ensureDisplaySafe,
  debugEncoding,
  safeEncodingOperation,
  ENCODING_CONSTANTS
} from './encoding';

// Utility types
export type { CacheOptions } from './performance';
export type { SecurityConfig } from './security';
export type { TestRenderOptions } from './testing';
export type { EncodingType, EncodingResult } from './encoding';