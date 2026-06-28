import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { labTestService, orderService } from '../services/api';
import { normalizeLabTest } from '../utils/labTest';

const BookTestPage = () => {
  const { isRTL } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [labTests, setLabTests] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLabTests();
  }, []);

  const loadLabTests = async () => {
    try {
      setLoading(true);
      const tests = await labTestService.getAll();
      setLabTests((tests || []).map(normalizeLabTest));
    } catch (err) {
      console.error('Failed to load lab tests:', err);
      setError('Failed to load available tests');
    } finally {
      setLoading(false);
    }
  };

  const toggleTestSelection = (test) => {
    setSelectedTests(prev => {
      const exists = prev.find(t => t.testId === test.testId);
      if (exists) {
        return prev.filter(t => t.testId !== test.testId);
      } else {
        return [...prev, test];
      }
    });
  };

  const handleSubmitOrder = async () => {
    if (selectedTests.length === 0) {
      setError('Please select at least one test');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const orderData = {
        patientId: user.id,
        orderDate: new Date().toISOString(),
        status: 'Pending',
        totalAmount: selectedTests.reduce((sum, test) => sum + (test.price || 0), 0),
        orderDetails: selectedTests.map(test => ({
          testId: test.testId,
          testName: test.testName,
          price: test.price
        }))
      };

      const order = await orderService.create(orderData);
      navigate(`/patient/orders/${order.orderId}`);
    } catch (err) {
      console.error('Failed to create order:', err);
      setError('Failed to create order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getTotalAmount = () => {
    return selectedTests.reduce((sum, test) => sum + (test.price || 0), 0);
  };

  if (loading) {
    return (
      <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
        <div style={styles.loading}>Loading available tests...</div>
      </div>
    );
  }

  return (
    <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Header */}
      <header style={styles.header}>
        <button onClick={() => navigate('/patient')} style={styles.backBtn}>
          ← Back to Dashboard
        </button>
        <h1 style={styles.title}>Book Lab Tests</h1>
      </header>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {/* Tests Grid */}
      <section style={styles.testsSection}>
        <h2 style={styles.sectionTitle}>Available Tests</h2>
        <div style={styles.testsGrid}>
          {labTests.length === 0 ? (
            <div style={styles.emptyState}>No tests available</div>
          ) : (
            labTests.map((test) => {
              const isSelected = selectedTests.find(t => t.testId === test.testId);
              return (
                <div
                  key={test.testId}
                  style={{
                    ...styles.testCard,
                    borderColor: isSelected ? '#0bceaa' : 'rgba(11,206,170,0.2)',
                    backgroundColor: isSelected ? 'rgba(11,206,170,0.1)' : 'rgba(255,255,255,0.04)'
                  }}
                  onClick={() => toggleTestSelection(test)}
                >
                  <div style={styles.testHeader}>
                    <h3 style={styles.testName}>{test.testName}</h3>
                    <div style={{
                      ...styles.checkbox,
                      backgroundColor: isSelected ? '#0bceaa' : 'transparent'
                    }}>
                      {isSelected && <span style={styles.checkmark}>✓</span>}
                    </div>
                  </div>
                  <p style={styles.testDescription}>{test.description || 'No description available'}</p>
                  <div style={styles.testFooter}>
                    <span style={styles.testPrice}>${test.price || 0}</span>
                    <span style={styles.testDuration}>⏱ {test.duration}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); toggleTestSelection(test); }}
                    style={{
                      ...styles.addBtn,
                      backgroundColor: isSelected ? '#0bceaa' : 'rgba(11,206,170,0.1)',
                      color: isSelected ? '#04111e' : '#0bceaa',
                    }}
                  >
                    {isSelected ? '✓ Added' : 'Add to Order'}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Order Summary */}
      {selectedTests.length > 0 && (
        <section style={styles.summarySection}>
          <h2 style={styles.sectionTitle}>Order Summary</h2>
          <div style={styles.summaryCard}>
            <div style={styles.summaryList}>
              {selectedTests.map((test) => (
                <div key={test.testId} style={styles.summaryItem}>
                  <span style={styles.summaryItemName}>{test.testName}</span>
                  <span style={styles.summaryItemPrice}>${test.price || 0}</span>
                </div>
              ))}
            </div>
            <div style={styles.summaryTotal}>
              <span style={styles.totalLabel}>Total Amount:</span>
              <span style={styles.totalValue}>${getTotalAmount()}</span>
            </div>
            <button
              onClick={handleSubmitOrder}
              disabled={submitting}
              style={{
                ...styles.submitBtn,
                opacity: submitting ? 0.6 : 1,
                cursor: submitting ? 'not-allowed' : 'pointer'
              }}
            >
              {submitting ? 'Creating Order...' : 'Submit Order'}
            </button>
          </div>
        </section>
      )}
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
  testsSection: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    margin: '0 0 20px 0',
    color: '#effcfb',
  },
  testsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: 'rgba(232,244,240,0.5)',
    fontStyle: 'italic',
  },
  testCard: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(11,206,170,0.2)',
    borderRadius: '12px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  testHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  testName: {
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
    color: '#effcfb',
    flex: 1,
  },
  checkbox: {
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    border: '2px solid #0bceaa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '12px',
  },
  checkmark: {
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  testDescription: {
    fontSize: '14px',
    color: 'rgba(232,244,240,0.7)',
    margin: '0 0 16px 0',
    lineHeight: '1.5',
  },
  testFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  testPrice: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0bceaa',
  },
  testCategory: {
    fontSize: '12px',
    color: 'rgba(232,244,240,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  testDuration: {
    fontSize: '12px',
    color: 'rgba(232,244,240,0.75)',
  },
  addBtn: {
    marginTop: '12px',
    width: '100%',
    padding: '10px',
    border: '1px solid rgba(11,206,170,0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
  },
  summarySection: {
    position: 'sticky',
    bottom: '20px',
    maxWidth: '400px',
    marginLeft: 'auto',
  },
  summaryCard: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(11,206,170,0.3)',
    borderRadius: '12px',
    padding: '20px',
  },
  summaryList: {
    marginBottom: '16px',
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid rgba(11,206,170,0.1)',
  },
  summaryItemName: {
    fontSize: '14px',
    color: 'rgba(232,244,240,0.8)',
  },
  summaryItemPrice: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#0bceaa',
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 0',
    borderTop: '2px solid rgba(11,206,170,0.3)',
    marginBottom: '16px',
  },
  totalLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#effcfb',
  },
  totalValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#0bceaa',
  },
  submitBtn: {
    width: '100%',
    padding: '14px 20px',
    background: '#0bceaa',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
};

export default BookTestPage;
