import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check saved session on mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('murf_token');
      const savedUser = localStorage.getItem('murf_user');

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));

        // Verify token
        API.get('/auth/me')
          .then((res) => {
            setUser(res.data.data.user);
            localStorage.setItem('murf_user', JSON.stringify(res.data.data.user));
          })
          .catch(() => {
            // Token expired — clear
            localStorage.removeItem('murf_token');
            localStorage.removeItem('murf_user');
            setUser(null);
            setToken(null);
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } catch (e) {
      console.error('Auth init error:', e);
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (fullName, email, password) => {
    try {
      setError(null);
      const res = await API.post('/auth/signup', { fullName, email, password });
      const { user: userData, token: newToken } = res.data.data;

      setUser(userData);
      setToken(newToken);
      localStorage.setItem('murf_token', newToken);
      localStorage.setItem('murf_user', JSON.stringify(userData));

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Signup failed. Try again.';
      setError(message);
      return { success: false, message };
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      const res = await API.post('/auth/login', { email, password });
      const { user: userData, token: newToken } = res.data.data;

      setUser(userData);
      setToken(newToken);
      localStorage.setItem('murf_token', newToken);
      localStorage.setItem('murf_user', JSON.stringify(userData));

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Check your credentials.';
      setError(message);
      return { success: false, message };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('murf_token');
    localStorage.removeItem('murf_user');
  }, []);

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        isAuthenticated,
        signup,
        login,
        logout,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}