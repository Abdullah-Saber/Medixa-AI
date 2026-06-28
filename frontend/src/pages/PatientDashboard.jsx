import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { orderService, resultService, appointmentService } from '../services/api';

const normalizeStatus = (status) => {
  if (status === 1 || status === 'Pending') return 'Pending';
  if (status === 2 || status === 'Completed') return 'Completed';
  if (status === 3 || status === 'Cancelled') return 'Cancelled';
  return status || 'Pending';
};

const getResultPatientId = (r) => r.patientId || r.patientID || r.PatientID;

const PatientDashboard = () => {
  const { isRTL } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    activeOrders: 0,
    completedOrders: 0,
    availableResults: 0,
    upcomingAppointments: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      const [orders, allResults, appointments] = await Promise.all([
        orderService.getByPatient(user.id),
        resultService.getAll(),
        appointmentService.getByPatient(user.id),
      ]);

      const results = (allResults || []).filter((r) => getResultPatientId(r) === user.id);
      const now = new Date();

      const activeOrders = orders.filter((o) => {
        const s = normalizeStatus(o.status);
        return s === 'Pending' || s === 'InProgress';
      }).length;

      const completedOrders = orders.filter((o) => normalizeStatus(o.status) === 'Completed').length;
      const availableResults = results.filter((r) => r.resultText || r.resultValue).length;
      const upcomingAppointments = (appointments || []).filter((a) => {
        const s = a.status === 1 || a.status === 'Scheduled' ? 'Scheduled' : a.status;
        return s === 'Scheduled' && new Date(a.appointmentDate) >= now;
      }).length;

      setStats({ activeOrders, completedOrders, availableResults, upcomingAppointments });

      const sortedOrders = [...orders]
        .sort((a, b) => new Date(b.orderDate || b.OrderDate) - new Date(a.orderDate || a.OrderDate))
        .slice(0, 5);
      setRecentOrders(sortedOrders);

      const sortedResults = [...results]
        .sort((a, b) => new Date(b.resultDate) - new Date(a.resultDate))
        .slice(0, 5);
      setRecentResults(sortedResults);

      const activity = [
        ...orders.map((o) => ({
          id: `order-${o.orderId || o.orderID}`,
          type: 'Order',
          label: `Order #${String(o.orderId || o.orderID).substring(0, 8)}`,
          detail: normalizeStatus(o.status),
          date: o.orderDate || o.OrderDate,
        })),
        ...results.map((r) => ({
          id: `result-${r.resultId || r.resultID}`,
          type: 'Result',
          label: r.testName || 'Test Result',
          detail: r.resultText ? 'Available' : 'Pending',
          date: r.resultDate,
        })),
        ...(appointments || []).map((a) => ({
          id: `appt-${a.appointmentId || a.appointmentID}`,
          type: 'Appointment',
          label: a.purpose || 'Appointment',
          detail: a.status === 1 || a.status === 'Scheduled' ? 'Scheduled' : a.status,
          date: a.appointmentDate,
        })),
      ]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 8);
      setRecentActivity(activity);
      
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
            <h1 style={styles.title}>Patient Dashboard</h1>
            <p style={styles.subtitle}>
              Welcome back, <strong>{user?.name}</strong>
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
            <div style={styles.statIcon}>📋</div>
            <div style={styles.statValue}>{stats.activeOrders}</div>
            <div style={styles.statLabel}>Active Orders</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>✅</div>
            <div style={styles.statValue}>{stats.completedOrders}</div>
            <div style={styles.statLabel}>Completed Orders</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📊</div>
            <div style={styles.statValue}>{stats.availableResults}</div>
            <div style={styles.statLabel}>Available Results</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📅</div>
            <div style={styles.statValue}>{stats.upcomingAppointments}</div>
            <div style={styles.statLabel}>Upcoming Appointments</div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div style={styles.mainGrid}>
        {/* Recent Orders */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Recent Orders</h2>
          <div style={styles.listContainer}>
            {recentOrders.length === 0 ? (
              <div style={styles.emptyState}>No orders found</div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.orderId} style={styles.listItem}>
                  <div style={styles.itemHeader}>
                    <span style={styles.itemId}>Order #{order.orderId?.toString().substring(0, 8)}</span>
                    <span 
                      style={{ 
                        ...styles.statusBadge, 
                        backgroundColor: getStatusColor(order.status) 
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div style={styles.itemDetails}>
                    <span>Order Date: {formatDate(order.orderDate)}</span>
                    <span>Tests: {order.orderDetails?.length || 0}</span>
                    <span>Total: ${order.totalAmount}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Recent Results */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Recent Results</h2>
          <div style={styles.listContainer}>
            {recentResults.length === 0 ? (
              <div style={styles.emptyState}>No results found</div>
            ) : (
              recentResults.map((result) => (
                <div key={result.resultId} style={styles.listItem}>
                  <div style={styles.itemHeader}>
                    <span style={styles.itemId}>Result #{result.resultId?.toString().substring(0, 8)}</span>
                    <span 
                      style={{ 
                        ...styles.statusBadge, 
                        backgroundColor: result.resultText ? '#27ae60' : '#f39c12' 
                      }}
                    >
                      {result.resultText ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                  <div style={styles.itemDetails}>
                    <span>Test Date: {formatDate(result.resultDate)}</span>
                    <span>Value: {result.resultValue}</span>
                    {result.resultText && (
                      <span style={styles.resultText}>{result.resultText.substring(0, 50)}...</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Recent Activity */}
      <section style={{ ...styles.section, marginBottom: '30px' }}>
        <h2 style={styles.sectionTitle}>Recent Activity</h2>
        <div style={styles.listContainer}>
          {recentActivity.length === 0 ? (
            <div style={styles.emptyState}>No recent activity</div>
          ) : (
            recentActivity.map((item) => (
              <div key={item.id} style={styles.listItem}>
                <div style={styles.itemHeader}>
                  <span style={styles.itemId}>{item.type}: {item.label}</span>
                  <span style={{ ...styles.statusBadge, backgroundColor: '#3498db' }}>{item.detail}</span>
                </div>
                <div style={styles.itemDetails}>
                  <span>{formatDate(item.date)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section style={styles.actionsSection}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.actionButtons}>
          <button onClick={() => navigate('/patient/lab-tests')} style={styles.actionBtn}>Browse Lab Tests</button>
          <button onClick={() => navigate('/patient/book-test')} style={styles.actionBtn}>Book Test</button>
          <button onClick={() => navigate('/patient/orders')} style={styles.actionBtn}>View All Orders</button>
          <button onClick={() => navigate('/patient/results')} style={styles.actionBtn}>View All Results</button>
          <button onClick={() => navigate('/patient/appointments')} style={styles.actionBtn}>Book Appointment</button>
          <button onClick={() => navigate('/patient/profile')} style={styles.actionBtn}>Update Profile</button>
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
  resultText: {
    color: '#27ae60',
    fontStyle: 'italic',
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

export default PatientDashboard;
