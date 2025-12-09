// Fix: explicit typing for props and state to resolve TS errors
import React, { Component, ReactNode, ErrorInfo } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh', 
          backgroundColor: '#f9fafb',
          color: '#1f2937', 
          flexDirection: 'column', 
          textAlign: 'center',
          fontFamily: 'sans-serif',
          padding: '20px'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>عذراً، حدث خطأ غير متوقع</h2>
          <p style={{ color: '#4b5563', marginBottom: '20px' }}>يرجى تحديث الصفحة للمحاولة مرة أخرى.</p>
          <details style={{ marginTop: '10px', padding: '10px', background: '#e5e7eb', borderRadius: '8px', textAlign: 'left', maxWidth: '600px', overflow: 'auto' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>تفاصيل الخطأ (للمطورين)</summary>
            <pre style={{ marginTop: '10px', fontSize: '0.8rem', color: '#dc2626' }}>
              {this.state.error?.toString()}
            </pre>
          </details>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            تحديث الصفحة
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const container = document.getElementById('root');

if (!container) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);