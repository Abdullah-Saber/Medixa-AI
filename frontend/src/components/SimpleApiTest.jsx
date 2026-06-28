import React, { useState } from 'react';

const SimpleApiTest = () => {
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), message }]);
  };

  const testEndpoint = async (url, name) => {
    addLog(`Testing ${name}...`);
    try {
      const response = await fetch(url);
      const data = await response.json();
      addLog(`✅ ${name} SUCCESS: ${JSON.stringify(data).substring(0, 100)}...`);
    } catch (error) {
      addLog(`❌ ${name} FAILED: ${error.message}`);
    }
  };

  const runTests = () => {
    testEndpoint('http://localhost:5230/api/health', 'Health API');
    testEndpoint('http://localhost:5230/api/patient', 'Patient API');
    testEndpoint('http://localhost:5230/api/employee', 'Employee API');
    testEndpoint('http://localhost:5230/api/doctor', 'Doctor API');
    testEndpoint('http://localhost:5230/api/order', 'Order API');
    testEndpoint('http://localhost:5230/api/result', 'Result API');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Simple API Test</h2>
      <button onClick={runTests} style={{ padding: '10px 20px', marginBottom: '20px' }}>
        Run API Tests
      </button>
      <div style={{ background: '#f0f0f0', padding: '10px', maxHeight: '400px', overflow: 'auto' }}>
        {logs.map((log, i) => (
          <div key={i} style={{ marginBottom: '5px' }}>
            <span style={{ color: '#666' }}>[{log.time}]</span> {log.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleApiTest;
