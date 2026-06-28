import React, { useState } from 'react';
import { authService } from '../services/api';

const AuthTest = () => {
  const [logs, setLogs] = useState([]);
  const [email, setEmail] = useState('admin@medixa.com');
  const [password, setPassword] = useState('admin123');

  const addLog = (message) => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), message }]);
  };

  const testLogin = async () => {
    addLog(`Testing login with ${email}...`);
    try {
      const response = await authService.login({ email, password, role: 'Admin' });
      addLog(`✅ Login SUCCESS: Token received`);
      addLog(`User: ${response.fullName}, Role: ${response.role}`);
      addLog(`Token (first 50 chars): ${response.token.substring(0, 50)}...`);
      
      // Store token
      localStorage.setItem('token', response.token);
      addLog(`Token stored in localStorage`);
    } catch (error) {
      addLog(`❌ Login FAILED: ${error.message}`);
      if (error.response) {
        addLog(`Status: ${error.response.status}`);
        addLog(`Data: ${JSON.stringify(error.response.data)}`);
      }
    }
  };

  const testRegister = async () => {
    addLog(`Testing registration...`);
    try {
      const response = await authService.register({
        fullName: 'Test User',
        email: `test${Date.now()}@test.com`,
        password: 'Test123!',
        phone: '1234567890',
        role: 'Receptionist'
      });
      addLog(`✅ Register SUCCESS: Token received`);
      addLog(`User: ${response.fullName}, Role: ${response.role}`);
    } catch (error) {
      addLog(`❌ Register FAILED: ${error.message}`);
      if (error.response) {
        addLog(`Status: ${error.response.status}`);
        addLog(`Data: ${JSON.stringify(error.response.data)}`);
      }
    }
  };

  const clearToken = () => {
    localStorage.removeItem('token');
    addLog(`Token cleared from localStorage`);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Auth Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{ padding: '8px', marginRight: '10px' }}
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={testLogin} style={{ padding: '10px 20px', marginRight: '10px' }}>
          Test Login
        </button>
        <button onClick={testRegister} style={{ padding: '10px 20px', marginRight: '10px' }}>
          Test Register
        </button>
        <button onClick={clearToken} style={{ padding: '10px 20px' }}>
          Clear Token
        </button>
      </div>
      
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

export default AuthTest;
