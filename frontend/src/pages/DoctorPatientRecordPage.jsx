import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { patientService, orderService, resultService, appointmentService } from '../services/api';

const DoctorPatientRecordPage = () => {
  const { isRTL } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [patient, setPatient] = useState(null);
  const [orders, setOrders] = useState([]);
  const [results, setResults] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPatientData();
  }, [id]);

  const loadPatientData = async () => {
    try {
      setLoading(true);
      
      const [patientData, ordersData, resultsData, appointmentsData] = await Promise.all([
        patientService.getById(id),
        orderService.getByPatient(id),
        resultService.getAll().then(data => data.filter(r => r.patientId === id)),
        appointmentService.getByPatient(id)
      ]);
      
      setPatient(patientData);
      setOrders(ordersData || []);
      setResults(resultsData || []);
      setAppointments(appointmentsData || []);
    } catch (err) {
      console.error('Failed to load patient data:', err);
      setError('Failed to load patient record');
    } finally {
      setLoading(false);
    }
  };

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
      case 'Cancelled':
        return '#e74c3c';
      case 'Scheduled':
        return '#27ae60';
      default:
        return '#95a5a6';
    }
  };

  if (loading) {
    return (
      <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
        <div style={styles.loading}>Loading patient record...</div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
        <div style={styles.error}>
          {error || 'Patient not found'}
          <button onClick={() => navigate('/doctor/patients')} style={styles.retryBtn}>
            Back to Patients
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Header */}
      <header style={styles.header}>
        <button onClick={() => navigate('/doctor/patients')} style={styles.backBtn}>
          ← Back to Patients
        </button>
        <h1 style={styles.title}>Patient Record</h1>
      </header>

      {/* Patient Info Card */}
      <section style={styles.patientInfoSection}>
        <div style={styles.patientCard}>
          <div style={styles.patientAvatar}>
            {patient.name ? patient.name.charAt(0).toUpperCase() : 'P'}
          </div>
          <div style={styles.patientDetails}>
            <h2 style={styles.patientName}>{patient.name || 'N/A'}</h2>
            <p style={styles.patientEmail}>{patient.email || 'N/A'}</p>
            <div style={styles.patientMeta}>
              <span style={styles.metaItem}>📞 {patient.phone || 'N/A'}</span>
              <span style={styles.metaItem}>🎂 {patient.dateOfBirth ? formatDate(patient.dateOfBirth) : 'N/A'}</span>
              <span style={styles.metaItem}>🩸 {patient.bloodType || 'N/A'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section style={styles.tabsSection}>
        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              ...styles.tab,
              backgroundColor: activeTab === 'overview' ? 'rgba(11,206,170,0.2)' : 'transparent',
              borderColor: activeTab === 'overview' ? '#0bceaa' : 'transparent'
            }}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              ...styles.tab,
              backgroundColor: activeTab === 'orders' ? 'rgba(11,206,170,0.2)' : 'transparent',
              borderColor: activeTab === 'orders' ? '#0bceaa' : 'transparent'
            }}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('results')}
            style={{
              ...styles.tab,
              backgroundColor: activeTab === 'results' ? 'rgba(11,206,170,0.2)' : 'transparent',
              borderColor: activeTab === 'results' ? '#0bceaa' : 'transparent'
            }}
          >
            Results ({results.length})
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            style={{
              ...styles.tab,
              backgroundColor: activeTab === 'appointments' ? 'rgba(11,206,170,0.2)' : 'transparent',
              borderColor: activeTab === 'appointments' ? '#0bceaa' : 'transparent'
            }}
          >
            Appointments ({appointments.length})
          </button>
        </div>
      </section>

      {/* Tab Content */}
      <section style={styles.contentSection}>
        {activeTab === 'overview' && (
          <div style={styles.overviewGrid}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>📋</div>
              <div style={styles.statValue}>{orders.length}</div>
              <div style={styles.statLabel}>Total Orders</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>📊</div>
              <div style={styles.statValue}>{results.length}</div>
              <div style={styles.statLabel}>Test Results</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>📅</div>
              <div style={styles.statValue}>{appointments.length}</div>
              <div style={styles.statLabel}>Appointments</div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div style={styles.listContainer}>
            {orders.length === 0 ? (
              <div style={styles.emptyState}>No orders found</div>
            ) : (
              orders.map((order) => (
                <div key={order.orderId} style={styles.listItem}>
                  <div style={styles.itemHeader}>
                    <span style={styles.itemId}>Order #{order.orderId?.toString().substring(0, 8)}</span>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(order.status)
                    }}>
                      {order.status}
                    </span>
                  </div>
                  <div style={styles.itemDetails}>
                    <span>Date: {formatDate(order.orderDate)}</span>
                    <span>Tests: {order.orderDetails?.length || 0}</span>
                    <span>Total: ${order.totalAmount}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'results' && (
          <div style={styles.listContainer}>
            {results.length === 0 ? (
              <div style={styles.emptyState}>No results found</div>
            ) : (
              results.map((result) => (
                <div key={result.resultId} style={styles.listItem}>
                  <div style={styles.itemHeader}>
                    <span style={styles.itemId}>Result #{result.resultId?.toString().substring(0, 8)}</span>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: result.resultText ? '#27ae60' : '#f39c12'
                    }}>
                      {result.resultText ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                  <div style={styles.itemDetails}>
                    <span>Test: {result.testName || 'N/A'}</span>
                    <span>Date: {formatDate(result.resultDate)}</span>
                    {result.resultValue && <span>Value: {result.resultValue}</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'appointments' && (
          <div style={styles.listContainer}>
            {appointments.length === 0 ? (
              <div style={styles.emptyState}>No appointments found</div>
            ) : (
              appointments.map((appointment) => (
                <div key={appointment.appointmentId} style={styles.listItem}>
                  <div style={styles.itemHeader}>
                    <span style={styles.itemId}>Appt #{appointment.appointmentId?.toString().substring(0, 8)}</span>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(appointment.status)
                    }}>
                      {appointment.status}
                    </span>
                  </div>
                  <div style={styles.itemDetails}>
                    <span>Date: {formatDate(appointment.appointmentDate)}</span>
                    <span>Doctor: {appointment.doctorName || 'N/A'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
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
  patientInfoSection: {
    marginBottom: '24px',
  },
  patientCard: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(11,206,170,0.2)',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  patientAvatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #0bceaa 0%, #08a085 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    fontWeight: '700',
    color: 'white',
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: '24px',
    fontWeight: '600',
    margin: '0 0 8px 0',
    color: '#effcfb',
  },
  patientEmail: {
    fontSize: '14px',
    color: 'rgba(232,244,240,0.7)',
    margin: '0 0 12px 0',
  },
  patientMeta: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  metaItem: {
    fontSize: '13px',
    color: 'rgba(232,244,240,0.6)',
  },
  tabsSection: {
    marginBottom: '24px',
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    borderBottom: '1px solid rgba(11,206,170,0.2)',
    paddingBottom: '0',
  },
  tab: {
    padding: '12px 24px',
    background: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: 'rgba(232,244,240,0.7)',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },
  contentSection: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(11,206,170,0.2)',
    borderRadius: '12px',
    padding: '24px',
    minHeight: '300px',
  },
  overviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  statCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(11,206,170,0.1)',
    borderRadius: '8px',
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
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: 'rgba(232,244,240,0.5)',
    fontStyle: 'italic',
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
  itemId: {
    fontWeight: '600',
    color: '#0bceaa',
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
};

export default DoctorPatientRecordPage;
