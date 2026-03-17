import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-violet-400 mb-4" />
          <div className="text-zinc-400">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // App.jsx handles showing login
  }

  return children;
}