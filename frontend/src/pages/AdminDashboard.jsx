import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { employeeService, patientService, doctorService, orderService } from '../services/api';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { user, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    activePatients: 0,
    activeDoctors: 0,
    pendingOrders: 0,
    completedTests: 0,
  });
  
  // Employee Management
  const [employees, setEmployees] = useState([]);
  const [employeeModal, setEmployeeModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  
  // Patient Management
  const [patients, setPatients] = useState([]);
  const [patientModal, setPatientModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  
  // Doctor Management
  const [doctors, setDoctors] = useState([]);
  const [doctorModal, setDoctorModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  
  // Order Management
  const [orders, setOrders] = useState([]);
  const [orderModal, setOrderModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load dashboard stats
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [patientsData, doctorsData, employeesData, ordersData] = await Promise.all([
        patientService.getAll().catch(() => []),
        doctorService.getAll().catch(() => []),
        employeeService.getAll().catch(() => []),
        orderService.getAll().catch(() => [])
      ]);
      
      setStats({
        activePatients: (patientsData || []).filter((p) => p.isActive !== false).length,
        activeDoctors: (doctorsData || []).filter((d) => d.isActive !== false).length,
        pendingOrders: (ordersData || []).filter((o) => o.status === 1 || o.status === 'Pending').length,
        completedTests: (ordersData || []).filter((o) => o.status === 2 || o.status === 'Completed').length,
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  // Load employees
  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (err) {
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  // Load patients
  const loadPatients = async () => {
    setLoading(true);
    try {
      const data = await patientService.getAll();
      setPatients(data);
    } catch (err) {
      setError('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  // Load doctors
  const loadDoctors = async () => {
    setLoading(true);
    try {
      const data = await doctorService.getAll();
      setDoctors(data);
    } catch (err) {
      setError('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  // Load orders
  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAll();
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError(null);
    if (tab === 'employees') loadEmployees();
    if (tab === 'patients') loadPatients();
    if (tab === 'doctors') loadDoctors();
    if (tab === 'orders') loadOrders();
  };

  // Employee CRUD
  const handleSaveEmployee = async (employeeData) => {
    try {
      if (editingEmployee) {
        await employeeService.update(editingEmployee.employeeId, employeeData);
      } else {
        await employeeService.create(employeeData);
      }
      setEmployeeModal(false);
      setEditingEmployee(null);
      loadEmployees();
      loadStats();
    } catch (err) {
      setError('Failed to save employee');
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeService.delete(id);
        loadEmployees();
        loadStats();
      } catch (err) {
        setError('Failed to delete employee');
      }
    }
  };

  // Patient CRUD
  const handleSavePatient = async (patientData) => {
    try {
      if (editingPatient) {
        await patientService.update(editingPatient.patientId, patientData);
      } else {
        await patientService.create(patientData);
      }
      setPatientModal(false);
      setEditingPatient(null);
      loadPatients();
      loadStats();
    } catch (err) {
      setError('Failed to save patient');
    }
  };

  const handleDeletePatient = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await patientService.delete(id);
        loadPatients();
        loadStats();
      } catch (err) {
        setError('Failed to delete patient');
      }
    }
  };

  // Doctor CRUD
  const handleSaveDoctor = async (doctorData) => {
    try {
      if (editingDoctor) {
        await doctorService.update(editingDoctor.doctorId, doctorData);
      } else {
        await doctorService.create(doctorData);
      }
      setDoctorModal(false);
      setEditingDoctor(null);
      loadDoctors();
      loadStats();
    } catch (err) {
      setError('Failed to save doctor');
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await doctorService.delete(id);
        loadDoctors();
        loadStats();
      } catch (err) {
        setError('Failed to delete doctor');
      }
    }
  };

  // Order CRUD
  const handleSaveOrder = async (orderData) => {
    try {
      if (editingOrder) {
        await orderService.update(editingOrder.orderId, orderData);
      } else {
        await orderService.create(orderData);
      }
      setOrderModal(false);
      setEditingOrder(null);
      loadOrders();
      loadStats();
    } catch (err) {
      setError('Failed to save order');
    }
  };

  const handleDeleteOrder = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await orderService.delete(id);
        loadOrders();
        loadStats();
      } catch (err) {
        setError('Failed to delete order');
      }
    }
  };

  return (
    <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.title}>{t('admin.welcome') || 'Admin Dashboard'}</h1>
            <p style={styles.subtitle}>
              {t('admin.loggedInAs') || 'Logged in as'}: <strong>{user?.name}</strong> ({user?.role})
            </p>
          </div>
          <button onClick={logout} style={styles.logoutBtn}>
            {t('admin.logout') || 'Logout'}
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <div style={styles.tabNav}>
        {[
          { id: 'dashboard', label: 'Dashboard', icon: '📊' },
          { id: 'employees', label: 'Employees', icon: '👥' },
          { id: 'patients', label: 'Patients', icon: '🏥' },
          { id: 'doctors', label: 'Doctors', icon: '👨‍⚕️' },
          { id: 'orders', label: 'Orders', icon: '📋' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            style={activeTab === tab.id ? styles.activeTab : styles.tab}
          >
            <span style={styles.tabIcon}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div style={styles.errorBanner}>
          {error}
          <button onClick={() => setError(null)} style={styles.errorClose}>×</button>
        </div>
      )}

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <>
          {/* Stats Grid */}
          <section style={styles.statsSection}>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>👥</div>
                <div style={styles.statValue}>{stats.activePatients}</div>
                <div style={styles.statLabel}>Active Patients</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>👨‍⚕️</div>
                <div style={styles.statValue}>{stats.activeDoctors}</div>
                <div style={styles.statLabel}>Active Doctors</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>⏳</div>
                <div style={styles.statValue}>{stats.pendingOrders}</div>
                <div style={styles.statLabel}>Pending Orders</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>✅</div>
                <div style={styles.statValue}>{stats.completedTests}</div>
                <div style={styles.statLabel}>Completed Tests</div>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section style={styles.actionsSection}>
            <h2 style={styles.sectionTitle}>Quick Actions</h2>
            <div style={styles.actionButtons}>
              <button onClick={() => handleTabChange('employees')} style={styles.actionBtn}>Manage Employees</button>
              <button onClick={() => handleTabChange('patients')} style={styles.actionBtn}>Manage Patients</button>
              <button onClick={() => handleTabChange('doctors')} style={styles.actionBtn}>Manage Doctors</button>
              <button onClick={() => handleTabChange('orders')} style={styles.actionBtn}>Manage Orders</button>
            </div>
          </section>

          {/* Additional Actions */}
          <section style={styles.actionsSection}>
            <h2 style={styles.sectionTitle}>Additional Pages</h2>
            <div style={styles.actionButtons}>
              <Link to="/admin/specializations" style={{ ...styles.actionBtn, textDecoration: 'none', display: 'block', textAlign: 'center' }}>Manage Specializations</Link>
              <Link to="/admin/reports" style={{ ...styles.actionBtn, textDecoration: 'none', display: 'block', textAlign: 'center' }}>View Reports</Link>
              <Link to="/admin/settings" style={{ ...styles.actionBtn, textDecoration: 'none', display: 'block', textAlign: 'center' }}>Settings</Link>
            </div>
          </section>
        </>
      )}

      {/* Employees Tab */}
      {activeTab === 'employees' && (
        <section style={styles.managementSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Employee Management</h2>
            <button onClick={() => { setEditingEmployee(null); setEmployeeModal(true); }} style={styles.addButton}>
              + Add Employee
            </button>
          </div>
          {loading ? (
            <div style={styles.loading}>Loading...</div>
          ) : (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Role</th>
                    <th style={styles.th}>Phone</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.employeeId}>
                      <td style={styles.td}>{emp.fullName}</td>
                      <td style={styles.td}>{emp.email}</td>
                      <td style={styles.td}>{emp.role}</td>
                      <td style={styles.td}>{emp.phone || 'N/A'}</td>
                      <td style={styles.td}>
                        <button onClick={() => { setEditingEmployee(emp); setEmployeeModal(true); }} style={styles.editBtn}>Edit</button>
                        <button onClick={() => handleDeleteEmployee(emp.employeeId)} style={styles.deleteBtn}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* Patients Tab */}
      {activeTab === 'patients' && (
        <section style={styles.managementSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Patient Management</h2>
            <button onClick={() => { setEditingPatient(null); setPatientModal(true); }} style={styles.addButton}>
              + Add Patient
            </button>
          </div>
          {loading ? (
            <div style={styles.loading}>Loading...</div>
          ) : (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>National ID</th>
                    <th style={styles.th}>Phone</th>
                    <th style={styles.th}>Blood Type</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.patientId}>
                      <td style={styles.td}>{patient.fullName}</td>
                      <td style={styles.td}>{patient.email}</td>
                      <td style={styles.td}>{patient.nationalID}</td>
                      <td style={styles.td}>{patient.phone || 'N/A'}</td>
                      <td style={styles.td}>{patient.bloodType || 'N/A'}</td>
                      <td style={styles.td}>
                        <button onClick={() => { setEditingPatient(patient); setPatientModal(true); }} style={styles.editBtn}>Edit</button>
                        <button onClick={() => handleDeletePatient(patient.patientId)} style={styles.deleteBtn}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* Doctors Tab */}
      {activeTab === 'doctors' && (
        <section style={styles.managementSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Doctor Management</h2>
            <button onClick={() => { setEditingDoctor(null); setDoctorModal(true); }} style={styles.addButton}>
              + Add Doctor
            </button>
          </div>
          {loading ? (
            <div style={styles.loading}>Loading...</div>
          ) : (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Specialization</th>
                    <th style={styles.th}>Phone</th>
                    <th style={styles.th}>Clinic</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doctor) => (
                    <tr key={doctor.doctorId}>
                      <td style={styles.td}>{doctor.fullName}</td>
                      <td style={styles.td}>{doctor.email}</td>
                      <td style={styles.td}>{doctor.specializationID || 'N/A'}</td>
                      <td style={styles.td}>{doctor.phone || 'N/A'}</td>
                      <td style={styles.td}>{doctor.clinicName || 'N/A'}</td>
                      <td style={styles.td}>
                        <button onClick={() => { setEditingDoctor(doctor); setDoctorModal(true); }} style={styles.editBtn}>Edit</button>
                        <button onClick={() => handleDeleteDoctor(doctor.doctorId)} style={styles.deleteBtn}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <section style={styles.managementSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Order Management</h2>
            <button onClick={() => { setEditingOrder(null); setOrderModal(true); }} style={styles.addButton}>
              + Add Order
            </button>
          </div>
          {loading ? (
            <div style={styles.loading}>Loading...</div>
          ) : (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Order ID</th>
                    <th style={styles.th}>Patient</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Total</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.orderId}>
                      <td style={styles.td}>#{order.orderId?.toString().substring(0, 8)}</td>
                      <td style={styles.td}>{order.patient?.fullName || 'N/A'}</td>
                      <td style={styles.td}>{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td style={styles.td}>{order.status}</td>
                      <td style={styles.td}>${order.totalAmount}</td>
                      <td style={styles.td}>
                        <button onClick={() => { setEditingOrder(order); setOrderModal(true); }} style={styles.editBtn}>Edit</button>
                        <button onClick={() => handleDeleteOrder(order.orderId)} style={styles.deleteBtn}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* Employee Modal */}
      {employeeModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>{editingEmployee ? 'Edit Employee' : 'Add Employee'}</h3>
            <EmployeeForm
              employee={editingEmployee}
              onSave={handleSaveEmployee}
              onCancel={() => { setEmployeeModal(false); setEditingEmployee(null); }}
            />
          </div>
        </div>
      )}

      {/* Patient Modal */}
      {patientModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>{editingPatient ? 'Edit Patient' : 'Add Patient'}</h3>
            <PatientForm
              patient={editingPatient}
              onSave={handleSavePatient}
              onCancel={() => { setPatientModal(false); setEditingPatient(null); }}
            />
          </div>
        </div>
      )}

      {/* Doctor Modal */}
      {doctorModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>{editingDoctor ? 'Edit Doctor' : 'Add Doctor'}</h3>
            <DoctorForm
              doctor={editingDoctor}
              onSave={handleSaveDoctor}
              onCancel={() => { setDoctorModal(false); setEditingDoctor(null); }}
            />
          </div>
        </div>
      )}

      {/* Order Modal */}
      {orderModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>{editingOrder ? 'Edit Order' : 'Add Order'}</h3>
            <OrderForm
              order={editingOrder}
              onSave={handleSaveOrder}
              onCancel={() => { setOrderModal(false); setEditingOrder(null); }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Form Components
const EmployeeForm = ({ employee, onSave, onCancel }) => {
  const [formData, setFormData] = React.useState(employee || {
    fullName: '',
    email: '',
    phone: '',
    role: 'Receptionist'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Full Name</label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          style={styles.input}
          required
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          style={styles.input}
          required
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Phone</label>
        <input
          type="text"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Role</label>
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          style={styles.input}
          required
        >
          <option value="Admin">Admin</option>
          <option value="Technician">Technician</option>
          <option value="Receptionist">Receptionist</option>
        </select>
      </div>
      <div style={styles.formActions}>
        <button type="button" onClick={onCancel} style={styles.cancelBtn}>Cancel</button>
        <button type="submit" style={styles.saveBtn}>Save</button>
      </div>
    </form>
  );
};

const PatientForm = ({ patient, onSave, onCancel }) => {
  const [formData, setFormData] = React.useState(patient || {
    fullName: '',
    email: '',
    nationalID: '',
    phone: '',
    bloodType: '',
    gender: 0,
    dateOfBirth: '',
    address: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Full Name</label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          style={styles.input}
          required
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          style={styles.input}
          required
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>National ID</label>
        <input
          type="text"
          value={formData.nationalID}
          onChange={(e) => setFormData({ ...formData, nationalID: e.target.value })}
          style={styles.input}
          required
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Phone</label>
        <input
          type="text"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Blood Type</label>
        <select
          value={formData.bloodType}
          onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
      </div>
      <div style={styles.formActions}>
        <button type="button" onClick={onCancel} style={styles.cancelBtn}>Cancel</button>
        <button type="submit" style={styles.saveBtn}>Save</button>
      </div>
    </form>
  );
};

const DoctorForm = ({ doctor, onSave, onCancel }) => {
  const [formData, setFormData] = React.useState(doctor || {
    fullName: '',
    email: '',
    phone: '',
    specializationID: 1,
    clinicName: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Full Name</label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          style={styles.input}
          required
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          style={styles.input}
          required
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Phone</label>
        <input
          type="text"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Specialization ID</label>
        <input
          type="number"
          value={formData.specializationID}
          onChange={(e) => setFormData({ ...formData, specializationID: parseInt(e.target.value) })}
          style={styles.input}
          required
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Clinic Name</label>
        <input
          type="text"
          value={formData.clinicName}
          onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
          style={styles.input}
        />
      </div>
      <div style={styles.formActions}>
        <button type="button" onClick={onCancel} style={styles.cancelBtn}>Cancel</button>
        <button type="submit" style={styles.saveBtn}>Save</button>
      </div>
    </form>
  );
};

const OrderForm = ({ order, onSave, onCancel }) => {
  const [formData, setFormData] = React.useState(order || {
    patientId: '',
    status: 'Pending',
    totalAmount: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Patient ID</label>
        <input
          type="text"
          value={formData.patientId}
          onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
          style={styles.input}
          required
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          style={styles.input}
          required
        >
          <option value="Pending">Pending</option>
          <option value="InProgress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Total Amount</label>
        <input
          type="number"
          value={formData.totalAmount}
          onChange={(e) => setFormData({ ...formData, totalAmount: parseFloat(e.target.value) })}
          style={styles.input}
          required
        />
      </div>
      <div style={styles.formActions}>
        <button type="button" onClick={onCancel} style={styles.cancelBtn}>Cancel</button>
        <button type="submit" style={styles.saveBtn}>Save</button>
      </div>
    </form>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at top left, rgba(11,206,170,.14), transparent 22%), radial-gradient(circle at top right, rgba(11,206,170,.08), transparent 20%), linear-gradient(180deg, #03111c 0%, #04111e 100%)',
    padding: '20px',
    color: '#e8f4f0',
  },
  header: {
    marginBottom: '30px',
    padding: '20px 0',
    borderBottom: '1px solid rgba(11,206,170,0.2)',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '15px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 8px 0',
    color: '#effcfb',
  },
  subtitle: {
    fontSize: '14px',
    color: 'rgba(232,244,240,0.7)',
    margin: 0,
  },
  logoutBtn: {
    padding: '10px 24px',
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
  statsSection: {
    marginBottom: '30px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
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
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px',
  },
  activitySection: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(11,206,170,0.2)',
    borderRadius: '12px',
    padding: '24px',
  },
  actionsSection: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(11,206,170,0.2)',
    borderRadius: '12px',
    padding: '24px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 20px 0',
    color: '#effcfb',
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '8px',
  },
  activityDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#0bceaa',
    flexShrink: 0,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    margin: '0 0 4px 0',
    fontSize: '14px',
    color: '#e8f4f0',
  },
  activityTime: {
    fontSize: '12px',
    color: 'rgba(232,244,240,0.5)',
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  actionBtn: {
    padding: '14px 20px',
    background: 'rgba(11,206,170,0.1)',
    border: '1px solid rgba(11,206,170,0.3)',
    borderRadius: '8px',
    color: '#0bceaa',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'left',
    transition: 'all 0.3s ease',
  },
  
  // Tab Navigation
  tabNav: {
    display: 'flex',
    gap: '8px',
    marginBottom: '30px',
    flexWrap: 'wrap',
  },
  tab: {
    padding: '12px 20px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(11,206,170,0.14)',
    borderRadius: '8px',
    color: 'rgba(232,244,240,0.7)',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  activeTab: {
    padding: '12px 20px',
    background: 'rgba(11,206,170,0.15)',
    border: '1px solid rgba(11,206,170,0.4)',
    borderRadius: '8px',
    color: '#0bceaa',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  tabIcon: {
    fontSize: '16px',
  },
  
  // Error Banner
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
  
  // Management Section
  managementSection: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(11,206,170,0.2)',
    borderRadius: '12px',
    padding: '24px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
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
  
  // Table
  tableContainer: {
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
  
  // Loading
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: 'rgba(232,244,240,0.7)',
  },
  
  // Modal
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
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '24px',
    color: '#effcfb',
  },
  
  // Form
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

export default AdminDashboard;
