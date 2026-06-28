import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { resultService, aiService } from '../services/api';

const ResultDetailsPage = () => {
  const { isRTL } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    loadResultDetails();
  }, [id]);

  const loadResultDetails = async () => {
    try {
      setLoading(true);
      const data = await resultService.getById(id);
      setResult(data);
    } catch (err) {
      console.error('Failed to load result details:', err);
      setError('Failed to load result details');
    } finally {
      setLoading(false);
    }
  };

  const handleAIInterpret = async () => {
    try {
      setAnalyzing(true);
      await aiService.interpretResult(id);
      await loadResultDetails(); // Reload to get updated interpretation
    } catch (err) {
      console.error('Failed to interpret result:', err);
      setError('Failed to get AI interpretation');
    } finally {
      setAnalyzing(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getNormalRangeStatus = (value, normalRange) => {
    if (!normalRange || !value) return 'unknown';
    
    const [min, max] = normalRange.split('-').map(v => parseFloat(v.trim()));
    const numValue = parseFloat(value);
    
    if (numValue < min) return 'low';
    if (numValue > max) return 'high';
    return 'normal';
  };

  const getRangeStatusColor = (status) => {
    switch (status) {
      case 'low':
        return '#e74c3c';
      case 'high':
        return '#e67e22';
      case 'normal':
        return '#27ae60';
      default:
        return '#95a5a6';
    }
  };

  if (loading) {
    return (
      <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
        <div style={styles.loading}>Loading result details...</div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
        <div style={styles.error}>
          {error || 'Result not found'}
          <button onClick={() => navigate('/patient/results')} style={styles.retryBtn}>
            Back to Results
          </button>
        </div>
      </div>
    );
  }

  const rangeStatus = getNormalRangeStatus(result.resultValue, result.normalRange);

  return (
    <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Header */}
      <header style={styles.header}>
        <button onClick={() => navigate('/patient/results')} style={styles.backBtn}>
          ← Back to Results
        </button>
        <h1 style={styles.title}>Result Details</h1>
      </header>

      {/* Result Info Card */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Test Information</h2>
        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Result ID:</span>
            <span style={styles.infoValue}>#{result.resultId?.toString().substring(0, 8)}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Test Name:</span>
            <span style={styles.infoValue}>{result.testName || 'N/A'}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Test Date:</span>
            <span style={styles.infoValue}>{formatDate(result.resultDate)}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Status:</span>
            <span style={{
              ...styles.statusBadge,
              backgroundColor: result.resultText ? '#27ae60' : '#f39c12'
            }}>
              {result.resultText ? 'Completed' : 'Pending'}
            </span>
          </div>
        </div>
      </section>

      {/* Test Values */}
      {result.resultValue && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Test Values</h2>
          <div style={styles.valuesContainer}>
            <div style={styles.valueRow}>
              <span style={styles.valueLabel}>Result Value:</span>
              <span style={styles.valueValue}>{result.resultValue}</span>
            </div>
            {result.normalRange && (
              <div style={styles.valueRow}>
                <span style={styles.valueLabel}>Normal Range:</span>
                <span style={styles.valueValue}>{result.normalRange}</span>
              </div>
            )}
            <div style={styles.valueRow}>
              <span style={styles.valueLabel}>Status:</span>
              <span style={{
                ...styles.rangeStatus,
                color: getRangeStatusColor(rangeStatus)
              }}>
                {rangeStatus.toUpperCase()}
              </span>
            </div>
            {result.unit && (
              <div style={styles.valueRow}>
                <span style={styles.valueLabel}>Unit:</span>
                <span style={styles.valueValue}>{result.unit}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Result Text */}
      {result.resultText && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Lab Report</h2>
          <div style={styles.resultTextContainer}>
            <p style={styles.resultText}>{result.resultText}</p>
          </div>
        </section>
      )}

      {/* AI Interpretation */}
      <section style={styles.section}>
        <div style={styles.aiHeader}>
          <h2 style={styles.sectionTitle}>AI Interpretation</h2>
          {!result.aiInterpretation && result.resultText && (
            <button
              onClick={handleAIInterpret}
              disabled={analyzing}
              style={{
                ...styles.aiBtn,
                opacity: analyzing ? 0.6 : 1,
                cursor: analyzing ? 'not-allowed' : 'pointer'
              }}
            >
              {analyzing ? 'Analyzing...' : 'Analyze with AI'}
            </button>
          )}
        </div>
        {result.aiInterpretation ? (
          <div style={styles.aiContent}>
            <div style={styles.aiText}>{result.aiInterpretation}</div>
          </div>
        ) : (
          <div style={styles.aiPlaceholder}>
            <div style={styles.aiIcon}>🤖</div>
            <p style={styles.aiPlaceholderText}>
              {result.resultText 
                ? 'Click "Analyze with AI" to get an AI-powered interpretation of your results.'
                : 'AI interpretation will be available once the lab report is ready.'}
            </p>
          </div>
        )}
      </section>

      {/* Actions */}
      <section style={styles.actionsSection}>
        <button onClick={() => window.print()} style={styles.actionBtn}>
          🖨️ Print Result
        </button>
        <button onClick={() => navigate('/patient/results')} style={styles.actionBtn}>
          ← Back to All Results
        </button>
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
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  infoLabel: {
    fontSize: '12px',
    color: 'rgba(232,244,240,0.6)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  infoValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#effcfb',
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
    display: 'inline-block',
  },
  valuesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  valueRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '8px',
  },
  valueLabel: {
    fontSize: '14px',
    color: 'rgba(232,244,240,0.7)',
  },
  valueValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#effcfb',
  },
  rangeStatus: {
    fontSize: '14px',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  resultTextContainer: {
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '8px',
    padding: '20px',
  },
  resultText: {
    fontSize: '14px',
    lineHeight: '1.8',
    color: 'rgba(232,244,240,0.8)',
    margin: 0,
    whiteSpace: 'pre-wrap',
  },
  aiHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  aiBtn: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  aiContent: {
    background: 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)',
    border: '1px solid rgba(102,126,234,0.3)',
    borderRadius: '8px',
    padding: '20px',
  },
  aiText: {
    fontSize: '14px',
    lineHeight: '1.8',
    color: 'rgba(232,244,240,0.9)',
    margin: 0,
    whiteSpace: 'pre-wrap',
  },
  aiPlaceholder: {
    textAlign: 'center',
    padding: '40px 20px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '8px',
  },
  aiIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  aiPlaceholderText: {
    fontSize: '14px',
    color: 'rgba(232,244,240,0.6)',
    margin: 0,
  },
  actionsSection: {
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
};

export default ResultDetailsPage;
