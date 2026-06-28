import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Breadcrumbs() {
  const { isRTL } = useLanguage();
  const location = useLocation();
  
  const pathnames = location.pathname.split('/').filter(x => x);

  const getBreadcrumbName = (path, index) => {
    const fullPath = '/' + pathnames.slice(0, index + 1).join('/');
    
    const nameMap = {
      'admin': 'Admin',
      'specializations': 'Specializations',
      'reports': 'Reports',
      'settings': 'Settings',
      'patient': 'Patient',
      'lab-tests': 'Lab Tests',
      'book-test': 'Book Test',
      'orders': 'Orders',
      'results': 'Results',
      'appointments': 'Appointments',
      'profile': 'Profile',
      'doctor': 'Doctor',
      'patients': 'Patients',
      'login': 'Login',
      'register': 'Register',
      'forgot-password': 'Forgot Password',
      'about': 'About',
      'services': 'Services',
      'book-appointment': 'Book Appointment',
    };

    // Check if it's an ID (detail page)
    if (path.match(/^[0-9a-f-]{36}$/i) || !isNaN(path)) {
      return 'Details';
    }

    return nameMap[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  if (pathnames.length === 0) return null;

  return (
    <nav style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
      <Link to="/" style={styles.link}>Home</Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        
        return (
          <React.Fragment key={name}>
            <span style={styles.separator}>{isRTL ? '‹' : '›'}</span>
            {isLast ? (
              <span style={styles.current}>{getBreadcrumbName(name, index)}</span>
            ) : (
              <Link to={routeTo} style={styles.link}>
                {getBreadcrumbName(name, index)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

const styles = {
  container: {
    padding: '12px 24px',
    fontSize: '13px',
    color: 'rgba(232,244,240,0.6)',
    background: 'rgba(4,17,30,0.5)',
    borderBottom: '1px solid rgba(11,206,170,0.08)',
  },
  link: {
    color: 'rgba(232,244,240,0.8)',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  },
  linkHover: {
    color: '#0bceaa',
  },
  current: {
    color: '#0bceaa',
    fontWeight: '500',
  },
  separator: {
    margin: '0 8px',
    color: 'rgba(232,244,240,0.4)',
  },
};
