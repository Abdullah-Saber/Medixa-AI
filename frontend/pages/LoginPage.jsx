import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Logo from '../components/Logo';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { login, getDashboardRoute } = useAuth();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Get the page they were trying to access, or default to dashboard
  const from = location.state?.from?.pathname || getDashboardRoute();

  function handle(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  }

  function validate() {
    const e = {};
    if (!form.email)                     e.email    = t('auth.emailRequired') || 'Email is required.';
    else if (!form.email.includes('@'))  e.email    = t('auth.validEmail') || 'Please enter a valid email.';
    if (!form.password)                  e.password = t('auth.passwordRequired') || 'Password is required.';
    return e;
  }

  async function submit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      setSuccess(true);
      // Redirect based on role
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1500);
    } catch (error) {
      setErrors({ general: error.message || 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        position: 'relative',
        background: 'radial-gradient(circle at top, rgba(11,206,170,.14), transparent 20%), linear-gradient(180deg, #03111c 0%, #04131f 100%)',
        direction: isRTL ? 'rtl' : 'ltr',
      }}
    >
      <div className="hex-blob" style={{ top: -50, right: -100, opacity: .5 }} />

      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ display: 'inline-block', marginBottom: 20 }}>
            <Logo size={34} />
          </Link>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 700, marginBottom: 8, color: '#effcfb' }}>
            {t('auth.welcomeBack')}
          </h1>
          <p style={{ color: 'rgba(232,244,240,.82)', fontSize: 14 }}>{t('auth.signInSubtitle')}</p>
          {success ? (
            <div>
              <div className="sl-success" style={{ marginBottom: 20 }}>✓ {t('auth.success')}</div>
              <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)' }}>Taking you to your dashboard…</p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              {errors.general && (
                <div style={{ padding: '12px 16px', background: 'rgba(231, 76, 60, 0.1)', border: '1px solid rgba(231, 76, 60, 0.3)', borderRadius: '10px', marginBottom: '16px', color: '#e74c3c', fontSize: '14px' }}>
                  {errors.general}
                </div>
              )}
              {/* Demo Credentials Hint */}
              <div style={{ padding: '12px 16px', background: 'rgba(11, 206, 170, 0.08)', border: '1px solid rgba(11, 206, 170, 0.2)', borderRadius: '10px', marginBottom: '16px' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#0bceaa', fontWeight: 600 }}>{t('auth.demoCredentials')}:</p>
                <p style={{ margin: '0', fontSize: '12px', color: 'rgba(232,244,240,0.7)' }}>
                  <strong>{t('auth.admin')}:</strong> admin@smartlab.com / admin123<br/>
                  <strong>{t('auth.doctor')}:</strong> doctor@smartlab.com / doctor123<br/>
                  <strong>{t('auth.patient')}:</strong> patient@smartlab.com / patient123
                </p>
              </div>
              {/* Email */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 13, color: 'rgba(232,244,240,.82)', marginBottom: 6, fontWeight: 500 }}>
                  {t('auth.email')}
                </label>
                <input
                  className="sl-input"
                  name="email"
                  type="email"
                  placeholder={t('auth.email')}
                  value={form.email}
                  onChange={handle}
                />
                {errors.email && <p className="sl-error">{errors.email}</p>}
              </div>

              {/* Password */}
              <div style={{ marginBottom: 8 }}>
                <label style={{ display: 'block', fontSize: 13, color: 'rgba(232,244,240,.82)', marginBottom: 6, fontWeight: 500 }}>
                  {t('auth.password')}
                </label>
                <input
                  className="sl-input"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handle}
                />
                {errors.password && <p className="sl-error">{errors.password}</p>}
              </div>

              <div style={{ textAlign: isRTL ? 'left' : 'right', marginBottom: 22 }}>
                <span style={{ fontSize: 13, color: '#0bceaa', cursor: 'pointer' }}>{t('auth.forgotPassword')}</span>
              </div>

              <button className="btn-primary" type="submit" style={{ width: '100%' }}>
                {loading ? <span className="sl-spinner" /> : t('auth.signIn')}
              </button>

              <div className="sl-divider" />

              <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)' }}>
                {t('auth.noAccount')}{' '}
                <Link to="/register" style={{ color: '#0bceaa', fontWeight: 500, textDecoration: 'none' }}>
                  {t('auth.createOne')} →
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
