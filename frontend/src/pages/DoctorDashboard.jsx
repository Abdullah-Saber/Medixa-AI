import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { patientService, orderService, resultService, appointmentService } from '../services/api';

const normalizeStatus = (status) => {
  if (status === 1 || status === 'Pending') return 'Pending';
  if (status === 2 || status === 'Completed') return 'Completed';
  if (status === 3 || status === 'Cancelled') return 'Cancelled';
  return status || 'Pending';
};

const getOrderDoctorId = (o) => o.doctorId || o.doctorID || o.DoctorID;
const getOrderPatientId = (o) => o.patientId || o.patientID || o.PatientID;
const getPatientId = (p) => p.patientId || p.patientID || p.PatientID;

const DoctorDashboard = () => {
  const { isRTL } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    assignedPatients: 0,
    pendingReviews: 0,
    todayAppointments: 0,
    recentResults: 0,
  });

  const [assignedPatients, setAssignedPatients] = useState([]);
  const [patientsNeedingReview, setPatientsNeedingReview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      const [patients, orders, results, appointments] = await Promise.all([
        patientService.getAll(),
        orderService.getAll(),
        resultService.getAll(),
        appointmentService.getAll(),
      ]);

      const doctorOrders = orders.filter((o) => getOrderDoctorId(o) === user.id);
      const assignedPatientIds = [...new Set(doctorOrders.map(getOrderPatientId).filter(Boolean))];
      const assigned = patients.filter((p) => assignedPatientIds.includes(getPatientId(p)));

      const pendingResults = results.filter((r) => !r.resultText);
      const today = new Date().toDateString();
      const todayAppts = (appointments || []).filter((a) => {
        const apptDate = new Date(a.appointmentDate).toDateString();
        const scheduled = a.status === 1 || a.status === 'Scheduled';
        return scheduled && apptDate === today;
      });

      const todayResults = results.filter((r) =>
        new Date(r.resultDate).toDateString() === today
      ).length;

      setStats({
        assignedPatients: assigned.length,
        pendingReviews: pendingResults.length,
        todayAppointments: todayAppts.length,
        recentResults: todayResults,
      });

      setAssignedPatients(assigned.slice(0, 5));

      const reviewList = pendingResults.slice(0, 5).map((r) => ({
        resultId: r.resultId || r.resultID,
        patientName: r.patientName || 'Unknown',
        testName: r.testName || 'N/A',
        resultDate: r.resultDate,
      }));
      setPatientsNeedingReview(reviewList);
      
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return '#27ae60';
      case 'Pending':
        return '#f39c12';
      case 'InProgress':
        return '#3498db';
      default:
        return '#95a5a6';
    }
  };

  if (loading) {
    return (
      <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
        <div style={styles.loading}>Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
        <div style={styles.error}>
          {error}
          <button onClick={loadDashboardData} style={styles.retryBtn}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.title}>Doctor Dashboard</h1>
            <p style={styles.subtitle}>
              Welcome back, Dr. <strong>{user?.name}</strong>
            </p>
          </div>
          <button onClick={logout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>👥</div>
            <div style={styles.statValue}>{stats.assignedPatients}</div>
            <div style={styles.statLabel}>Assigned Patients</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🔍</div>
            <div style={styles.statValue}>{stats.pendingReviews}</div>
            <div style={styles.statLabel}>Pending Reviews</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📅</div>
            <div style={styles.statValue}>{stats.todayAppointments}</div>
            <div style={styles.statLabel}>Today's Appointments</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🔬</div>
            <div style={styles.statValue}>{stats.recentResults}</div>
            <div style={styles.statLabel}>Recent Results</div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div style={styles.mainGrid}>
        {/* Assigned Patients */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Assigned Patients</h2>
          <div style={styles.listContainer}>
            {assignedPatients.length === 0 ? (
              <div style={styles.emptyState}>No assigned patients yet</div>
            ) : (
              assignedPatients.map((patient) => (
                <div key={getPatientId(patient)} style={styles.listItem}>
                  <div style={styles.itemHeader}>
                    <span style={styles.itemName}>{patient.fullName || patient.name}</span>
                  </div>
                  <div style={styles.itemDetails}>
                    <span>Email: {patient.email}</span>
                    <span>Phone: {patient.phone || 'N/A'}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/doctor/patients/${getPatientId(patient)}`)}
                    style={{ ...styles.actionBtn, marginTop: '8px', padding: '8px 12px', fontSize: '12px' }}
                  >
                    Open Record
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Patients Needing Review */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Patients Needing Review</h2>
          <div style={styles.listContainer}>
            {patientsNeedingReview.length === 0 ? (
              <div style={styles.emptyState}>No pending reviews</div>
            ) : (
              patientsNeedingReview.map((item) => (
                <div key={item.resultId} style={styles.listItem}>
                  <div style={styles.itemHeader}>
                    <span style={styles.itemName}>{item.patientName}</span>
                    <span style={styles.itemDate}>{formatDate(item.resultDate)}</span>
                  </div>
                  <div style={styles.itemDetails}>
                    <span>Test: {item.testName}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/doctor/results/${item.resultId}`)}
                    style={{ ...styles.actionBtn, marginTop: '8px', padding: '8px 12px', fontSize: '12px' }}
                  >
                    Review Result
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Quick Actions */}
      <section style={styles.actionsSection}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.actionButtons}>
          <button onClick={() => navigate('/doctor/patients')} style={styles.actionBtn}>View All Patients</button>
          <button onClick={() => navigate('/doctor/results')} style={styles.actionBtn}>Review Results</button>
          <button onClick={() => navigate('/doctor/appointments')} style={styles.actionBtn}>Manage Appointments</button>
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
    textAlign: 'center',
    padding: '50px',
    fontSize: '16px',
    color: '#e74c3c',
  },
  retryBtn: {
    marginLeft: '10px',
    padding: '8px 16px',
    backgroundColor: '#0bceaa',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
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
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '30px',
  },
  section: {
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
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  listItem: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(11,206,170,0.1)',
    borderRadius: '8px',
    padding: '16px',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  itemName: {
    fontWeight: '600',
    color: '#0bceaa',
  },
  itemId: {
    fontWeight: '600',
    color: '#0bceaa',
  },
  itemDate: {
    fontSize: '12px',
    color: 'rgba(232,244,240,0.5)',
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
  },
  itemDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontSize: '14px',
    color: 'rgba(232,244,240,0.7)',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: 'rgba(232,244,240,0.5)',
    fontStyle: 'italic',
  },
  actionsSection: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(11,206,170,0.2)',
    borderRadius: '12px',
    padding: '24px',
  },
  actionButtons: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
    transition: 'all 0.3s ease',
  },
};

export default DoctorDashboard;
