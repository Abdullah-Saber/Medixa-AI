import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import Logo from '../components/Logo';
import { authService } from '../services/api';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            Forgot Password?
          </h1>
          <p style={{ color: 'rgba(232,244,240,.82)', fontSize: 14 }}>
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>✉️</div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 600, marginBottom: 12, color: '#effcfb' }}>
              Check Your Email
            </h2>
            <p style={{ color: 'rgba(232,244,240,.82)', fontSize: 14, marginBottom: 24 }}>
              We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions.
            </p>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '12px 24px',
                background: '#0bceaa',
                color: '#04111e',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
              }}
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <div style={{ padding: '12px 16px', background: 'rgba(231, 76, 60, 0.1)', border: '1px solid rgba(231, 76, 60, 0.3)', borderRadius: '10px', marginBottom: '16px', color: '#e74c3c', fontSize: '14px' }}>
                {error}
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, color: 'rgba(232,244,240,.82)', marginBottom: 6, fontWeight: 500 }}>
                Email Address
              </label>
              <input
                className="sl-input"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              className="btn-primary"
              type="submit"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className="sl-divider" />

            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)' }}>
              Remember your password?{' '}
              <Link to="/login" style={{ color: '#0bceaa', fontWeight: 500, textDecoration: 'none' }}>
                Sign In →
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
