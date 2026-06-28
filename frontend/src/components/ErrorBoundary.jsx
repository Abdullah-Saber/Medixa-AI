import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.content}>
            <div style={styles.icon}>⚠️</div>
            <h1 style={styles.title}>Something went wrong</h1>
            <p style={styles.message}>
              An unexpected error occurred. Please refresh the page or try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={styles.button}
            >
              Refresh Page
            </button>
            <button
              onClick={() => window.location.href = '/'}
              style={styles.secondaryButton}
            >
              Go to Home
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={styles.details}>
                <summary style={styles.summary}>Error Details</summary>
                <pre style={styles.errorDetails}>
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(circle at top left, rgba(11,206,170,.14), transparent 22%), radial-gradient(circle at top right, rgba(11,206,170,.08), transparent 20%), linear-gradient(180deg, #03111c 0%, #04111e 100%)',
    padding: '20px',
  },
  content: {
    textAlign: 'center',
    maxWidth: '500px',
    padding: '40px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(11,206,170,0.2)',
    borderRadius: '16px',
  },
  icon: {
    fontSize: '64px',
    marginBottom: '20px',
  },
  title: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '24px',
    fontWeight: '700',
    color: '#effcfb',
    margin: '0 0 16px 0',
  },
  message: {
    fontSize: '14px',
    color: 'rgba(232,244,240,0.7)',
    marginBottom: '24px',
    lineHeight: '1.6',
  },
  button: {
    padding: '12px 24px',
    background: '#0bceaa',
    color: '#04111e',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    marginRight: '12px',
  },
  secondaryButton: {
    padding: '12px 24px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(11,206,170,0.3)',
    borderRadius: '8px',
    color: '#e8f4f0',
    cursor: 'pointer',
    fontSize: '14px',
  },
  details: {
    marginTop: '24px',
    textAlign: 'left',
  },
  summary: {
    cursor: 'pointer',
    color: '#0bceaa',
    fontSize: '14px',
    fontWeight: '500',
  },
  errorDetails: {
    marginTop: '12px',
    padding: '16px',
    background: 'rgba(231, 76, 60, 0.1)',
    border: '1px solid #e74c3c',
    borderRadius: '8px',
    fontSize: '12px',
    color: '#e74c3c',
    overflow: 'auto',
    maxHeight: '300px',
  },
};
