// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import './index.css';

// Centralized error bounding prevents pure white screen fatal crashes
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Caught Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ backgroundColor: '#09090b', color: 'white', minHeight: '100vh', padding: '3rem', fontFamily: 'sans-serif' }}>
          <h1 style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '2rem', fontWeight: 'bold' }}>Application Crashed</h1>
          <p style={{ marginBottom: '2rem', color: '#a1a1aa' }}>A critical JavaScript error blocked React from rendering.</p>
          <pre style={{ backgroundColor: '#18181b', padding: '1.5rem', borderRadius: '12px', overflowX: 'auto', border: '1px solid #3f3f46', whiteSpace: 'pre-wrap' }}>
            <span style={{ color: '#f87171', fontWeight: 'bold' }}>{this.state.error && this.state.error.toString()}</span>
            <br /><br />
            <span style={{ color: '#9ca3af' }}>{this.state.errorInfo && this.state.errorInfo.componentStack}</span>
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
