import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function App() {
    const [heartRate, setHeartRate] = useState([72, 75, 74, 78, 75, 80]);

    // Live Simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setHeartRate(prev => [...prev.slice(1), Math.floor(Math.random() * (90 - 65 + 1)) + 65]);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ direction: 'rtl', padding: '20px', backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: 'Arial' }}>

            {/* Header */}
            <header style={{ textAlign: 'center', marginBottom: '30px', backgroundColor: '#fff', padding: '15px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <h2 style={{ color: '#2c3e50', margin: 0 }}>Medixa | Patient Dashboard 🏥</h2>
            </header>

            <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '20px' }}>

                {/* Sidebar: Patient Table */}
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                            <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#3498db', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '25px' }}>👤</div>
                            <h3 style={{ margin: 0 }}>patient name</h3>
                            <small style={{ color: '#95a5a6' }}>ID: #PX-2024</small>
                        </div>
                        <hr style={{ border: '0', borderTop: '1px solid #eee', marginBottom: '15px' }} />

                        <div style={{ lineHeight: '2', fontSize: '14px' }}>
                            <p><strong>Age:</strong> 20 </p>
                            <p><strong>height:</strong> 165 cm</p>
                            <p><strong>weight:</strong> 60 kg</p>
                            <p><strong>blood type:</strong> A+</p>
                            <p><strong>medical status:</strong> stable ✅</p>
                        </div>
                    </div>

                    {/* Doctor Table */}
                    <div style={{ background: '#2c3e50', color: 'white', padding: '20px', borderRadius: '15px' }}>
                        <h4 style={{ margin: '0 0 10px 0' }}>Assigned Doctor</h4>
                        <p style={{ margin: 0 }}>doctor name</p>
                        <small style={{ opacity: 0.8 }}>Cardiologist</small>
                    </div>
                </aside>

                {/* Main: Metrics & Chart */}
                <main>
                    {/* Medical_Records Table */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '20px' }}>
                        <div style={{ background: 'white', padding: '15px', borderRadius: '12px', borderRight: '5px solid #e74c3c' }}>
                            <small style={{ color: '#7f8c8d' }}>Heart Rate</small>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e74c3c' }}>{heartRate[5]} BPM</div>
                        </div>
                        <div style={{ background: 'white', padding: '15px', borderRadius: '12px', borderRight: '5px solid #2ecc71' }}>
                            <small style={{ color: '#7f8c8d' }}>Blood Pressure</small>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2ecc71' }}>120/80</div>
                        </div>
                        <div style={{ background: 'white', padding: '15px', borderRadius: '12px', borderRight: '5px solid #f1c40f' }}>
                            <small style={{ color: '#7f8c8d' }}>Next Visit</small>
                            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>25 April</div>
                        </div>
                    </div>

                    {/* Live Chart */}
                    <div style={{ background: 'white', padding: '25px', borderRadius: '15px', marginBottom: '20px' }}>
                        <h3 style={{ marginTop: 0, color: '#2c3e50' }}>Vital Signs Monitor</h3>
                        <Line
                            data={{
                                labels: ['5s', '4s', '3s', '2s', '1s', 'Now'],
                                datasets: [{ label: 'Pulse', data: heartRate, borderColor: '#e74c3c', backgroundColor: 'rgba(231, 76, 60, 0.1)', fill: true, tension: 0.4 }]
                            }}
                            options={{ scales: { y: { min: 50, max: 110 } } }}
                        />
                    </div>

                    {/* Appointments Table */}
                    <div style={{ background: 'white', padding: '20px', borderRadius: '15px' }}>
                        <h4 style={{ marginTop: 0 }}>Recent Appointments</h4>
                        <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #f4f7f6' }}>
                                    <th style={{ padding: '10px' }}>Date</th>
                                    <th style={{ padding: '10px' }}>Clinic</th>
                                    <th style={{ padding: '10px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '10px' }}>2024/04/10</td>
                                    <td style={{ padding: '10px' }}>Cardiology</td>
                                    <td style={{ padding: '10px', color: '#27ae60' }}>Completed</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

            {/* Footer */}
            <footer style={{ textAlign: 'center', marginTop: '30px', color: '#bdc3c7', fontSize: '12px' }}>
                
            </footer>
        </div>
    );
}

export default App;