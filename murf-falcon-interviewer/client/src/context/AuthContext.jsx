// client/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Core Session Verification Bootload
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const verifySession = async () => {
      try {
        const savedToken = localStorage.getItem('murf_token');
        const savedUser = localStorage.getItem('murf_user');

        // Immediately unblock the UI if no session exists at all
        if (!savedToken || !savedUser) {
           if (isMounted) setLoading(false);
           return;
        }

        // Apply fast local storage mounting while verifying server-side bounds
        if (isMounted) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
        
        API.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;

        try {
          const res = await API.get('/auth/me', { signal: controller.signal });
          
          if (isMounted) {
            const validUser = res.data.data.user;
            setUser(validUser);
            localStorage.setItem('murf_user', JSON.stringify(validUser));
          }
        } catch (err) {
          // In React 18 StrictMode, this will catch when the first test render is aborted.
          // By breaking out of the logic entirely, we ignore the error and let the second render succeed cleanly.
          if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') return;

          // Standard API rejection logic triggers session wipe
          if (isMounted) {
            delete API.defaults.headers.common['Authorization'];
            localStorage.removeItem('murf_token');
            localStorage.removeItem('murf_user');
            setUser(null);
            setToken(null);
          }
        } finally {
          // ALWAYS disable the loading overlay once networking resolves or rejects
          if (isMounted) {
            setLoading(false);
          }
        }
      } catch (e) {
        console.error('Fatal initialization error:', e);
        if (isMounted) setLoading(false);
      }
    };

    verifySession();

    // Secure unmounting handler drops stale requests safely
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const signup = useCallback(async (fullName, email, password) => {
    try {
      setError(null);
      const res = await API.post('/auth/signup', { fullName, email, password });
      
      if (!res?.data?.data) throw new Error("Invalid response format from server");
      
      const { user: userData, token: newToken } = res.data.data;

      setUser(userData);
      setToken(newToken);
      API.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      localStorage.setItem('murf_token', newToken);
      localStorage.setItem('murf_user', JSON.stringify(userData));

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Signup failed. Please try again.';
      setError(message);
      return { success: false, message };
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      const res = await API.post('/auth/login', { email, password });
      
      if (!res?.data?.data) throw new Error("Invalid response format from server");

      const { user: userData, token: newToken } = res.data.data;

      setUser(userData);
      setToken(newToken);
      API.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      localStorage.setItem('murf_token', newToken);
      localStorage.setItem('murf_user', JSON.stringify(userData));

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Check your security credentials.';
      setError(message);
      return { success: false, message };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setError(null);
    
    delete API.defaults.headers.common['Authorization'];
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
      {/* 
        Strict inline alignment eliminates removeChild ghost element mismatches internally 
        by avoiding multiple root rendering loops against asynchronous dependencies.
      */}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth boundary compromised: must be used within an active AuthProvider network.');
  return ctx;
}