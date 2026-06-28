import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { labTestService } from '../services/api';

export default function LabTestsPage() {
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTests();
  }, []);

  useEffect(() => {
    filterTests();
  }, [tests, selectedCategory, searchTerm]);

  const loadTests = async () => {
    try {
      setLoading(true);
      const data = await labTestService.getAll();
      setTests(data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(test => test.category || 'General'))];
      setCategories(['All', ...uniqueCategories]);
    } catch (err) {
      setError('Failed to load lab tests');
    } finally {
      setLoading(false);
    }
  };

  const filterTests = () => {
    let filtered = tests;
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(test => test.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(test => 
        test.testName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredTests(filtered);
  };

  const handleBookTest = (testId) => {
    navigate('/patient/book-test', { state: { testId } });
  };

  if (loading) {
    return (
      <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
        <div style={styles.loading}>Loading lab tests...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
        <div style={styles.error}>
          {error}
          <button onClick={loadTests} style={styles.retryBtn}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Lab Tests Catalog</h1>
        <p style={styles.subtitle}>Browse and book laboratory tests</p>
      </header>

      {/* Search and Filter */}
      <div style={styles.filterSection}>
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Search tests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        
        <div style={styles.categoryFilter}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={selectedCategory === category ? styles.activeCategoryBtn : styles.categoryBtn}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Tests Grid */}
      <div style={styles.testsGrid}>
        {filteredTests.length === 0 ? (
          <div style={styles.noResults}>
            <div style={styles.noResultsIcon}>🔍</div>
            <p style={styles.noResultsText}>No tests found matching your criteria.</p>
          </div>
        ) : (
          filteredTests.map(test => (
            <div key={test.testId} style={styles.testCard}>
              <div style={styles.testIcon}>🔬</div>
              <h3 style={styles.testName}>{test.testName}</h3>
              <p style={styles.testDescription}>{test.description || 'No description available'}</p>
              <div style={styles.testMeta}>
                <span style={styles.testPrice}>${test.price || 'N/A'}</span>
                <span style={styles.testCategory}>{test.category || 'General'}</span>
              </div>
              <button
                onClick={() => handleBookTest(test.testId)}
                style={styles.bookBtn}
              >
                Book Test
              </button>
            </div>
          ))
        )}
      </div>
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
    marginBottom: '30px',
    textAlign: 'center',
  },
  title: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '32px',
    fontWeight: '700',
    margin: '0 0 8px 0',
    color: '#effcfb',
  },
  subtitle: {
    fontSize: '14px',
    color: 'rgba(232,244,240,0.7)',
    margin: 0,
  },
  loading: {
    textAlign: 'center',
    padding: '60px 20px',
    color: 'rgba(232,244,240,0.7)',
  },
  error: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#e74c3c',
  },
  retryBtn: {
    marginTop: '16px',
    padding: '10px 20px',
    background: '#0bceaa',
    color: '#04111e',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  filterSection: {
    marginBottom: '30px',
  },
  searchBox: {
    marginBottom: '20px',
  },
  searchInput: {
    width: '100%',
    maxWidth: '400px',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid rgba(11,206,170,0.3)',
    background: 'rgba(255,255,255,0.04)',
    color: '#e8f4f0',
    fontSize: '14px',
    outline: 'none',
  },
  categoryFilter: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  categoryBtn: {
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(11,206,170,0.14)',
    borderRadius: '20px',
    color: 'rgba(232,244,240,0.7)',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },
  activeCategoryBtn: {
    padding: '8px 16px',
    background: 'rgba(11,206,170,0.15)',
    border: '1px solid rgba(11,206,170,0.4)',
    borderRadius: '20px',
    color: '#0bceaa',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
  testsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  testCard: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(11,206,170,0.14)',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  testIcon: {
    fontSize: '32px',
  },
  testName: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '18px',
    fontWeight: '600',
    margin: 0,
    color: '#effcfb',
  },
  testDescription: {
    fontSize: '13px',
    lineHeight: '1.6',
    color: 'rgba(232,244,240,0.7)',
    margin: 0,
    flex: 1,
  },
  testMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '12px',
    borderTop: '1px solid rgba(11,206,170,0.1)',
  },
  testPrice: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0bceaa',
  },
  testCategory: {
    fontSize: '12px',
    color: 'rgba(232,244,240,0.5)',
  },
  bookBtn: {
    padding: '10px 20px',
    background: '#0bceaa',
    color: '#04111e',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'background 0.3s ease',
  },
  noResults: {
    textAlign: 'center',
    padding: '60px 20px',
    gridColumn: '1 / -1',
  },
  noResultsIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  noResultsText: {
    fontSize: '14px',
    color: 'rgba(232,244,240,0.7)',
  },
};
