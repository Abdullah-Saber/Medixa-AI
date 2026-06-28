import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { orderService, resultService } from '../services/api';

const OrderDetailsPage = () => {
  const { isRTL } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrderDetails();
  }, [id]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const orderData = await orderService.getById(id);
      setOrder(orderData);
      
      // Load results for this order
      const resultsData = await resultService.getByOrder(id);
      setResults(resultsData || []);
    } catch (err) {
      console.error('Failed to load order details:', err);
      setError('Failed to load order details');
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
      default:
        return '#95a5a6';
    }
  };

  if (loading) {
    return (
      <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
        <div style={styles.loading}>Loading order details...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
        <div style={styles.error}>
          {error || 'Order not found'}
          <button onClick={() => navigate('/patient/orders')} style={styles.retryBtn}>
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Header */}
      <header style={styles.header}>
        <button onClick={() => navigate('/patient/orders')} style={styles.backBtn}>
          ← Back to Orders
        </button>
        <h1 style={styles.title}>Order Details</h1>
      </header>

      {/* Order Info Card */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Order Information</h2>
        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Order ID:</span>
            <span style={styles.infoValue}>#{order.orderId?.toString().substring(0, 8)}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Order Date:</span>
            <span style={styles.infoValue}>{formatDate(order.orderDate)}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Status:</span>
            <span style={{
              ...styles.statusBadge,
              backgroundColor: getStatusColor(order.status)
            }}>
              {order.status}
            </span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Total Amount:</span>
            <span style={styles.infoValue}>${order.totalAmount}</span>
          </div>
        </div>
      </section>

      {/* Tests Included */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Tests Included ({order.orderDetails?.length || 0})</h2>
        <div style={styles.testsList}>
          {order.orderDetails?.map((detail, index) => (
            <div key={index} style={styles.testItem}>
              <div style={styles.testInfo}>
                <h3 style={styles.testName}>{detail.testName}</h3>
                <span style={styles.testPrice}>${detail.price}</span>
              </div>
              {results[index] && (
                <div style={styles.resultStatus}>
                  <span style={{
                    ...styles.resultBadge,
                    backgroundColor: results[index].resultText ? '#27ae60' : '#f39c12'
                  }}>
                    {results[index].resultText ? 'Result Ready' : 'Pending'}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Results */}
      {results.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Test Results</h2>
          <div style={styles.resultsList}>
            {results.map((result) => (
              <div key={result.resultId} style={styles.resultItem}>
                <div style={styles.resultHeader}>
                  <span style={styles.resultId}>Result #{result.resultId?.toString().substring(0, 8)}</span>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: result.resultText ? '#27ae60' : '#f39c12'
                  }}>
                    {result.resultText ? 'Completed' : 'Pending'}
                  </span>
                </div>
                <div style={styles.resultDetails}>
                  <span style={styles.resultLabel}>Test Date: {formatDate(result.resultDate)}</span>
                  {result.resultValue && (
                    <span style={styles.resultLabel}>Value: {result.resultValue}</span>
                  )}
                  {result.resultText && (
                    <button
                      onClick={() => navigate(`/patient/results/${result.resultId}`)}
                      style={styles.viewResultBtn}
                    >
                      View Full Result
                    </button>
                  )}
                </div>
              </div>
            ))}
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
  testsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  testItem: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(11,206,170,0.1)',
    borderRadius: '8px',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  testInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  testName: {
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
    color: '#effcfb',
  },
  testPrice: {
    fontSize: '14px',
    color: '#0bceaa',
  },
  resultStatus: {
    marginLeft: '12px',
  },
  resultBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
  },
  resultsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  resultItem: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(11,206,170,0.1)',
    borderRadius: '8px',
    padding: '16px',
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  resultId: {
    fontWeight: '600',
    color: '#0bceaa',
  },
  resultDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  resultLabel: {
    fontSize: '14px',
    color: 'rgba(232,244,240,0.7)',
  },
  viewResultBtn: {
    padding: '8px 16px',
    background: 'rgba(11,206,170,0.1)',
    border: '1px solid rgba(11,206,170,0.3)',
    borderRadius: '6px',
    color: '#0bceaa',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
    alignSelf: 'flex-start',
    marginTop: '8px',
  },
};

export default OrderDetailsPage;
