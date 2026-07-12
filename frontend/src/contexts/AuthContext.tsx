import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@ecosphere/shared/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if session exists in localStorage
    const savedUser = localStorage.getItem('esg_session_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('esg_session_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { default: api } = await import('@/api/axiosInstance');
      
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', _password);

      const res = await api.post('/v1/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      const token = res.data.data.access_token;
      localStorage.setItem('esg_session_token', token);
      
      const userRes = await api.get('/v1/auth/me');
      const mockUser: User = {
        id: userRes.data.data.id,
        email: userRes.data.data.email,
        firstName: userRes.data.data.name.split(' ')[0] || 'User',
        lastName: userRes.data.data.name.split(' ')[1] || '',
        role: userRes.data.data.role.toUpperCase() as any,
        createdAt: new Date(userRes.data.data.created_at),
        updatedAt: new Date(userRes.data.data.created_at),
      };

      setUser(mockUser);
      localStorage.setItem('esg_session_user', JSON.stringify(mockUser));
      setIsLoading(false);
      return true;
    } catch (e) {
      console.error('Login failed', e);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('esg_session_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
