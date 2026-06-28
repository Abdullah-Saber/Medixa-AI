import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import Logo from '../components/Logo';
import OTPDialog from '../components/auth/OTPDialog';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [email, setEmail] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [verifiedOTP, setVerifiedOTP] = useState(false);
  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Password validation
  const [passwordErrors, setPasswordErrors] = useState([]);

  const validatePassword = (password) => {
    const errs = [];
    if (password.length < 8) errs.push('At least 8 characters');
    if (!/[a-z]/.test(password)) errs.push('One lowercase letter');
    if (!/[A-Z]/.test(password)) errs.push('One uppercase letter');
    if (!/[0-9]/.test(password)) errs.push('One number');
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) errs.push('One special character');
    return errs;
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, newPassword: value });
    setPasswordErrors(validatePassword(value));
    setErrors({ ...errors, newPassword: '', confirmPassword: '' });
  };

  const validateEmail = () => {
    const e = {};
    if (!email) e.email = t('auth.emailRequired') || 'Email is required.';
    else if (!email.includes('@')) e.email = t('auth.validEmail') || 'Please enter a valid email.';
    return e;
  };

  const validatePasswordForm = () => {
    const e = {};
    const pwdErrs = validatePassword(form.newPassword);
    if (pwdErrs.length > 0) {
      e.newPassword = 'Password does not meet requirements: ' + pwdErrs.join(', ');
    }
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password.';
    else if (form.newPassword !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    return e;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const errs = validateEmail();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      // Mock API call - send OTP to email
      await new Promise(r => setTimeout(r, 1500));
      setShowOTP(true);
      setErrors({});
    } catch (error) {
      setErrors({ general: 'Failed to send OTP. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async (otp) => {
    // Mock OTP verification - replace with actual API
    await new Promise(r => setTimeout(r, 1000));
    
    // For demo: any 6-digit code works (replace with actual verification)
    if (otp.length === 6) {
      setVerifiedOTP(true);
      setShowOTP(false);
      setStep(3);
    } else {
      throw new Error('Invalid OTP');
    }
  };

  const handleOTPResend = async () => {
    // Mock resend OTP
    await new Promise(r => setTimeout(r, 1000));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errs = validatePasswordForm();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(r => setTimeout(r, 1500));
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setErrors({ general: 'Failed to reset password. Please try again.' });
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
            {step === 1 ? (t('auth.forgotPasswordTitle') || 'Forgot Password') : (t('auth.resetPassword') || 'Reset Password')}
          </h1>
          <p style={{ color: 'rgba(232,244,240,.82)', fontSize: 14 }}>
            {step === 1 
              ? (t('auth.forgotPasswordSubtitle') || 'Enter your email to receive a password reset link')
              : (t('auth.resetPasswordSubtitle') || 'Create a new password for your account')
            }
          </p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div className="sl-success" style={{ marginBottom: 20 }}>✓ {t('auth.passwordResetSuccess') || 'Password reset successfully!'}</div>
            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)' }}>{t('auth.redirectingToLogin') || 'Redirecting to login...'}</p>
          </div>
        ) : step === 3 ? (
          <form onSubmit={handlePasswordSubmit} noValidate>
            {errors.general && (
              <div style={{ padding: '12px 16px', background: 'rgba(231, 76, 60, 0.1)', border: '1px solid rgba(231, 76, 60, 0.3)', borderRadius: '10px', marginBottom: '16px', color: '#e74c3c', fontSize: '14px' }}>
                {errors.general}
              </div>
            )}
            
            {/* New Password */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, color: 'rgba(232,244,240,.82)', marginBottom: 6, fontWeight: 500 }}>
                {t('auth.newPassword') || 'New Password'}
              </label>
              <input
                className="sl-input"
                type="password"
                placeholder="••••••••"
                value={form.newPassword}
                onChange={handlePasswordChange}
                style={errors.newPassword ? { borderColor: '#e74c3c' } : {}}
              />
              {form.newPassword && (
                <div style={{ marginTop: '8px', padding: '10px 12px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(11,206,170,0.1)' }}>
                  <p style={{ fontSize: '12px', color: '#a7dcd7', margin: '0 0 6px 0', fontWeight: '500' }}>Password must contain:</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12px' }}>
                    <li style={passwordErrors.includes('At least 8 characters') ? { color: 'rgba(232,244,240,0.5)' } : { color: '#0bceaa' }}>
                      {passwordErrors.includes('At least 8 characters') ? '○' : '✓'} At least 8 characters
                    </li>
                    <li style={passwordErrors.includes('One lowercase letter') ? { color: 'rgba(232,244,240,0.5)' } : { color: '#0bceaa' }}>
                      {passwordErrors.includes('One lowercase letter') ? '○' : '✓'} One lowercase letter
                    </li>
                    <li style={passwordErrors.includes('One uppercase letter') ? { color: 'rgba(232,244,240,0.5)' } : { color: '#0bceaa' }}>
                      {passwordErrors.includes('One uppercase letter') ? '○' : '✓'} One uppercase letter
                    </li>
                    <li style={passwordErrors.includes('One number') ? { color: 'rgba(232,244,240,0.5)' } : { color: '#0bceaa' }}>
                      {passwordErrors.includes('One number') ? '○' : '✓'} One number
                    </li>
                    <li style={passwordErrors.includes('One special character') ? { color: 'rgba(232,244,240,0.5)' } : { color: '#0bceaa' }}>
                      {passwordErrors.includes('One special character') ? '○' : '✓'} One special character
                    </li>
                  </ul>
                </div>
              )}
              {errors.newPassword && <p className="sl-error">{errors.newPassword}</p>}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, color: 'rgba(232,244,240,.82)', marginBottom: 6, fontWeight: 500 }}>
                {t('auth.confirmNewPassword') || 'Confirm New Password'}
              </label>
              <input
                className="sl-input"
                type="password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) => { setForm({ ...form, confirmPassword: e.target.value }); setErrors({ ...errors, confirmPassword: '' }); }}
                style={errors.confirmPassword ? { borderColor: '#e74c3c' } : {}}
              />
              {errors.confirmPassword && <p className="sl-error">{errors.confirmPassword}</p>}
            </div>

            <button className="btn-primary" type="submit" style={{ width: '100%' }}>
              {loading ? <span className="sl-spinner" /> : (t('auth.resetPasswordBtn') || 'Reset Password')}
            </button>

            <div className="sl-divider" />

            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ background: 'none', border: 'none', color: '#0bceaa', fontWeight: 500, cursor: 'pointer', fontSize: 13 }}
              >
                ← {t('auth.backToEmail') || 'Back to email'}
              </button>
            </p>
          </form>
        ) : step === 1 ? (
          <form onSubmit={handleEmailSubmit} noValidate>
            {errors.general && (
              <div style={{ padding: '12px 16px', background: 'rgba(231, 76, 60, 0.1)', border: '1px solid rgba(231, 76, 60, 0.3)', borderRadius: '10px', marginBottom: '16px', color: '#e74c3c', fontSize: '14px' }}>
                {errors.general}
              </div>
            )}
            
            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, color: 'rgba(232,244,240,.82)', marginBottom: 6, fontWeight: 500 }}>
                {t('auth.email')}
              </label>
              <input
                className="sl-input"
                type="email"
                placeholder={t('auth.email')}
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: '' }); }}
              />
              {errors.email && <p className="sl-error">{errors.email}</p>}
            </div>

            <button className="btn-primary" type="submit" style={{ width: '100%' }}>
              {loading ? <span className="sl-spinner" /> : (t('auth.sendResetLink') || 'Send Reset Link')}
            </button>

            <div className="sl-divider" />

            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)' }}>
              {t('auth.rememberPassword') || 'Remember your password?'}{' '}
              <Link to="/login" style={{ color: '#0bceaa', fontWeight: 500, textDecoration: 'none' }}>
                {t('auth.signInHere') || 'Sign in here'} →
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit} noValidate>
            {errors.general && (
              <div style={{ padding: '12px 16px', background: 'rgba(231, 76, 60, 0.1)', border: '1px solid rgba(231, 76, 60, 0.3)', borderRadius: '10px', marginBottom: '16px', color: '#e74c3c', fontSize: '14px' }}>
                {errors.general}
              </div>
            )}
            
            {/* New Password */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, color: 'rgba(232,244,240,.82)', marginBottom: 6, fontWeight: 500 }}>
                {t('auth.newPassword') || 'New Password'}
              </label>
              <input
                className="sl-input"
                type="password"
                placeholder="••••••••"
                value={form.newPassword}
                onChange={handlePasswordChange}
                style={errors.newPassword ? { borderColor: '#e74c3c' } : {}}
              />
              {form.newPassword && (
                <div style={{ marginTop: '8px', padding: '10px 12px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(11,206,170,0.1)' }}>
                  <p style={{ fontSize: '12px', color: '#a7dcd7', margin: '0 0 6px 0', fontWeight: '500' }}>Password must contain:</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12px' }}>
                    <li style={passwordErrors.includes('At least 8 characters') ? { color: 'rgba(232,244,240,0.5)' } : { color: '#0bceaa' }}>
                      {passwordErrors.includes('At least 8 characters') ? '○' : '✓'} At least 8 characters
                    </li>
                    <li style={passwordErrors.includes('One lowercase letter') ? { color: 'rgba(232,244,240,0.5)' } : { color: '#0bceaa' }}>
                      {passwordErrors.includes('One lowercase letter') ? '○' : '✓'} One lowercase letter
                    </li>
                    <li style={passwordErrors.includes('One uppercase letter') ? { color: 'rgba(232,244,240,0.5)' } : { color: '#0bceaa' }}>
                      {passwordErrors.includes('One uppercase letter') ? '○' : '✓'} One uppercase letter
                    </li>
                    <li style={passwordErrors.includes('One number') ? { color: 'rgba(232,244,240,0.5)' } : { color: '#0bceaa' }}>
                      {passwordErrors.includes('One number') ? '○' : '✓'} One number
                    </li>
                    <li style={passwordErrors.includes('One special character') ? { color: 'rgba(232,244,240,0.5)' } : { color: '#0bceaa' }}>
                      {passwordErrors.includes('One special character') ? '○' : '✓'} One special character
                    </li>
                  </ul>
                </div>
              )}
              {errors.newPassword && <p className="sl-error">{errors.newPassword}</p>}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, color: 'rgba(232,244,240,.82)', marginBottom: 6, fontWeight: 500 }}>
                {t('auth.confirmNewPassword') || 'Confirm New Password'}
              </label>
              <input
                className="sl-input"
                type="password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) => { setForm({ ...form, confirmPassword: e.target.value }); setErrors({ ...errors, confirmPassword: '' }); }}
                style={errors.confirmPassword ? { borderColor: '#e74c3c' } : {}}
              />
              {errors.confirmPassword && <p className="sl-error">{errors.confirmPassword}</p>}
            </div>

            <button className="btn-primary" type="submit" style={{ width: '100%' }}>
              {loading ? <span className="sl-spinner" /> : (t('auth.resetPasswordBtn') || 'Reset Password')}
            </button>

            <div className="sl-divider" />

            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ background: 'none', border: 'none', color: '#0bceaa', fontWeight: 500, cursor: 'pointer', fontSize: 13 }}
              >
                ← {t('auth.backToEmail') || 'Back to email'}
              </button>
            </p>
          </form>
        )}

        <OTPDialog
          email={email}
          isOpen={showOTP}
          onVerify={handleOTPVerify}
          onResend={handleOTPResend}
          onCancel={() => { setShowOTP(false); setStep(1); }}
        />
      </div>
    </div>
  );
}
