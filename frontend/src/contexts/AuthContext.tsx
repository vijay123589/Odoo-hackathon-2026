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
    // Mock login verification
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const mockUser: User = {
      id: 'd9b736b4-f3a2-4a0b-8025-fb3556de651a',
      email: email,
      firstName: 'Jane',
      lastName: 'Doe',
      role: email.includes('admin') ? 'ADMIN' : email.includes('auditor') ? 'AUDITOR' : 'EMPLOYEE',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setUser(mockUser);
    localStorage.setItem('esg_session_user', JSON.stringify(mockUser));
    setIsLoading(false);
    return true;
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
