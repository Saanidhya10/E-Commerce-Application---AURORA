import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register'
  const { showToast } = useToast();

  const handleAuthSuccess = (data) => {
    const { token: jwtToken, email, role } = data;
    const userData = { email, role };
    setToken(jwtToken);
    setUser(userData);
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setAuthModalOpen(false);
  };

  const login = async (email, password) => {
    try {
      const res = await authApi.login({ email, password });
      if (res.success && res.data) {
        handleAuthSuccess(res.data);
        showToast(`Welcome back, ${res.data.email}!`);
        return true;
      }
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await authApi.register({ name, email, password });
      if (res.success && res.data) {
        handleAuthSuccess(res.data);
        showToast('Registration successful! Welcome to AURORA.');
        return true;
      }
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
      return false;
    }
  };

  const loginDemo = async (roleType = 'customer') => {
    if (roleType === 'admin') {
      return login('admin@ecommerce.com', 'Admin@123');
    } else {
      return login('customer@ecommerce.com', 'Customer@123');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showToast('You have been logged out.');
  };

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const isAuthenticated = Boolean(token && user);
  const isAdmin = Boolean(user && user.role === 'ADMIN');

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        isAdmin,
        login,
        register,
        loginDemo,
        logout,
        authModalOpen,
        authModalTab,
        setAuthModalTab,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
