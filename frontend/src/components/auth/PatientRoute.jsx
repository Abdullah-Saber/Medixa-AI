import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PatientRoute({ children }) {
  const { isAuthenticated, isPatient, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner} />
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isPatient) {
    // Redirect to appropriate dashboard based on user role
    if (user?.role === 'Admin') {
      return <Navigate to="/admin" replace />;
    }
    if (user?.role === 'Doctor') {
      return <Navigate to="/doctor" replace />;
    }
    return <Navigate to="/login" replace />;
  }

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
};
