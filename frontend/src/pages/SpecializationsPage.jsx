import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

import { specializationService } from '../services/api';

export default function SpecializationsPage() {

  const { isRTL } = useLanguage();
  
  const [specializations, setSpecializations] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSpecialization, setEditingSpecialization] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    specializationName: '',
    description: ''
  });

  useEffect(() => {
    loadSpecializations();
  }, []);

  const loadSpecializations = async () => {
    setLoading(true);
    try {
      // UI fallback: reuse a lab tests endpoint shape if specialization APIs are missing.
      // If this page is used for specializations management, backend should expose specializationService.
      const data = await specializationService.getAll();

      setSpecializations((data || []).map((s) => ({
        specializationID: s.specializationID ?? s.id,
        specializationName: s.name,
        description: s.description || '',
        isActive: s.isActive,
      })));


    } catch (err) {
      setError('Failed to load specializations');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.specializationName,
        description: formData.description,
        isActive: true,
      };

      if (editingSpecialization) {
        await specializationService.update(editingSpecialization.specializationID, payload);
      } else {
        await specializationService.create(payload);
      }

      setModalOpen(false);
      setEditingSpecialization(null);
      setFormData({ specializationName: '', description: '' });
      loadSpecializations();
    } catch (err) {
      console.error(err);
      setError('Failed to save specialization');
    }
  };


  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this specialization?')) {
      try {
        await specializationService.delete(id);
        loadSpecializations();
      } catch (err) {
        console.error(err);
        setError('Failed to delete specialization');
      }
    }
  };


  const openModal = (spec = null) => {
    if (spec) {
      setEditingSpecialization(spec);
      setFormData({
        specializationName: spec.specializationName,
        description: spec.description || ''
      });
    } else {
      setEditingSpecialization(null);
      setFormData({ specializationName: '', description: '' });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSpecialization(null);
    setFormData({ specializationName: '', description: '' });
  };

  return (
    <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Specializations Management</h1>
        <button onClick={() => openModal()} style={styles.addButton}>
          + Add Specialization
        </button>
      </header>

      {error && (
        <div style={styles.errorBanner}>
          {error}
          <button onClick={() => setError(null)} style={styles.errorClose}>×</button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div style={styles.loading}>Loading...</div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {specializations.map((spec) => (
                <tr key={spec.specializationID}>
                  <td style={styles.td}>{spec.specializationID}</td>
                  <td style={styles.td}>{spec.specializationName}</td>
                  <td style={styles.td}>{spec.description || 'N/A'}</td>
                  <td style={styles.td}>
                    <button onClick={() => openModal(spec)} style={styles.editBtn}>Edit</button>
                    <button onClick={() => handleDelete(spec.specializationID)} style={styles.deleteBtn}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>
              {editingSpecialization ? 'Edit Specialization' : 'Add Specialization'}
            </h3>
            <form onSubmit={handleSave} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Specialization Name</label>
                <input
                  type="text"
                  value={formData.specializationName}
                  onChange={(e) => setFormData({ ...formData, specializationName: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={styles.textarea}
                  rows={3}
                />
              </div>
              <div style={styles.formActions}>
                <button type="button" onClick={closeModal} style={styles.cancelBtn}>Cancel</button>
                <button type="submit" style={styles.saveBtn}>Save</button>
              </div>
            </form>
          </div>
        </div>
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
  addButton: {
    padding: '10px 20px',
    background: '#0bceaa',
    color: '#04111e',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
  errorBanner: {
    background: 'rgba(231, 76, 60, 0.1)',
    border: '1px solid #e74c3c',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '20px',
    color: '#e74c3c',
    fontSize: '14px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorClose: {
    background: 'none',
    border: 'none',
    color: '#e74c3c',
    fontSize: '20px',
    cursor: 'pointer',
    padding: 0,
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: 'rgba(232,244,240,0.7)',
  },
  tableContainer: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(11,206,170,0.2)',
    borderRadius: '12px',
    padding: '24px',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    borderBottom: '2px solid rgba(11,206,170,0.3)',
    color: '#0bceaa',
    fontWeight: '600',
    fontSize: '14px',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid rgba(11,206,170,0.1)',
    color: '#e8f4f0',
    fontSize: '14px',
  },
  editBtn: {
    padding: '6px 12px',
    background: 'rgba(52, 152, 219, 0.2)',
    border: '1px solid #3498db',
    borderRadius: '4px',
    color: '#3498db',
    cursor: 'pointer',
    fontSize: '12px',
    marginRight: '8px',
  },
  deleteBtn: {
    padding: '6px 12px',
    background: 'rgba(231, 76, 60, 0.2)',
    border: '1px solid #e74c3c',
    borderRadius: '4px',
    color: '#e74c3c',
    cursor: 'pointer',
    fontSize: '12px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: 'rgba(4,17,30,0.98)',
    border: '1px solid rgba(11,206,170,0.3)',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '500px',
    width: '90%',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '24px',
    color: '#effcfb',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'rgba(232,244,240,0.8)',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid rgba(11,206,170,0.3)',
    background: 'rgba(255,255,255,0.04)',
    color: '#e8f4f0',
    fontSize: '14px',
    outline: 'none',
  },
  textarea: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid rgba(11,206,170,0.3)',
    background: 'rgba(255,255,255,0.04)',
    color: '#e8f4f0',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
  },
  formActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  cancelBtn: {
    flex: 1,
    padding: '12px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(11,206,170,0.3)',
    borderRadius: '8px',
    color: '#e8f4f0',
    cursor: 'pointer',
    fontSize: '14px',
  },
  saveBtn: {
    flex: 1,
    padding: '12px',
    background: '#0bceaa',
    border: 'none',
    borderRadius: '8px',
    color: '#04111e',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
};
