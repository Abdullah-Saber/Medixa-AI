import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import GoogleSignInButton from '../components/GoogleSignInButton';

const RegisterPage = () => {
  const { isRTL } = useLanguage();
  const { login, register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    nationalID: '',
    gender: '1',
    dateOfBirth: '',
    address: '',
    bloodType: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.fullName || !formData.email || !formData.password || !formData.nationalID) {
      setError('Please fill in all required fields');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || null,
        nationalID: formData.nationalID,
        gender: parseInt(formData.gender, 10),
        dateOfBirth: formData.dateOfBirth || null,
        address: formData.address || null,
        bloodType: formData.bloodType || null,
      });

      await login(formData.email, formData.password);
      navigate('/patient');
    } catch (err) {
      console.error('Registration failed:', err);
      const msg = err.response?.data || err.message;
      setError(typeof msg === 'string' ? msg : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (idToken) => {
    try {
      setLoading(true);
      setError(null);
      await googleLogin(idToken);
      navigate('/patient');
    } catch (err) {
      setError('Google sign-up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
      <div style={styles.card}>
        <h2 style={styles.header}>Patient Registration</h2>
        <p style={styles.subtitle}>Create your patient account to book tests and view results.</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Full Name *</label>
            <input name="fullName" type="text" placeholder="Enter your name" style={styles.input} onChange={handleInputChange} required />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email Address *</label>
            <input name="email" type="email" placeholder="example@mail.com" style={styles.input} onChange={handleInputChange} required />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password *</label>
            <input name="password" type="password" placeholder="********" style={styles.input} onChange={handleInputChange} required />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Confirm Password *</label>
            <input name="confirmPassword" type="password" placeholder="********" style={styles.input} onChange={handleInputChange} required />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Phone Number</label>
            <input name="phone" type="tel" placeholder="01xxxxxxxxx" style={styles.input} onChange={handleInputChange} />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>National ID *</label>
            <input name="nationalID" type="text" placeholder="National ID" style={styles.input} onChange={handleInputChange} required />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleInputChange} style={styles.input}>
              <option value="1">Male</option>
              <option value="2">Female</option>
              <option value="3">Other</option>
            </select>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Date of Birth</label>
            <input name="dateOfBirth" type="date" style={styles.input} onChange={handleInputChange} />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Address</label>
            <input name="address" type="text" placeholder="Address" style={styles.input} onChange={handleInputChange} />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Blood Type</label>
            <select name="bloodType" value={formData.bloodType} onChange={handleInputChange} style={styles.input}>
              <option value="">Select Blood Type</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <button type="submit" style={styles.submitButton} disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>

          <div style={styles.divider}>Or</div>

          <GoogleSignInButton
            text="signup_with"
            disabled={loading}
            onSuccess={handleGoogleSuccess}
            onError={(err) => setError(err.message || 'Google sign-up failed')}
          />
        </form>

        <div style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at top left, rgba(11,206,170,.14), transparent 22%), linear-gradient(180deg, #03111c 0%, #04111e 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  card: {
    backgroundColor: 'rgba(4,17,30,0.95)',
    padding: '34px',
    borderRadius: '24px',
    boxShadow: '0 30px 90px rgba(0,0,0,0.35)',
    width: '100%',
    maxWidth: '520px',
    color: '#e8f4f0',
    border: '1px solid rgba(11,206,170,0.18)',
  },
  header: { textAlign: 'center', marginBottom: '8px', color: '#f4fbfa', fontSize: '28px', fontWeight: '700' },
  subtitle: { textAlign: 'center', marginBottom: '25px', color: 'rgba(232,244,240,0.65)', fontSize: '14px' },
  error: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    border: '1px solid #e74c3c',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '20px',
    color: '#e74c3c',
    fontSize: '14px',
    textAlign: 'center',
  },
  form: { display: 'flex', flexDirection: 'column' },
  fieldGroup: { marginBottom: '15px' },
  label: { display: 'block', marginBottom: '8px', fontSize: '14px', color: '#a7dcd7', fontWeight: '500' },
  input: {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: '1px solid rgba(11,206,170,0.2)',
    fontSize: '16px',
    boxSizing: 'border-box',
    color: '#e8f4f0',
    backgroundColor: 'rgba(255,255,255,0.04)',
    outline: 'none',
  },
  submitButton: {
    marginTop: '10px',
    padding: '14px',
    backgroundColor: '#0bceaa',
    color: '#04111e',
    border: 'none',
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  divider: { textAlign: 'center', margin: '20px 0', color: 'rgba(232,244,240,0.5)', fontSize: '14px' },
  footer: { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'rgba(232,244,240,0.7)' },
  link: { color: '#0bceaa', textDecoration: 'none', fontWeight: '600' },
};

export default RegisterPage;
