import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';

export default function BookAppointmentPage() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Blood Tests',
    date: '',
    time: '',
    notes: '',
  });

  const services = [
    'Blood Tests',
    'Urine Analysis',
    'Biochemistry Tests',
    'Hormone Profiling',
    'Infectious Disease Screening',
  ];

  // Working hours: 11 AM to 11 PM
  const timeSlots = [
    '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM',
    '01:00 PM', '01:30 PM',
    '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM',
    '05:00 PM', '05:30 PM',
    '06:00 PM', '06:30 PM',
    '07:00 PM', '07:30 PM',
    '08:00 PM', '08:30 PM',
    '09:00 PM', '09:30 PM',
    '10:00 PM', '10:30 PM',
    '11:00 PM',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ ...styles.page, direction: isRTL ? 'rtl' : 'ltr' }}>
      <div style={styles.card}>
        <div style={styles.badge}>{t('booking.title')}</div>
        <h1 style={styles.title}>{t('booking.subtitle')}</h1>
        <p style={styles.subtitle}>
          {t('booking.description') || 'Choose a convenient time for your test and get fast, accurate results from our certified lab specialists.'}
        </p>

        {submitted ? (
          <div style={styles.successBox}>
            <h2 style={styles.successTitle}>{t('booking.successTitle') || 'Appointment Request Sent'}</h2>
            <p style={styles.successText}>
              {t('booking.successMessage', { name: form.name }) || `Thank you, ${form.name || 'there'}! We received your appointment details and will contact you soon to confirm.`}
            </p>
            <div style={styles.successActions}>
              <Link to="/services" style={styles.linkSecondary}>
                Back to Services
              </Link>
              <button style={styles.ctaButton} onClick={() => setSubmitted(false)}>
                Book Another
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name</label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Phone Number</label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="01xxxxxxxxx"
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Service</label>
                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  style={styles.input}
                >
                  {services.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Preferred Date</label>
                <input
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Preferred Time</label>
                <select
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  style={styles.input}
                  required
                >
                  <option value="">Select a time</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.formGroupFull}>
              <label style={styles.label}>Additional Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Any special requests or symptoms"
                style={styles.textarea}
                rows={4}
              />
            </div>

            <div style={styles.formActions}>
              <button type="submit" style={styles.submitButton}>
                Submit Appointment Request
              </button>
              <Link to="/services" style={styles.linkSecondary}>
                Back to Services
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    padding: '80px 24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'radial-gradient(circle at top left, rgba(11,206,170,.16), transparent 22%), linear-gradient(180deg, #03111c 0%, #04131e 100%)',
    color: '#e8f4f0',
  },
  card: {
    width: '100%',
    maxWidth: '760px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(11,206,170,0.14)',
    borderRadius: '28px',
    padding: '44px',
    boxShadow: '0 40px 120px rgba(0,0,0,0.24)',
    backdropFilter: 'blur(18px)',
  },
  badge: {
    display: 'inline-flex',
    padding: '10px 18px',
    borderRadius: '999px',
    background: 'rgba(11,206,170,0.14)',
    color: '#0bceaa',
    fontWeight: 700,
    letterSpacing: '0.4px',
    marginBottom: '24px',
  },
  title: {
    margin: 0,
    fontSize: '44px',
    fontWeight: 800,
    lineHeight: 1.05,
    marginBottom: '20px',
  },
  subtitle: {
    fontSize: '18px',
    color: 'rgba(232,244,240,0.82)',
    lineHeight: 1.7,
    maxWidth: '700px',
    marginBottom: '36px',
  },
  steps: {
    display: 'grid',
    gap: '20px',
    marginBottom: '38px',
  },
  step: {
    display: 'flex',
    gap: '18px',
    alignItems: 'flex-start',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '24px',
  },
  stepNumber: {
    minWidth: '44px',
    minHeight: '44px',
    borderRadius: '50%',
    background: 'rgba(11,206,170,0.18)',
    color: '#0bceaa',
    display: 'grid',
    placeItems: 'center',
    fontWeight: 700,
    fontSize: '16px',
  },
  stepTitle: {
    margin: '0 0 6px 0',
    fontSize: '18px',
    fontWeight: 700,
    color: '#f8fcfb',
  },
  stepText: {
    margin: 0,
    color: 'rgba(232,244,240,0.78)',
    lineHeight: 1.7,
  },
  ctaRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    alignItems: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '22px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  formGroupFull: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  label: {
    color: 'rgba(232,244,240,0.86)',
    fontSize: '14px',
    fontWeight: 600,
  },
  input: {
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.04)',
    color: '#effcfb',
    fontSize: '15px',
    padding: '14px 16px',
    outline: 'none',
  },
  textarea: {
    borderRadius: '18px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.04)',
    color: '#effcfb',
    fontSize: '15px',
    padding: '14px 16px',
    outline: 'none',
    resize: 'vertical',
  },
  formActions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    alignItems: 'center',
  },
  submitButton: {
    border: 'none',
    borderRadius: '18px',
    padding: '16px 38px',
    background: 'linear-gradient(135deg, #0bceaa 0%, #09b494 100%)',
    color: '#04111e',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 18px 40px rgba(11,206,170,0.24)',
  },
  linkSecondary: {
    color: '#a6f1e0',
    textDecoration: 'none',
    fontWeight: 600,
  },
  ctaButton: {
    border: 'none',
    borderRadius: '16px',
    padding: '15px 34px',
    background: 'linear-gradient(135deg, #0bceaa 0%, #09b494 100%)',
    color: '#04111e',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 18px 40px rgba(11,206,170,0.24)',
  },
  successBox: {
    padding: '40px',
    borderRadius: '24px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(11,206,170,0.12)',
    textAlign: 'center',
  },
  successTitle: {
    fontSize: '34px',
    margin: '0 0 16px',
    color: '#f8fcfb',
  },
  successText: {
    margin: '0 0 28px',
    color: 'rgba(232,244,240,0.84)',
    lineHeight: 1.75,
  },
  successActions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '18px',
    flexWrap: 'wrap',
  },
};
