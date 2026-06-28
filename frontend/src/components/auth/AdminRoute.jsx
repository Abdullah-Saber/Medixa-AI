import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, isLoading, getDashboardRoute, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner} />
        <p>Loading...</p>
      </div>
    );
  }

  // Not logged in - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but not admin - show Access Denied or redirect
  if (!isAdmin) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.icon}>🚫</div>
          <h1 style={styles.title}>Access Denied</h1>
          <p style={styles.message}>
            You don't have permission to access this page.
          </p>
          <p style={styles.roleInfo}>
            Your role: <strong>{user?.role}</strong>
          </p>
          <div style={styles.actions}>
            <a href={getDashboardRoute()} style={styles.dashboardBtn}>
              Go to Your Dashboard
            </a>
            <a href="/" style={styles.homeBtn}>
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Admin user - allow access
  return children;
}

const styles = {
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    color: '#e8f4f0',
    background: '#04111e',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(11,206,170,0.3)',
    borderTopColor: '#0bceaa',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    background: '#04111e',
    color: '#e8f4f0',
  },
  card: {
    textAlign: 'center',
    padding: '50px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(231, 76, 60, 0.3)',
    borderRadius: '20px',
    maxWidth: '450px',
    width: '100%',
  },
  icon: {
    fontSize: '64px',
    marginBottom: '20px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 700,
    margin: '0 0 12px 0',
    color: '#e74c3c',
  },
  message: {
    fontSize: '16px',
    color: 'rgba(232,244,240,0.8)',
    margin: '0 0 20px 0',
  },
  roleInfo: {
    fontSize: '14px',
    color: 'rgba(232,244,240,0.6)',
    margin: '0 0 30px 0',
    padding: '12px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '8px',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  dashboardBtn: {
    padding: '14px 24px',
    background: 'linear-gradient(135deg, #0bceaa, #09b494)',
    color: '#04111e',
    borderRadius: '10px',
    textDecoration: 'none',
    fontWeight: 700,
    cursor: 'pointer',
  },
  homeBtn: {
    padding: '14px 24px',
    background: 'transparent',
    color: '#e8f4f0',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '10px',
    textDecoration: 'none',
    fontWeight: 600,
    cursor: 'pointer',
  },
};
