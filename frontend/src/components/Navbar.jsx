import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(4,17,30,.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(11,206,170,.08)',
        padding: '14px 0',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Logo />
        </Link>

        {/* Center links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Link to="/">
            <button className={`nav-link${pathname === '/' ? ' active' : ''}`}>{t('nav.home')}</button>
          </Link>
          <Link to="/services">
            <button className={`nav-link${pathname === '/services' ? ' active' : ''}`}>{t('nav.services')}</button>
          </Link>
          <Link to="/book-appointment">
            <button className={`nav-link${pathname === '/book-appointment' ? ' active' : ''}`}>{t('nav.bookAppointment')}</button>
          </Link>
          <Link to="/about">
            <button className={`nav-link${pathname === '/about' ? ' active' : ''}`}>{t('nav.about')}</button>
          </Link>
          {isAuthenticated && isAdmin && (
            <Link to="/admin">
              <button className={`nav-link${pathname === '/admin' ? ' active' : ''}`}>Admin</button>
            </Link>
          )}
        </div>

        {/* Auth buttons & Language */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <LanguageSwitcher />
          {!isAuthenticated ? (
            <>
              <Link to="/login">
                <button className="btn-outline">{t('nav.signIn')}</button>
              </Link>
              <Link to="/register">
                <button className="btn-primary">{t('nav.register')}</button>
              </Link>
            </>
          ) : (
            <Link to="/login">
              <button className="btn-outline">Logout</button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
