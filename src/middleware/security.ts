// Security middleware for the application
import { rateLimiter, validateCSRFToken, sanitizeInput } from '../utils/security';
import { localStorageService } from '../services/LocalStorageService';

// Rate limiting middleware
export const withRateLimit = (identifier: string = 'global') => {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const clientId = identifier === 'global' ? 'global' : `${identifier}_${args[0]?.id || 'anonymous'}`;
      
      if (!rateLimiter.isAllowed(clientId)) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      return method.apply(this, args);
    };

    return descriptor;
  };
};

// CSRF protection middleware
export const withCSRFProtection = () => {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const request = args[0];
      const csrfToken = request?.headers?.['X-CSRF-Token'];
      const storedToken = localStorageService.getItem('csrf_token');

      if (!csrfToken || !storedToken || !validateCSRFToken(csrfToken, storedToken)) {
        throw new Error('Invalid CSRF token');
      }

      return method.apply(this, args);
    };

    return descriptor;
  };
};

// Input sanitization middleware
export const withInputSanitization = (fields: string[] = []) => {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const data = args[0];
      
      if (data && typeof data === 'object') {
        const sanitizedData = { ...data };
        
        fields.forEach(field => {
          if (sanitizedData[field] && typeof sanitizedData[field] === 'string') {
            sanitizedData[field] = sanitizeInput(sanitizedData[field]);
          }
        });
        
        args[0] = sanitizedData;
      }

      return method.apply(this, args);
    };

    return descriptor;
  };
};

// Authentication middleware
export const withAuth = (requiredRole?: string) => {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const user = localStorageService.getItem('user');
      
      if (!user) {
        throw new Error('Authentication required');
      }

      if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
        throw new Error('Insufficient permissions');
      }

      return method.apply(this, args);
    };

    return descriptor;
  };
};

// Audit logging middleware
export const withAuditLog = (action: string, resource: string) => {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const user = localStorageService.getItem('user');
      const startTime = Date.now();
      
      try {
        const result = method.apply(this, args);
        
        // Log successful action
        console.log('Audit Log:', {
          userId: user?.id || 'anonymous',
          action: `${action}_SUCCESS`,
          resource,
          timestamp: Date.now(),
          duration: Date.now() - startTime,
          details: { args: args.length > 0 ? 'provided' : 'none' }
        });
        
        return result;
      } catch (error) {
        // Log failed action
        console.log('Audit Log:', {
          userId: user?.id || 'anonymous',
          action: `${action}_FAILED`,
          resource,
          timestamp: Date.now(),
          duration: Date.now() - startTime,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        
        throw error;
      }
    };

    return descriptor;
  };
};

// Performance monitoring middleware
export const withPerformanceMonitoring = (label?: string) => {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;
    const monitoringLabel = label || `${target.constructor.name}.${propertyName}`;

    descriptor.value = function (...args: any[]) {
      const startTime = performance.now();
      
      try {
        const result = method.apply(this, args);
        
        // Handle async methods
        if (result instanceof Promise) {
          return result.finally(() => {
            const endTime = performance.now();
            console.log(`Performance: ${monitoringLabel} took ${endTime - startTime}ms`);
          });
        }
        
        const endTime = performance.now();
        console.log(`Performance: ${monitoringLabel} took ${endTime - startTime}ms`);
        
        return result;
      } catch (error) {
        const endTime = performance.now();
        console.log(`Performance: ${monitoringLabel} failed after ${endTime - startTime}ms`);
        throw error;
      }
    };

    return descriptor;
  };
};

// Error handling middleware
export const withErrorHandling = (fallbackValue?: any) => {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      try {
        const result = method.apply(this, args);
        
        // Handle async methods
        if (result instanceof Promise) {
          return result.catch((error) => {
            console.error(`Error in ${target.constructor.name}.${propertyName}:`, error);
            
            if (fallbackValue !== undefined) {
              return fallbackValue;
            }
            
            throw error;
          });
        }
        
        return result;
      } catch (error) {
        console.error(`Error in ${target.constructor.name}.${propertyName}:`, error);
        
        if (fallbackValue !== undefined) {
          return fallbackValue;
        }
        
        throw error;
      }
    };

    return descriptor;
  };
};

// Validation middleware
export const withValidation = (schema: any) => {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const data = args[0];
      
      // Basic validation - in production, use a library like Joi or Yup
      if (schema.required) {
        schema.required.forEach((field: string) => {
          if (!data || data[field] === undefined || data[field] === null || data[field] === '') {
            throw new Error(`Field '${field}' is required`);
          }
        });
      }
      
      if (schema.email) {
        schema.email.forEach((field: string) => {
          if (data[field] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data[field])) {
            throw new Error(`Field '${field}' must be a valid email`);
          }
        });
      }
      
      if (schema.minLength) {
        Object.entries(schema.minLength).forEach(([field, minLength]) => {
          if (data[field] && data[field].length < minLength) {
            throw new Error(`Field '${field}' must be at least ${minLength} characters long`);
          }
        });
      }

      return method.apply(this, args);
    };

    return descriptor;
  };
};

// Caching middleware
export const withCache = (ttl: number = 5 * 60 * 1000, keyGenerator?: (...args: any[]) => string) => {
  const cache = new Map<string, { data: any; timestamp: number }>();

  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const cacheKey = keyGenerator 
        ? keyGenerator(...args)
        : `${target.constructor.name}.${propertyName}.${JSON.stringify(args)}`;
      
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < ttl) {
        return cached.data;
      }

      const result = method.apply(this, args);
      
      // Handle async methods
      if (result instanceof Promise) {
        return result.then((data) => {
          cache.set(cacheKey, { data, timestamp: Date.now() });
          return data;
        });
      }
      
      cache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    };

    return descriptor;
  };
};

// Retry middleware
export const withRetry = (maxAttempts: number = 3, delay: number = 1000) => {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      let lastError: Error;
      
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          return await method.apply(this, args);
        } catch (error) {
          lastError = error as Error;
          
          if (attempt === maxAttempts) {
            throw lastError;
          }
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
      }
      
      throw lastError!;
    };

    return descriptor;
  };
};

// Combine multiple middlewares
export const withMiddleware = (...middlewares: any[]) => {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    middlewares.reverse().forEach(middleware => {
      middleware(target, propertyName, descriptor);
    });
    return descriptor;
  };
};