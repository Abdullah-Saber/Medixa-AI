import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
  const { isRTL } = useLanguage();
  const { user, logout } = useAuth();
  
  const [settings, setSettings] = useState({
    siteName: 'Medixa-AI',
    siteEmail: 'support@medixa-ai.com',
    sitePhone: '+20 123 456 7890',
    labAddress: '123 Medical Center, Cairo, Egypt',
    workingHours: 'Mon-Sat: 8AM - 8PM',
    enableNotifications: true,
    enableEmailAlerts: true,
    maintenanceMode: false,
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    
    try {
      // TODO: Implement actual API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Settings saved successfully!');
    } catch (err) {
      setMessage('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Settings</h1>
        <p style={styles.subtitle}>Configure your application settings</p>
      </header>

      {message && (
        <div style={message.includes('success') ? styles.successBanner : styles.errorBanner}>
          {message}
          <button onClick={() => setMessage(null)} style={styles.messageClose}>×</button>
        </div>
      )}

      <form onSubmit={handleSave} style={styles.form}>
        {/* General Settings */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>General Settings</h2>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Site Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Support Email</label>
              <input
                type="email"
                value={settings.siteEmail}
                onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Support Phone</label>
              <input
                type="text"
                value={settings.sitePhone}
                onChange={(e) => setSettings({ ...settings, sitePhone: e.target.value })}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Lab Address</label>
              <input
                type="text"
                value={settings.labAddress}
                onChange={(e) => setSettings({ ...settings, labAddress: e.target.value })}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Working Hours</label>
              <input
                type="text"
                value={settings.workingHours}
                onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                style={styles.input}
              />
            </div>
          </div>
        </section>

        {/* Notification Settings */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Notification Settings</h2>
          <div style={styles.toggleGroup}>
            <div style={styles.toggleItem}>
              <div style={styles.toggleInfo}>
                <div style={styles.toggleLabel}>Enable Notifications</div>
                <div style={styles.toggleDesc}>Allow push notifications for users</div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('enableNotifications')}
                style={{
                  ...styles.toggle,
                  background: settings.enableNotifications ? '#0bceaa' : 'rgba(255,255,255,0.1)',
                }}
              >
                <div style={{
                  ...styles.toggleKnob,
                  transform: settings.enableNotifications ? 'translateX(20px)' : 'translateX(0)',
                }} />
              </button>
            </div>
            <div style={styles.toggleItem}>
              <div style={styles.toggleInfo}>
                <div style={styles.toggleLabel}>Email Alerts</div>
                <div style={styles.toggleDesc}>Send email alerts for important events</div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('enableEmailAlerts')}
                style={{
                  ...styles.toggle,
                  background: settings.enableEmailAlerts ? '#0bceaa' : 'rgba(255,255,255,0.1)',
                }}
              >
                <div style={{
                  ...styles.toggleKnob,
                  transform: settings.enableEmailAlerts ? 'translateX(20px)' : 'translateX(0)',
                }} />
              </button>
            </div>
          </div>
        </section>

        {/* System Settings */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>System Settings</h2>
          <div style={styles.toggleGroup}>
            <div style={styles.toggleItem}>
              <div style={styles.toggleInfo}>
                <div style={styles.toggleLabel}>Maintenance Mode</div>
                <div style={styles.toggleDesc}>Disable public access to the application</div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('maintenanceMode')}
                style={{
                  ...styles.toggle,
                  background: settings.maintenanceMode ? '#e74c3c' : 'rgba(255,255,255,0.1)',
                }}
              >
                <div style={{
                  ...styles.toggleKnob,
                  transform: settings.maintenanceMode ? 'translateX(20px)' : 'translateX(0)',
                }} />
              </button>
            </div>
          </div>
        </section>

        {/* Account Settings */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Account Settings</h2>
          <div style={styles.accountInfo}>
            <div style={styles.accountItem}>
              <span style={styles.accountLabel}>Logged in as:</span>
              <span style={styles.accountValue}>{user?.name} ({user?.role})</span>
            </div>
            <div style={styles.accountItem}>
              <span style={styles.accountLabel}>Email:</span>
              <span style={styles.accountValue}>{user?.email}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            style={styles.logoutBtn}
          >
            Logout
          </button>
        </section>

        {/* Actions */}
        <div style={styles.actions}>
          <button type="submit" style={styles.saveBtn} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" style={styles.cancelBtn}>
            CancelChanges
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at top left, rgba(11,206,170,.14), transparent 22%), radial-gradient(circle at top right, rgba(11,206,170,.08), transparent 20%), linear-gradient(180deg, #03111c 0%, #04111e 100%)',
    padding: '20px',
    color: '#e8f4f0',
  },
  header: {
    marginBottom: '30px',
  },
  title: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 8px 0',
    color: '#effcfb',
  },
  subtitle: {
    fontSize: '14px',
    color: 'rgba(232,244,240,0.7)',
    margin: 0,
  },
  successBanner: {
    background: 'rgba(39, 174, 96, 0.1)',
    border: '1px solid #27ae60',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '20px',
    color: '#27ae60',
    fontSize: '14px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorBanner: {
    background: 'rgba(231, 76, 60, 0.1)',
    border: '1px solid #e74c3c',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '20px',
    color: '#e74c3c',
    fontSize: '14px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageClose: {
    background: 'none',
    border: 'none',
    color: 'inherit',
    fontSize: '20px',
    cursor: 'pointer',
    padding: 0,
  },
  form: {
    maxWidth: '800px',
  },
  section: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(11,206,170,0.2)',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 20px 0',
    color: '#effcfb',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'rgba(232,244,240,0.8)',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid rgba(11,206,170,0.3)',
    background: 'rgba(255,255,255,0.04)',
    color: '#e8f4f0',
    fontSize: '14px',
    outline: 'none',
  },
  toggleGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  toggleItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid rgba(11,206,170,0.1)',
  },
  toggleInfo: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#effcfb',
    marginBottom: '4px',
  },
  toggleDesc: {
    fontSize: '13px',
    color: 'rgba(232,244,240,0.6)',
  },
  toggle: {
    width: '44px',
    height: '24px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background 0.3s ease',
  },
  toggleKnob: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: 'white',
    position: 'absolute',
    top: '2px',
    left: '2px',
    transition: 'transform 0.3s ease',
  },
  accountInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
  },
  accountItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px',
    background: 'rgba(11,206,170,0.05)',
    borderRadius: '8px',
  },
  accountLabel: {
    fontSize: '14px',
    color: 'rgba(232,244,240,0.7)',
  },
  accountValue: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#effcfb',
  },
  logoutBtn: {
    padding: '12px 24px',
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
  },
  saveBtn: {
    padding: '12px 24px',
    background: '#0bceaa',
    color: '#04111e',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
  cancelBtn: {
    padding: '12px 24px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(11,206,170,0.3)',
    borderRadius: '8px',
    color: '#e8f4f0',
    cursor: 'pointer',
    fontSize: '14px',
  },
};
