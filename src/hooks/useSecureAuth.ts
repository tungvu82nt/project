import { useState, useEffect, useCallback } from 'react';
import { validatePasswordStrength, generateSessionId, isSessionValid, createAuditLog } from '../utils/security';

interface SecureAuthState {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionId: string | null;
  lastActivity: number;
  loginAttempts: number;
  isLocked: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
  twoFactorCode?: string;
}

interface SecuritySettings {
  maxLoginAttempts: number;
  lockoutDuration: number;
  sessionTimeout: number;
  requireTwoFactor: boolean;
}

const DEFAULT_SECURITY_SETTINGS: SecuritySettings = {
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  requireTwoFactor: false
};

export const useSecureAuth = (securitySettings: Partial<SecuritySettings> = {}) => {
  const settings = { ...DEFAULT_SECURITY_SETTINGS, ...securitySettings };
  
  const [authState, setAuthState] = useState<SecureAuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    sessionId: null,
    lastActivity: Date.now(),
    loginAttempts: 0,
    isLocked: false
  });

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedSession = localStorage.getItem('sessionId');
        const storedActivity = localStorage.getItem('lastActivity');
        const storedAttempts = localStorage.getItem('loginAttempts');
        const storedLockout = localStorage.getItem('lockoutTime');

        // Check if account is locked
        if (storedLockout) {
          const lockoutTime = parseInt(storedLockout);
          if (Date.now() - lockoutTime < settings.lockoutDuration) {
            setAuthState(prev => ({ ...prev, isLocked: true, isLoading: false }));
            return;
          } else {
            localStorage.removeItem('lockoutTime');
            localStorage.removeItem('loginAttempts');
          }
        }

        // Validate session
        if (storedUser && storedSession && storedActivity) {
          const lastActivity = parseInt(storedActivity);
          if (isSessionValid(storedSession, lastActivity, settings.sessionTimeout)) {
            const user = JSON.parse(storedUser);
            setAuthState(prev => ({
              ...prev,
              user,
              isAuthenticated: true,
              sessionId: storedSession,
              lastActivity,
              loginAttempts: parseInt(storedAttempts || '0'),
              isLoading: false
            }));
            updateActivity();
          } else {
            clearAuthData();
          }
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearAuthData();
      }
    };

    initializeAuth();
  }, []);

  // Update last activity timestamp
  const updateActivity = useCallback(() => {
    const now = Date.now();
    setAuthState(prev => ({ ...prev, lastActivity: now }));
    localStorage.setItem('lastActivity', now.toString());
  }, []);

  // Clear authentication data
  const clearAuthData = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('lastActivity');
    setAuthState(prev => ({
      ...prev,
      user: null,
      isAuthenticated: false,
      sessionId: null,
      isLoading: false
    }));
  }, []);

  // Handle login attempts and lockout
  const handleFailedLogin = useCallback(() => {
    const newAttempts = authState.loginAttempts + 1;
    
    if (newAttempts >= settings.maxLoginAttempts) {
      const lockoutTime = Date.now();
      localStorage.setItem('lockoutTime', lockoutTime.toString());
      localStorage.setItem('loginAttempts', newAttempts.toString());
      
      setAuthState(prev => ({
        ...prev,
        loginAttempts: newAttempts,
        isLocked: true
      }));
      
      // Create audit log for lockout
      if (authState.user) {
        const auditLog = createAuditLog(
          authState.user.id,
          'ACCOUNT_LOCKED',
          'authentication',
          { attempts: newAttempts, lockoutDuration: settings.lockoutDuration }
        );
        console.log('Audit Log:', auditLog);
      }
    } else {
      localStorage.setItem('loginAttempts', newAttempts.toString());
      setAuthState(prev => ({ ...prev, loginAttempts: newAttempts }));
    }
  }, [authState.loginAttempts, authState.user, settings.maxLoginAttempts, settings.lockoutDuration]);

  // Reset login attempts on successful login
  const resetLoginAttempts = useCallback(() => {
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('lockoutTime');
    setAuthState(prev => ({ ...prev, loginAttempts: 0, isLocked: false }));
  }, []);

  // Secure login function
  const login = useCallback(async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string; requiresTwoFactor?: boolean }> => {
    if (authState.isLocked) {
      return { success: false, error: 'Account is temporarily locked due to too many failed attempts' };
    }

    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      // Validate input
      if (!credentials.email || !credentials.password) {
        return { success: false, error: 'Email and password are required' };
      }

      // Simulate API call with security checks
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock authentication logic with enhanced security
      let isValidCredentials = false;
      let user = null;

      if (credentials.email === 'admin@elitestore.com' && credentials.password === 'admin123') {
        user = {
          id: '1',
          name: 'Admin User',
          email: 'admin@yapee.vn',
          role: 'admin',
          lastLogin: Date.now(),
          twoFactorEnabled: settings.requireTwoFactor
        };
        isValidCredentials = true;
      } else if (credentials.email.includes('@') && credentials.password.length >= 6) {
        user = {
          id: '2',
          name: credentials.email.split('@')[0],
          email: credentials.email,
          role: 'customer',
          lastLogin: Date.now(),
          twoFactorEnabled: false
        };
        isValidCredentials = true;
      }

      if (!isValidCredentials) {
        handleFailedLogin();
        return { success: false, error: 'Invalid email or password' };
      }

      // Check if two-factor authentication is required
      if (user.twoFactorEnabled && !credentials.twoFactorCode) {
        return { success: false, requiresTwoFactor: true };
      }

      // Validate two-factor code if provided
      if (user.twoFactorEnabled && credentials.twoFactorCode) {
        // Mock 2FA validation - in production, validate against TOTP
        if (credentials.twoFactorCode !== '123456') {
          handleFailedLogin();
          return { success: false, error: 'Invalid two-factor authentication code' };
        }
      }

      // Generate secure session
      const sessionId = generateSessionId();
      const now = Date.now();

      // Store authentication data
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('sessionId', sessionId);
      localStorage.setItem('lastActivity', now.toString());

      // Reset failed attempts
      resetLoginAttempts();

      // Update state
      setAuthState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        sessionId,
        lastActivity: now,
        isLoading: false
      }));

      // Create audit log
      const auditLog = createAuditLog(
        user.id,
        'LOGIN_SUCCESS',
        'authentication',
        { email: credentials.email, rememberMe: credentials.rememberMe }
      );
      console.log('Audit Log:', auditLog);

      return { success: true };

    } catch (error) {
      console.error('Login error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'An unexpected error occurred during login' };
    }
  }, [authState.isLocked, handleFailedLogin, resetLoginAttempts, settings.requireTwoFactor]);

  // Secure logout function
  const logout = useCallback(() => {
    // Create audit log before clearing data
    if (authState.user) {
      const auditLog = createAuditLog(
        authState.user.id,
        'LOGOUT',
        'authentication'
      );
      console.log('Audit Log:', auditLog);
    }

    clearAuthData();
  }, [authState.user, clearAuthData]);

  // Register function with password strength validation
  const register = useCallback(async (userData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Promise<{ success: boolean; error?: string; passwordFeedback?: string[] }> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      // Validate input
      if (!userData.name || !userData.email || !userData.password) {
        return { success: false, error: 'All fields are required' };
      }

      if (userData.password !== userData.confirmPassword) {
        return { success: false, error: 'Passwords do not match' };
      }

      // Validate password strength
      const passwordValidation = validatePasswordStrength(userData.password);
      if (!passwordValidation.isValid) {
        return { 
          success: false, 
          error: 'Password does not meet security requirements',
          passwordFeedback: passwordValidation.feedback
        };
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        role: 'customer' as const,
        lastLogin: Date.now(),
        twoFactorEnabled: false
      };

      // Generate session
      const sessionId = generateSessionId();
      const now = Date.now();

      // Store data
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('sessionId', sessionId);
      localStorage.setItem('lastActivity', now.toString());

      // Update state
      setAuthState(prev => ({
        ...prev,
        user: newUser,
        isAuthenticated: true,
        sessionId,
        lastActivity: now,
        isLoading: false
      }));

      // Create audit log
      const auditLog = createAuditLog(
        newUser.id,
        'REGISTER_SUCCESS',
        'authentication',
        { email: userData.email }
      );
      console.log('Audit Log:', auditLog);

      return { success: true };

    } catch (error) {
      console.error('Registration error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'An unexpected error occurred during registration' };
    }
  }, []);

  // Check session validity periodically
  useEffect(() => {
    if (!authState.isAuthenticated || !authState.sessionId) return;

    const checkSession = () => {
      if (!isSessionValid(authState.sessionId!, authState.lastActivity, settings.sessionTimeout)) {
        logout();
      }
    };

    const interval = setInterval(checkSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [authState.isAuthenticated, authState.sessionId, authState.lastActivity, logout, settings.sessionTimeout]);

  // Auto-update activity on user interaction
  useEffect(() => {
    if (!authState.isAuthenticated) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    const handleActivity = () => updateActivity();

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [authState.isAuthenticated, updateActivity]);

  // Get remaining lockout time
  const getRemainingLockoutTime = useCallback((): number => {
    const lockoutTime = localStorage.getItem('lockoutTime');
    if (!lockoutTime) return 0;

    const elapsed = Date.now() - parseInt(lockoutTime);
    const remaining = settings.lockoutDuration - elapsed;
    return Math.max(0, remaining);
  }, [settings.lockoutDuration]);

  return {
    // State
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    isLocked: authState.isLocked,
    loginAttempts: authState.loginAttempts,
    
    // Actions
    login,
    logout,
    register,
    updateActivity,
    
    // Utilities
    getRemainingLockoutTime,
    maxLoginAttempts: settings.maxLoginAttempts,
    sessionTimeout: settings.sessionTimeout
  };
};