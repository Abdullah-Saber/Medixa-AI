import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { resultService } from '../services/api';

const DoctorReviewResultDetailsPage = () => {
  const { isRTL } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadResult();
  }, [id]);

  const loadResult = async () => {
    try {
      setLoading(true);
      const data = await resultService.getById(id);
      setResult(data);
      setReviewNotes(data?.resultText || '');
    } catch (err) {
      console.error('Failed to load result:', err);
      setError('Failed to load result details');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setSaving(true);
      setError(null);
      await resultService.update(id, {
        ...result,
        resultText: reviewNotes || 'Reviewed and approved by doctor.',
      });
      setSuccess('Result reviewed successfully');
      setTimeout(() => navigate('/doctor/results'), 1500);
    } catch (err) {
      console.error('Failed to save review:', err);
      setError('Failed to save review');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  if (loading) {
    return (
      <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
        <div style={styles.loading}>Loading result...</div>
      </div>
    );
  }

  if (error && !result) {
    return (
      <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
        <div style={styles.error}>
          {error}
          <button onClick={() => navigate('/doctor/results')} style={styles.backLink}>
            Back to Results
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
      <header style={styles.header}>
        <button onClick={() => navigate('/doctor/results')} style={styles.backBtn}>
          ← Back to Review Results
        </button>
        <h1 style={styles.title}>Review Result</h1>
      </header>

      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Result Information</h2>
        <div style={styles.infoGrid}>
          <div><span style={styles.label}>Patient:</span> {result.patientName || 'N/A'}</div>
          <div><span style={styles.label}>Test:</span> {result.testName || 'N/A'}</div>
          <div><span style={styles.label}>Date:</span> {formatDate(result.resultDate)}</div>
          <div><span style={styles.label}>Value:</span> {result.resultValue || 'N/A'}</div>
          {result.normalRange && (
            <div><span style={styles.label}>Normal Range:</span> {result.normalRange}</div>
          )}
        </div>
      </section>

      {result.aiInterpretation && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>AI Interpretation</h2>
          <p style={styles.text}>{result.aiInterpretation}</p>
        </section>
      )}

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Doctor Review Notes</h2>
        <textarea
          value={reviewNotes}
          onChange={(e) => setReviewNotes(e.target.value)}
          placeholder="Add clinical notes or approval comments..."
          rows={5}
          style={styles.textarea}
        />
        <button
          onClick={handleApprove}
          disabled={saving}
          style={{ ...styles.approveBtn, opacity: saving ? 0.6 : 1 }}
        >
          {saving ? 'Saving...' : 'Approve & Complete Review'}
        </button>
      </section>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #03111c 0%, #04111e 100%)',
    padding: '20px',
    color: '#e8f4f0',
  },
  loading: { textAlign: 'center', padding: '50px', color: '#0bceaa' },
  header: { marginBottom: '24px' },
  backBtn: {
    padding: '10px 20px',
    background: 'rgba(11,206,170,0.1)',
    border: '1px solid rgba(11,206,170,0.3)',
    borderRadius: '8px',
    color: '#0bceaa',
    cursor: 'pointer',
    marginBottom: '12px',
  },
  title: { fontSize: '28px', fontWeight: '700', margin: 0 },
  section: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(11,206,170,0.2)',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '20px',
  },
  sectionTitle: { fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0' },
  infoGrid: { display: 'grid', gap: '10px', fontSize: '14px' },
  label: { color: '#0bceaa', fontWeight: '600', marginRight: '8px' },
  text: { lineHeight: 1.6, color: 'rgba(232,244,240,0.85)' },
  textarea: {
    width: '100%',
    padding: '14px',
    borderRadius: '8px',
    border: '1px solid rgba(11,206,170,0.2)',
    background: 'rgba(255,255,255,0.04)',
    color: '#e8f4f0',
    fontSize: '14px',
    resize: 'vertical',
    boxSizing: 'border-box',
    marginBottom: '16px',
  },
  approveBtn: {
    padding: '12px 24px',
    background: '#0bceaa',
    color: '#04111e',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  error: {
    background: 'rgba(231,76,60,0.1)',
    border: '1px solid #e74c3c',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '16px',
    color: '#e74c3c',
  },
  success: {
    background: 'rgba(39,174,96,0.1)',
    border: '1px solid #27ae60',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '16px',
    color: '#27ae60',
  },
  backLink: {
    marginLeft: '12px',
    padding: '6px 12px',
    background: '#0bceaa',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default DoctorReviewResultDetailsPage;
