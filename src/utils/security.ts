// Security utilities for the application
import CryptoJS from 'crypto-js';

// Environment variables for security
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-key-change-in-production';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// XSS Protection
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// HTML sanitization for rich text content
export const sanitizeHTML = (html: string): string => {
  // Basic HTML sanitization - in production, use a library like DOMPurify
  const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a'];
  const allowedAttributes = ['href', 'target', 'rel'];
  
  // This is a basic implementation - use DOMPurify in production
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

// Data encryption for sensitive information
export const encryptData = (data: string): string => {
  try {
    return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return data;
  }
};

// Data decryption
export const decryptData = (encryptedData: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedData;
  }
};

// CSRF Token management
export const generateCSRFToken = (): string => {
  return CryptoJS.lib.WordArray.random(32).toString();
};

// Validate CSRF token
export const validateCSRFToken = (token: string, storedToken: string): boolean => {
  return token === storedToken;
};

// Rate limiting helper
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const entry = this.limits.get(identifier);

    if (!entry || now > entry.resetTime) {
      this.limits.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return true;
    }

    if (entry.count >= this.maxRequests) {
      return false;
    }

    entry.count++;
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const entry = this.limits.get(identifier);
    if (!entry || Date.now() > entry.resetTime) {
      return this.maxRequests;
    }
    return Math.max(0, this.maxRequests - entry.count);
  }
}

export const rateLimiter = new RateLimiter();

// Password hashing and verification
export const hashPassword = async (password: string): Promise<string> => {
  // Simple hash using CryptoJS for demo purposes
  // In production, use bcrypt or similar
  return CryptoJS.SHA256(password + 'salt').toString();
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const hash = await hashPassword(password);
  return hash === hashedPassword;
};

// Password strength validation
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Password must be at least 8 characters long');
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain lowercase letters');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain uppercase letters');
  }

  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain numbers');
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain special characters');
  }

  return {
    isValid: score >= 4,
    score,
    feedback
  };
};

// Secure headers configuration
export const getSecurityHeaders = () => {
  return {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  };
};

// Input validation helpers
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateCreditCard = (cardNumber: string): boolean => {
  // Luhn algorithm for credit card validation
  const num = cardNumber.replace(/\s/g, '');
  if (!/^\d+$/.test(num)) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = num.length - 1; i >= 0; i--) {
    let digit = parseInt(num[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

// Session management
export const generateSessionId = (): string => {
  return CryptoJS.lib.WordArray.random(32).toString();
};

export const isSessionValid = (sessionId: string, createdAt: number, maxAge: number = 24 * 60 * 60 * 1000): boolean => {
  return Date.now() - createdAt < maxAge;
};

// API security helpers
export const createSecureRequest = (url: string, options: RequestInit = {}): RequestInit => {
  const csrfToken = localStorage.getItem('csrf-token') || generateCSRFToken();
  
  return {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
      'X-Requested-With': 'XMLHttpRequest',
      ...options.headers,
    },
    credentials: 'include',
  };
};

// File upload security
export const validateFileUpload = (file: File): { isValid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' };
  }
  
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size too large. Maximum size is 5MB.' };
  }
  
  return { isValid: true };
};

// Audit logging
export interface AuditLog {
  userId: string;
  action: string;
  resource: string;
  timestamp: number;
  ipAddress?: string;
  userAgent?: string;
  details?: any;
}

export const createAuditLog = (
  userId: string,
  action: string,
  resource: string,
  details?: any
): AuditLog => {
  return {
    userId,
    action,
    resource,
    timestamp: Date.now(),
    ipAddress: 'client-side', // In production, get from server
    userAgent: navigator.userAgent,
    details
  };
};

// Error handling with security considerations
export const handleSecureError = (error: any): { message: string; code?: string } => {
  // Don't expose sensitive error details to client
  if (error.message?.includes('password') || error.message?.includes('token')) {
    return { message: 'Authentication error occurred', code: 'AUTH_ERROR' };
  }
  
  if (error.message?.includes('database') || error.message?.includes('sql')) {
    return { message: 'Data processing error occurred', code: 'DATA_ERROR' };
  }
  
  return { message: 'An unexpected error occurred', code: 'GENERAL_ERROR' };
};