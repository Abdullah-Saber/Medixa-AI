import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { user, logout } = useAuth();

  const stats = [
    { label: t('admin.totalPatients') || 'Total Patients', value: '2,450', icon: '👥' },
    { label: t('admin.totalDoctors') || 'Total Doctors', value: '48', icon: '👨‍⚕️' },
    { label: t('admin.totalAppointments') || 'Appointments', value: '1,280', icon: '📅' },
    { label: t('admin.totalTests') || 'Lab Tests', value: '5,670', icon: '🔬' },
  ];

  const recentActivities = [
    { action: 'New patient registered', time: '2 min ago', type: 'user' },
    { action: 'Dr. Sarah updated availability', time: '15 min ago', type: 'doctor' },
    { action: 'Appointment #1234 confirmed', time: '30 min ago', type: 'appointment' },
    { action: 'Lab results uploaded', time: '1 hour ago', type: 'test' },
  ];

  return (
    <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.title}>{t('admin.welcome') || 'Admin Dashboard'}</h1>
            <p style={styles.subtitle}>
              {t('admin.loggedInAs') || 'Logged in as'}: <strong>{user?.name}</strong> ({user?.role})
            </p>
          </div>
          <button onClick={logout} style={styles.logoutBtn}>
            {t('admin.logout') || 'Logout'}
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} style={styles.statCard}>
              <div style={styles.statIcon}>{stat.icon}</div>
              <div style={styles.statValue}>{stat.value}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <div style={styles.mainGrid}>
        {/* Recent Activity */}
        <section style={styles.activitySection}>
          <h2 style={styles.sectionTitle}>{t('admin.recentActivity') || 'Recent Activity'}</h2>
          <div style={styles.activityList}>
            {recentActivities.map((activity, index) => (
              <div key={index} style={styles.activityItem}>
                <div style={styles.activityDot} />
                <div style={styles.activityContent}>
                  <p style={styles.activityText}>{activity.action}</p>
                  <span style={styles.activityTime}>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section style={styles.actionsSection}>
          <h2 style={styles.sectionTitle}>{t('admin.quickActions') || 'Quick Actions'}</h2>
          <div style={styles.actionButtons}>
            <button style={styles.actionBtn}>{t('admin.manageDoctors') || 'Manage Doctors'}</button>
            <button style={styles.actionBtn}>{t('admin.managePatients') || 'Manage Patients'}</button>
            <button style={styles.actionBtn}>{t('admin.viewReports') || 'View Reports'}</button>
            <button style={styles.actionBtn}>{t('admin.settings') || 'Settings'}</button>
          </div>
        </section>
      </div>
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
  header: {
    marginBottom: '30px',
    padding: '20px 0',
    borderBottom: '1px solid rgba(11,206,170,0.2)',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '15px',
  },
  title: {
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
  logoutBtn: {
    padding: '10px 24px',
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
  statsSection: {
    marginBottom: '30px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  statCard: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(11,206,170,0.2)',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
  },
  statIcon: {
    fontSize: '32px',
    marginBottom: '12px',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0bceaa',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '14px',
    color: 'rgba(232,244,240,0.7)',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px',
  },
  activitySection: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(11,206,170,0.2)',
    borderRadius: '12px',
    padding: '24px',
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
    margin: '0 0 20px 0',
    color: '#effcfb',
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '8px',
  },
  activityDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#0bceaa',
    flexShrink: 0,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    margin: '0 0 4px 0',
    fontSize: '14px',
    color: '#e8f4f0',
  },
  activityTime: {
    fontSize: '12px',
    color: 'rgba(232,244,240,0.5)',
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  actionBtn: {
    padding: '14px 20px',
    background: 'rgba(11,206,170,0.1)',
    border: '1px solid rgba(11,206,170,0.3)',
    borderRadius: '8px',
    color: '#0bceaa',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'left',
    transition: 'all 0.3s ease',
  },
};

export default AdminDashboard;
