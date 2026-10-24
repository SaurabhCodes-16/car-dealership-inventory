import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  quickDemoLogin: (role: 'admin' | 'customer') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('dealership_auth_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem('dealership_auth_token');
      const storedUser = localStorage.getItem('dealership_auth_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        } catch (e) {
          localStorage.removeItem('dealership_auth_token');
          localStorage.removeItem('dealership_auth_user');
        }
      }
      setIsLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const data = await authApi.login(email, pass);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('dealership_auth_token', data.token);
      localStorage.setItem('dealership_auth_user', JSON.stringify(data.user));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string, role: UserRole = 'customer') => {
    setIsLoading(true);
    try {
      const data = await authApi.register(name, email, pass, role);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('dealership_auth_token', data.token);
      localStorage.setItem('dealership_auth_user', JSON.stringify(data.user));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('dealership_auth_token');
    localStorage.removeItem('dealership_auth_user');
  };

  const quickDemoLogin = async (role: 'admin' | 'customer') => {
    if (role === 'admin') {
      await login('admin@dealership.com', 'admin123');
    } else {
      await login('buyer@dealership.com', 'buyer123');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin: user?.role === 'admin',
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        quickDemoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
