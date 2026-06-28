import React, { useState, useEffect } from 'react';
import { patientService, doctorService, orderService } from '../services/api';

const ApiTest = () => {
  const [status, setStatus] = useState('Testing...');
  const [results, setResults] = useState({});
  const [error, setError] = useState(null);

  const testApiEndpoints = async () => {
    try {
      // Test Patient API
      const patients = await patientService.getAll();
      
      // Test Doctor API
      const doctors = await doctorService.getAll();
      
      // Test Order API
      const orders = await orderService.getAll();
      
      setResults({
        patients: patients.length,
        doctors: doctors.length,
        orders: orders.length,
        patientData: patients.slice(0, 2),
        doctorData: doctors.slice(0, 2),
        orderData: orders.slice(0, 2)
      });
      
      setStatus('✅ All APIs Connected');
    } catch (err) {
      console.error('API Test Error:', err);
      setError(err.message);
      setStatus('❌ API Connection Failed');
    }
  };

  useEffect(() => {
    testApiEndpoints();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>API Connectivity Test</h2>
      <div style={{ marginBottom: '20px' }}>
        <strong>Status:</strong> {status}
      </div>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {results.patients !== undefined && (
        <div>
          <h3>Results:</h3>
          <ul>
            <li>Patients: {results.patients} records</li>
            <li>Doctors: {results.doctors} records</li>
            <li>Orders: {results.orders} records</li>
          </ul>
          
          <h4>Sample Patient Data:</h4>
          <pre style={{ background: '#f0f0f0', padding: '10px' }}>
            {JSON.stringify(results.patientData, null, 2)}
          </pre>
          
          <h4>Sample Doctor Data:</h4>
          <pre style={{ background: '#f0f0f0', padding: '10px' }}>
            {JSON.stringify(results.doctorData, null, 2)}
          </pre>
          
          <h4>Sample Order Data:</h4>
          <pre style={{ background: '#f0f0f0', padding: '10px' }}>
            {JSON.stringify(results.orderData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiTest;
