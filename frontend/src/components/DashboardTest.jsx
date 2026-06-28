import React, { useState } from 'react';

const DashboardTest = () => {
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), message }]);
  };

  const testMVC = (route, name) => {
    addLog(`Testing MVC ${name}...`);
    window.open(`http://localhost:5230${route}`, '_blank');
    addLog(`Opened ${name} in new tab`);
  };

  const testReact = (route, name) => {
    addLog(`Testing React ${name}...`);
    window.open(`http://localhost:5175${route}`, '_blank');
    addLog(`Opened ${name} in new tab`);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Dashboard Testing</h2>
      
      <div style={{ marginBottom: '30px' }}>
        <h3>MVC Dashboards (Backend)</h3>
        <button onClick={() => testMVC('/StaffDashboard', 'Staff Dashboard')} style={{ padding: '10px 20px', marginRight: '10px', marginBottom: '10px' }}>
          Test Staff Dashboard
        </button>
        <button onClick={() => testMVC('/DoctorDashboard', 'Doctor Dashboard')} style={{ padding: '10px 20px', marginRight: '10px', marginBottom: '10px' }}>
          Test Doctor Dashboard
        </button>
        <button onClick={() => testMVC('/PatientDashboard', 'Patient Dashboard')} style={{ padding: '10px 20px', marginBottom: '10px' }}>
          Test Patient Dashboard
        </button>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h3>React Dashboards (Frontend)</h3>
        <button onClick={() => testReact('/admin', 'Admin Dashboard')} style={{ padding: '10px 20px', marginRight: '10px', marginBottom: '10px' }}>
          Test Admin Dashboard
        </button>
        <button onClick={() => testReact('/patient', 'Patient Dashboard')} style={{ padding: '10px 20px', marginRight: '10px', marginBottom: '10px' }}>
          Test Patient Dashboard
        </button>
        <button onClick={() => testReact('/doctor', 'Doctor Dashboard')} style={{ padding: '10px 20px', marginBottom: '10px' }}>
          Test Doctor Dashboard
        </button>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h3>Other Pages</h3>
        <button onClick={() => testReact('/', 'Home Page')} style={{ padding: '10px 20px', marginRight: '10px', marginBottom: '10px' }}>
          Test Home Page
        </button>
        <button onClick={() => testReact('/login', 'Login Page')} style={{ padding: '10px 20px', marginRight: '10px', marginBottom: '10px' }}>
          Test Login Page
        </button>
        <button onClick={() => testReact('/register', 'Register Page')} style={{ padding: '10px 20px', marginBottom: '10px' }}>
          Test Register Page
        </button>
      </div>
      
      <div style={{ background: '#f0f0f0', padding: '10px', maxHeight: '400px', overflow: 'auto' }}>
        <h3>Test Log</h3>
        {logs.map((log, i) => (
          <div key={i} style={{ marginBottom: '5px' }}>
            <span style={{ color: '#666' }}>[{log.time}]</span> {log.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardTest;
