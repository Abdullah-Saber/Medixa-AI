import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { patientService } from '../services/api';

const PatientProfilePage = () => {
  const { isRTL } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    bloodType: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadProfile();
  }, [user.id]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await patientService.getById(user.id);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
        gender: data.gender || '',
        bloodType: data.bloodType || ''
      });
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      await patientService.update(user.id, formData);
      setSuccess('Profile updated successfully!');
      setEditing(false);
      
      // Update user context if needed
      setTimeout(() => {
        loadProfile();
      }, 1000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    loadProfile(); // Reload original data
  };

  if (loading) {
    return (
      <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
        <div style={styles.loading}>Loading profile...</div>
      </div>
    );
  }

  return (
    <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Header */}
      <header style={styles.header}>
        <button onClick={() => navigate('/patient')} style={styles.backBtn}>
          ← Back to Dashboard
        </button>
        <h1 style={styles.title}>My Profile</h1>
        {!editing && (
          <button onClick={() => setEditing(true)} style={styles.editBtn}>
            Edit Profile
          </button>
        )}
      </header>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {success && (
        <div style={styles.success}>
          {success}
        </div>
      )}

      {/* Profile Card */}
      <section style={styles.profileSection}>
        <div style={styles.profileCard}>
          {/* Avatar */}
          <div style={styles.avatarSection}>
            <div style={styles.avatar}>
              {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h2 style={styles.profileName}>{formData.name || 'Not set'}</h2>
            <p style={styles.profileEmail}>{formData.email || 'Not set'}</p>
          </div>

          {/* Form */}
          <div style={styles.formSection}>
            <h3 style={styles.formTitle}>Personal Information</h3>
            
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!editing}
                  style={{
                    ...styles.input,
                    backgroundColor: editing ? 'rgba(255,255,255,0.05)' : 'transparent',
                    cursor: editing ? 'text' : 'default'
                  }}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!editing}
                  style={{
                    ...styles.input,
                    backgroundColor: editing ? 'rgba(255,255,255,0.05)' : 'transparent',
                    cursor: editing ? 'text' : 'default'
                  }}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!editing}
                  style={{
                    ...styles.input,
                    backgroundColor: editing ? 'rgba(255,255,255,0.05)' : 'transparent',
                    cursor: editing ? 'text' : 'default'
                  }}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!editing}
                  style={{
                    ...styles.input,
                    backgroundColor: editing ? 'rgba(255,255,255,0.05)' : 'transparent',
                    cursor: editing ? 'text' : 'default'
                  }}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  disabled={!editing}
                  style={{
                    ...styles.input,
                    backgroundColor: editing ? 'rgba(255,255,255,0.05)' : 'transparent',
                    cursor: editing ? 'text' : 'default'
                  }}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={!editing}
                  style={{
                    ...styles.input,
                    backgroundColor: editing ? 'rgba(255,255,255,0.05)' : 'transparent',
                    cursor: editing ? 'pointer' : 'default'
                  }}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Blood Type</label>
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  disabled={!editing}
                  style={{
                    ...styles.input,
                    backgroundColor: editing ? 'rgba(255,255,255,0.05)' : 'transparent',
                    cursor: editing ? 'pointer' : 'default'
                  }}
                >
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            {editing && (
              <div style={styles.formActions}>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    ...styles.saveBtn,
                    opacity: saving ? 0.6 : 1,
                    cursor: saving ? 'not-allowed' : 'pointer'
                  }}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Account Actions */}
      <section style={styles.actionsSection}>
        <h3 style={styles.sectionTitle}>Account Actions</h3>
        <div style={styles.actionButtons}>
          <button onClick={() => navigate('/patient/change-password')} style={styles.actionBtn}>
            🔒 Change Password
          </button>
          <button onClick={logout} style={styles.logoutBtn}>
            🚪 Logout
          </button>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at top left, rgba(11,206,170,.14), transparent 22%), radial-gradient(circle at top right, rgba(11,206,170,.08), transparent 20%), linear-gradient(180deg, #03111c 0%, #04111e 100%)',
    padding: '20px',
    color: '#e8f4f0',
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
    color: '#0bceaa',
  },
  error: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    border: '1px solid #e74c3c',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '20px',
    color: '#e74c3c',
  },
  success: {
    backgroundColor: 'rgba(39, 174, 96, 0.1)',
    border: '1px solid #27ae60',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '20px',
    color: '#27ae60',
  },
  header: {
    marginBottom: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '15px',
  },
  backBtn: {
    padding: '10px 20px',
    background: 'rgba(11,206,170,0.1)',
    border: '1px solid rgba(11,206,170,0.3)',
    borderRadius: '8px',
    color: '#0bceaa',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    margin: 0,
    color: '#effcfb',
  },
  editBtn: {
    padding: '10px 20px',
    background: '#0bceaa',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  profileSection: {
    marginBottom: '30px',
  },
  profileCard: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(11,206,170,0.2)',
    borderRadius: '12px',
    padding: '32px',
  },
  avatarSection: {
    textAlign: 'center',
    marginBottom: '32px',
    paddingBottom: '32px',
    borderBottom: '1px solid rgba(11,206,170,0.2)',
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #0bceaa 0%, #08a085 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '36px',
    fontWeight: '700',
    color: 'white',
    margin: '0 auto 16px',
  },
  profileName: {
    fontSize: '24px',
    fontWeight: '600',
    margin: '0 0 8px 0',
    color: '#effcfb',
  },
  profileEmail: {
    fontSize: '14px',
    color: 'rgba(232,244,240,0.7)',
    margin: 0,
  },
  formSection: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  formTitle: {
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 24px 0',
    color: '#effcfb',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '24px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '12px',
    color: 'rgba(232,244,240,0.6)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: '500',
  },
  input: {
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(11,206,170,0.2)',
    borderRadius: '8px',
    color: '#effcfb',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  formActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  saveBtn: {
    padding: '12px 24px',
    background: '#0bceaa',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  cancelBtn: {
    padding: '12px 24px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(11,206,170,0.2)',
    borderRadius: '8px',
    color: '#effcfb',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  actionsSection: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(11,206,170,0.2)',
    borderRadius: '12px',
    padding: '24px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 16px 0',
    color: '#effcfb',
  },
  actionButtons: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  actionBtn: {
    padding: '12px 24px',
    background: 'rgba(11,206,170,0.1)',
    border: '1px solid rgba(11,206,170,0.3)',
    borderRadius: '8px',
    color: '#0bceaa',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  logoutBtn: {
    padding: '12px 24px',
    background: 'rgba(231, 76, 60, 0.1)',
    border: '1px solid rgba(231, 76, 60, 0.3)',
    borderRadius: '8px',
    color: '#e74c3c',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
};

export default PatientProfilePage;
