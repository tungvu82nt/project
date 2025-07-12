import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { localStorageService } from '../services/LocalStorageService';
import { userService, CreateUserData } from '../services/UserService';

/* eslint-disable react-refresh/only-export-components */

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: CreateUserData) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session using LocalStorageService
    const storedUser = localStorageService.getItem('user');
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const authenticatedUser = await userService.authenticateUser(email, password);
      
      if (authenticatedUser) {
        setUser(authenticatedUser);
        localStorageService.setItem('user', authenticatedUser);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: CreateUserData): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const newUser = await userService.createUser(userData);
      
      if (newUser) {
        setUser(newUser);
        localStorageService.setItem('user', newUser);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorageService.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};