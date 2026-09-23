import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('luxe_token');
    if (token) {
      api
        .getProfile()
        .then((res) => {
          if (res.user) {
            setUser(res.user);
          } else {
            localStorage.removeItem('luxe_token');
          }
        })
        .catch(() => {
          localStorage.removeItem('luxe_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.token && res.user) {
      localStorage.setItem('luxe_token', res.token);
      setUser(res.user);
      return { success: true, user: res.user };
    } else {
      return { success: false, error: res.error || 'Login failed' };
    }
  };

  const register = async (data) => {
    const res = await api.register(data);
    if (res.token && res.user) {
      localStorage.setItem('luxe_token', res.token);
      setUser(res.user);
      return { success: true, user: res.user };
    } else {
      return { success: false, error: res.error || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('luxe_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
