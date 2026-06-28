import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';

const PatientOrdersPage = () => {
  const { isRTL } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [user.id]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getByPatient(user.id);
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
      setError('Failed to load orders');
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
        <div style={styles.loading}>Loading orders...</div>
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
        <h1 style={styles.title}>My Orders</h1>
        <button onClick={() => navigate('/patient/book-test')} style={styles.newOrderBtn}>
          + New Order
        </button>
      </header>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {/* Orders Table */}
      <section style={styles.tableSection}>
        {orders.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📋</div>
            <h3 style={styles.emptyTitle}>No Orders Found</h3>
            <p style={styles.emptyText}>You haven't placed any lab test orders yet.</p>
            <button onClick={() => navigate('/patient/book-test')} style={styles.emptyBtn}>
              Book Your First Test
            </button>
          </div>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.tableHead}>Order ID</th>
                  <th style={styles.tableHead}>Date</th>
                  <th style={styles.tableHead}>Tests</th>
                  <th style={styles.tableHead}>Total</th>
                  <th style={styles.tableHead}>Status</th>
                  <th style={styles.tableHead}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.orderId} style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <span style={styles.orderId}>#{order.orderId?.toString().substring(0, 8)}</span>
                    </td>
                    <td style={styles.tableCell}>{formatDate(order.orderDate)}</td>
                    <td style={styles.tableCell}>{order.orderDetails?.length || 0} tests</td>
                    <td style={styles.tableCell}>${order.totalAmount}</td>
                    <td style={styles.tableCell}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: getStatusColor(order.status)
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      <button
                        onClick={() => navigate(`/patient/orders/${order.orderId}`)}
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
  newOrderBtn: {
    padding: '10px 20px',
    background: '#0bceaa',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
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
    margin: '0 0 20px 0',
  },
  emptyBtn: {
    padding: '12px 24px',
    background: '#0bceaa',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
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
  orderId: {
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

export default PatientOrdersPage;
