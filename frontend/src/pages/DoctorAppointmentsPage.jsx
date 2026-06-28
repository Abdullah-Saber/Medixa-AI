import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { appointmentService } from '../services/api';

const DoctorAppointmentsPage = () => {
  const { isRTL } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, scheduled, completed, cancelled

  useEffect(() => {
    loadAppointments();
  }, [user.id]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAll();
      // Filter appointments for this doctor
      const doctorAppointments = data.filter(a => a.doctorId === user.id);
      setAppointments(doctorAppointments || []);
    } catch (err) {
      console.error('Failed to load appointments:', err);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    return appointment.status.toLowerCase() === filter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled':
        return '#27ae60';
      case 'Completed':
        return '#3498db';
      case 'Cancelled':
        return '#e74c3c';
      case 'Pending':
        return '#f39c12';
      default:
        return '#95a5a6';
    }
  };

  if (loading) {
    return (
      <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
        <div style={styles.loading}>Loading appointments...</div>
      </div>
    );
  }

  return (
    <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Header */}
      <header style={styles.header}>
        <button onClick={() => navigate('/doctor')} style={styles.backBtn}>
          ← Back to Dashboard
        </button>
        <h1 style={styles.title}>My Appointments</h1>
      </header>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {/* Filter Tabs */}
      <section style={styles.filterSection}>
        <button
          onClick={() => setFilter('all')}
          style={{
            ...styles.filterBtn,
            backgroundColor: filter === 'all' ? 'rgba(11,206,170,0.2)' : 'transparent',
            borderColor: filter === 'all' ? '#0bceaa' : 'rgba(11,206,170,0.2)'
          }}
        >
          All ({appointments.length})
        </button>
        <button
          onClick={() => setFilter('scheduled')}
          style={{
            ...styles.filterBtn,
            backgroundColor: filter === 'scheduled' ? 'rgba(11,206,170,0.2)' : 'transparent',
            borderColor: filter === 'scheduled' ? '#0bceaa' : 'rgba(11,206,170,0.2)'
          }}
        >
          Scheduled ({appointments.filter(a => a.status === 'Scheduled').length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          style={{
            ...styles.filterBtn,
            backgroundColor: filter === 'completed' ? 'rgba(11,206,170,0.2)' : 'transparent',
            borderColor: filter === 'completed' ? '#0bceaa' : 'rgba(11,206,170,0.2)'
          }}
        >
          Completed ({appointments.filter(a => a.status === 'Completed').length})
        </button>
        <button
          onClick={() => setFilter('cancelled')}
          style={{
            ...styles.filterBtn,
            backgroundColor: filter === 'cancelled' ? 'rgba(11,206,170,0.2)' : 'transparent',
            borderColor: filter === 'cancelled' ? '#0bceaa' : 'rgba(11,206,170,0.2)'
          }}
        >
          Cancelled ({appointments.filter(a => a.status === 'Cancelled').length})
        </button>
      </section>

      {/* Appointments Table */}
      <section style={styles.tableSection}>
        {filteredAppointments.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📅</div>
            <h3 style={styles.emptyTitle}>No Appointments Found</h3>
            <p style={styles.emptyText}>
              {filter === 'all' 
                ? 'You have no appointments scheduled.'
                : `No ${filter} appointments found.`}
            </p>
          </div>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.tableHead}>Appointment ID</th>
                  <th style={styles.tableHead}>Patient</th>
                  <th style={styles.tableHead}>Date</th>
                  <th style={styles.tableHead}>Time</th>
                  <th style={styles.tableHead}>Status</th>
                  <th style={styles.tableHead}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.appointmentId} style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <span style={styles.appointmentId}>
                        #{appointment.appointmentId?.toString().substring(0, 8)}
                      </span>
                    </td>
                    <td style={styles.tableCell}>{appointment.patientName || 'N/A'}</td>
                    <td style={styles.tableCell}>{formatDate(appointment.appointmentDate)}</td>
                    <td style={styles.tableCell}>{formatTime(appointment.appointmentDate)}</td>
                    <td style={styles.tableCell}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: getStatusColor(appointment.status)
                      }}>
                        {appointment.status}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      <button
                        onClick={() => navigate(`/doctor/appointments/${appointment.appointmentId}`)}
                        style={styles.viewBtn}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    border: '1px solid #e74c3c',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '20px',
    color: '#e74c3c',
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
  filterSection: {
    marginBottom: '20px',
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  filterBtn: {
    padding: '10px 20px',
    background: 'transparent',
    border: '1px solid rgba(11,206,170,0.2)',
    borderRadius: '8px',
    color: 'rgba(232,244,240,0.7)',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  tableSection: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(11,206,170,0.2)',
    borderRadius: '12px',
    padding: '24px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '20px',
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '600',
    margin: '0 0 10px 0',
    color: '#effcfb',
  },
  emptyText: {
    fontSize: '14px',
    color: 'rgba(232,244,240,0.7)',
    margin: 0,
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    borderBottom: '2px solid rgba(11,206,170,0.3)',
  },
  tableHead: {
    padding: '16px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '600',
    color: '#effcfb',
    borderBottom: '1px solid rgba(11,206,170,0.2)',
  },
  tableRow: {
    borderBottom: '1px solid rgba(11,206,170,0.1)',
    transition: 'background 0.2s ease',
  },
  tableCell: {
    padding: '16px',
    fontSize: '14px',
    color: 'rgba(232,244,240,0.8)',
  },
  appointmentId: {
    color: '#0bceaa',
    fontWeight: '600',
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
  },
  viewBtn: {
    padding: '8px 16px',
    background: 'rgba(11,206,170,0.1)',
    border: '1px solid rgba(11,206,170,0.3)',
    borderRadius: '6px',
    color: '#0bceaa',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
  },
};

export default DoctorAppointmentsPage;
