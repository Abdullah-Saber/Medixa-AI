import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { appointmentService } from '../services/api';

export default function AppointmentDetailsPage() {
  const { isRTL } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAppointment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadAppointment = async () => {
    try {
      setLoading(true);
      setError(null);

      // API can differ by implementation; try getById first.
      const data = await appointmentService.getById(id);

      setAppointment(data || null);

    } catch (e) {
      console.error('Failed to load appointment details:', e);
      setError('Failed to load appointment details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => (dateString ? new Date(dateString).toLocaleDateString() : 'N/A');
  const formatTime = (dateString) =>
    dateString ? new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A';

  if (loading) {
    return (
      <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
        <div style={styles.loading}>Loading appointment details...</div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
        <div style={styles.error}>
          {error || 'Appointment not found'}
          <button onClick={() => navigate(-1)} style={styles.backBtn}>
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
      <header style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          ← Back
        </button>
        <h1 style={styles.title}>Appointment Details</h1>
      </header>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Appointment Information</h2>
        <div style={styles.grid}>
          <div style={styles.item}>
            <span style={styles.label}>Appointment ID</span>
            <span style={styles.value}>#{String(appointment.appointmentId ?? id).substring(0, 8)}</span>
          </div>

          <div style={styles.item}>
            <span style={styles.label}>Doctor</span>
            <span style={styles.value}>{appointment.doctorName || 'N/A'}</span>
          </div>

          <div style={styles.item}>
            <span style={styles.label}>Patient</span>
            <span style={styles.value}>{appointment.patientName || 'N/A'}</span>
          </div>

          <div style={styles.item}>
            <span style={styles.label}>Date</span>
            <span style={styles.value}>{formatDate(appointment.appointmentDate)}</span>
          </div>

          <div style={styles.item}>
            <span style={styles.label}>Time</span>
            <span style={styles.value}>{formatTime(appointment.appointmentDate)}</span>
          </div>

          <div style={styles.item}>
            <span style={styles.label}>Status</span>
            <span style={{ ...styles.value, color: styles.statusColor(appointment.status) }}>{appointment.status || 'N/A'}</span>
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Notes</h2>
        <p style={styles.noteText}>
          {appointment.notes || 'No notes provided for this appointment.'}
        </p>
      </section>
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
  backBtn: {
    marginTop: '16px',
    padding: '10px 20px',
    background: 'rgba(11,206,170,0.1)',
    border: '1px solid rgba(11,206,170,0.3)',
    borderRadius: '8px',
    color: '#0bceaa',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    display: 'inline-block',
  },
  header: {
    marginBottom: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '15px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    margin: 0,
    color: '#effcfb',
  },
  section: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(11,206,170,0.2)',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 20px 0',
    color: '#effcfb',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '14px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(11,206,170,0.1)',
  },
  label: {
    fontSize: '12px',
    color: 'rgba(232,244,240,0.6)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: '600',
  },
  value: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#effcfb',
    wordBreak: 'break-word',
  },
  noteText: {
    margin: 0,
    color: 'rgba(232,244,240,0.78)',
    lineHeight: 1.7,
    fontSize: '14px',
    whiteSpace: 'pre-wrap',
  },
  statusColor: (status) => {
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
  },
};

