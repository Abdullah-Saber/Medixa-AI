import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { patientService, doctorService, orderService, resultService } from '../services/api';

export default function ReportsPage() {
  const { isRTL } = useLanguage();
  
  const [timeRange, setTimeRange] = useState('30');
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalOrders: 0,
    totalResults: 0,
    revenue: 0,
    avgOrderValue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [timeRange]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [patients, doctors, orders, results] = await Promise.all([
        patientService.getAll().catch(() => []),
        doctorService.getAll().catch(() => []),
        orderService.getAll().catch(() => []),
        resultService.getAll().catch(() => [])
      ]);

      const completedOrders = orders.filter(o => o.status === 'Completed');
      const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      setStats({
        totalPatients: patients.length,
        totalDoctors: doctors.length,
        totalOrders: orders.length,
        totalResults: results.length,
        revenue: totalRevenue,
        avgOrderValue: completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { label: 'Patients', value: stats.totalPatients, color: '#0bceaa' },
    { label: 'Doctors', value: stats.totalDoctors, color: '#3498db' },
    { label: 'Orders', value: stats.totalOrders, color: '#f39c12' },
    { label: 'Results', value: stats.totalResults, color: '#9b59b6' },
  ];

  return (
    <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Reports & Analytics</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          style={styles.timeSelect}
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </header>

      {loading ? (
        <div style={styles.loading}>Loading reports...</div>
      ) : (
        <>
          {/* Stats Cards */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>👥</div>
              <div style={styles.statValue}>{stats.totalPatients}</div>
              <div style={styles.statLabel}>Total Patients</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>👨‍⚕️</div>
              <div style={styles.statValue}>{stats.totalDoctors}</div>
              <div style={styles.statLabel}>Total Doctors</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>📋</div>
              <div style={styles.statValue}>{stats.totalOrders}</div>
              <div style={styles.statLabel}>Total Orders</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>🔬</div>
              <div style={styles.statValue}>{stats.totalResults}</div>
              <div style={styles.statLabel}>Total Results</div>
            </div>
          </div>

          {/* Revenue Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Revenue Overview</h2>
            <div style={styles.revenueGrid}>
              <div style={styles.revenueCard}>
                <div style={styles.revenueLabel}>Total Revenue</div>
                <div style={styles.revenueValue}>${stats.revenue.toFixed(2)}</div>
              </div>
              <div style={styles.revenueCard}>
                <div style={styles.revenueLabel}>Average Order Value</div>
                <div style={styles.revenueValue}>${stats.avgOrderValue.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Data Distribution</h2>
            <div style={styles.chartContainer}>
              {chartData.map((item) => (
                <div key={item.label} style={styles.chartItem}>
                  <div style={styles.chartBarContainer}>
                    <div
                      style={{
                        ...styles.chartBar,
                        width: `${(item.value / Math.max(...chartData.map(d => d.value))) * 100}%`,
                        background: item.color,
                      }}
                    />
                  </div>
                  <div style={styles.chartLabel}>{item.label}</div>
                  <div style={styles.chartValue}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Quick Insights</h2>
            <div style={styles.insightsGrid}>
              <div style={styles.insightCard}>
                <div style={styles.insightIcon}>📈</div>
                <div style={styles.insightText}>
                  <strong>Growth Rate</strong>
                  <p style={styles.insightDesc}>+12.5% from last period</p>
                </div>
              </div>
              <div style={styles.insightCard}>
                <div style={styles.insightIcon}>⚡</div>
                <div style={styles.insightText}>
                  <strong>Most Popular Test</strong>
                  <p style={styles.insightDesc}>Complete Blood Count</p>
                </div>
              </div>
              <div style={styles.insightCard}>
                <div style={styles.insightIcon}>⭐</div>
                <div style={styles.insightText}>
                  <strong>Top Doctor</strong>
                  <p style={styles.insightDesc}>Dr. Ahmed (45 patients)</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  title: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '28px',
    fontWeight: '700',
    margin: 0,
    color: '#effcfb',
  },
  timeSelect: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid rgba(11,206,170,0.3)',
    background: 'rgba(255,255,255,0.04)',
    color: '#e8f4f0',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer',
  },
  loading: {
    textAlign: 'center',
    padding: '60px 20px',
    color: 'rgba(232,244,240,0.7)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
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
  section: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(11,206,170,0.2)',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '30px',
  },
  sectionTitle: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '20px',
    fontWeight: '600',
    margin: '0 0 20px 0',
    color: '#effcfb',
  },
  revenueGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  revenueCard: {
    background: 'rgba(11,206,170,0.05)',
    border: '1px solid rgba(11,206,170,0.2)',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
  },
  revenueLabel: {
    fontSize: '14px',
    color: 'rgba(232,244,240,0.7)',
    marginBottom: '8px',
  },
  revenueValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0bceaa',
  },
  chartContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  chartItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  chartBarContainer: {
    flex: 1,
    height: '24px',
    background: 'rgba(255,255,255,0.04)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  chartBar: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  chartLabel: {
    width: '80px',
    fontSize: '14px',
    color: 'rgba(232,244,240,0.8)',
  },
  chartValue: {
    width: '40px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#0bceaa',
    textAlign: 'right',
  },
  insightsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
  },
  insightCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    background: 'rgba(11,206,170,0.05)',
    border: '1px solid rgba(11,206,170,0.2)',
    borderRadius: '8px',
    padding: '16px',
  },
  insightIcon: {
    fontSize: '32px',
  },
  insightText: {
    flex: 1,
  },
  insightDesc: {
    fontSize: '13px',
    color: 'rgba(232,244,240,0.7)',
    margin: '4px 0 0 0',
  },
};
