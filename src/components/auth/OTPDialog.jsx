import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';

export default function OTPDialog({ email, onVerify, onResend, onCancel, isOpen }) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Focus first input when opened
  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [isOpen]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take last digit
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if complete
    if (index === 5 && value) {
      const fullOtp = [...newOtp.slice(0, 5), value].join('');
      if (fullOtp.length === 6) {
        handleVerify(fullOtp);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    pastedData.split('').forEach((digit, i) => {
      if (i < 6) newOtp[i] = digit;
    });
    setOtp(newOtp);
    
    // Focus appropriate input
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();

    if (pastedData.length === 6) {
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (fullOtp) => {
    setLoading(true);
    setError('');
    try {
      await onVerify(fullOtp);
    } catch (err) {
      setError(t('auth.invalidOTP') || 'Invalid OTP code. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await onResend();
      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);
      setError('');
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(t('auth.resendFailed') || 'Failed to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length === 6) {
      handleVerify(fullOtp);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.dialog}>
        <div style={styles.header}>
          <h2 style={styles.title}>{t('auth.verifyEmail') || 'Verify Your Email'}</h2>
          <p style={styles.subtitle}>
            {t('auth.otpSentTo') || 'We sent a 6-digit code to'}<br/>
            <strong style={styles.email}>{email}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          <div style={{ ...styles.otpContainer, direction: 'ltr' }}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => inputRefs.current[index] = el}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                style={{
                  ...styles.otpInput,
                  borderColor: error ? '#e74c3c' : digit ? '#0bceaa' : 'rgba(11,206,170,0.3)',
                }}
                disabled={loading}
              />
            ))}
          </div>

          <button
            type="submit"
            style={styles.verifyButton}
            disabled={otp.join('').length !== 6 || loading}
          >
            {loading ? <span className="sl-spinner" /> : (t('auth.verify') || 'Verify')}
          </button>

          <div style={styles.resendSection}>
            {resendTimer > 0 ? (
              <p style={styles.timerText}>
                {t('auth.resendIn') || 'Resend code in'} <strong>{resendTimer}s</strong>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                style={styles.resendButton}
                disabled={loading}
              >
                {t('auth.resendCode') || 'Resend Code'}
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onCancel}
            style={styles.cancelButton}
            disabled={loading}
          >
            {t('auth.cancel') || 'Cancel'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  dialog: {
    backgroundColor: 'rgba(4,17,30,0.98)',
    borderRadius: '24px',
    padding: '40px 32px',
    width: '100%',
    maxWidth: '400px',
    border: '1px solid rgba(11,206,170,0.2)',
    boxShadow: '0 30px 90px rgba(0,0,0,0.5)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  title: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '22px',
    fontWeight: 700,
    color: '#effcfb',
    margin: '0 0 12px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: 'rgba(232,244,240,0.7)',
    margin: 0,
    lineHeight: 1.6,
  },
  email: {
    color: '#0bceaa',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  error: {
    padding: '12px 16px',
    background: 'rgba(231, 76, 60, 0.1)',
    border: '1px solid rgba(231, 76, 60, 0.3)',
    borderRadius: '10px',
    marginBottom: '20px',
    color: '#e74c3c',
    fontSize: '14px',
    width: '100%',
    textAlign: 'center',
  },
  otpContainer: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  otpInput: {
    width: '48px',
    height: '56px',
    borderRadius: '12px',
    border: '2px solid rgba(11,206,170,0.3)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    color: '#e8f4f0',
    fontSize: '24px',
    fontWeight: '700',
    textAlign: 'center',
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  verifyButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#0bceaa',
    color: '#04111e',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginBottom: '20px',
  },
  resendSection: {
    marginBottom: '16px',
  },
  timerText: {
    fontSize: '14px',
    color: 'rgba(232,244,240,0.6)',
    margin: 0,
  },
  resendButton: {
    background: 'none',
    border: 'none',
    color: '#0bceaa',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  cancelButton: {
    background: 'none',
    border: '1px solid rgba(255,255,255,0.2)',
    color: 'rgba(232,244,240,0.7)',
    padding: '10px 24px',
    borderRadius: '10px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
};
