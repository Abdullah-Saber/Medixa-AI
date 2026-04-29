import React, { useState } from 'react';

const Register = () => {
    // 1. تحديد الـ Role (بشكل افتراضي Patient)
    const [role, setRole] = useState('Patient');

    // 2. تجميع كل البيانات في Object واحد
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        patientProvince: '',
        doctorProvince: '',
        // حقول الطبيب (بتبدأ فاضية)
        specialization: '',
        clinicAddress: '',
        licenseNumber: ''
    });

    // 3. دالة تحديث البيانات عند الكتابة
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // 4. دالة إرسال البيانات للـ Backend (ASP.NET Core)
    const handleSubmit = async (e) => {
        e.preventDefault();

        // تجهيز الداتا المراد إرسالها مع إضافة الـ Role الحالي
        const payload = {
            ...formData,
            role: role,
            province: role === 'Doctor' ? formData.doctorProvince : formData.patientProvince
        };

        try {
            const response = await fetch('https://localhost:7000/api/Account/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert(`Successfully registered as a ${role}!`);
                // هنا ممكن تعملي Redirect لصفحة الـ Login
            } else {
                const errorData = await response.json();
                console.error("Errors:", errorData);
                alert("Registration failed. Please check the console for details.");
            }
        } catch (error) {
            console.error("Network Error:", error);
            alert("Could not connect to the server.");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.header}>Create New Account</h2>
                
                {/* الجزء الخاص باختيار النوع (Doctor / Patient) */}
                <div style={styles.toggleWrapper}>
                    <button 
                        type="button"
                        onClick={() => setRole('Patient')}
                        style={role === 'Patient' ? styles.activeToggle : styles.toggleBtn}
                    >
                        Patient
                    </button>
                    <button 
                        type="button"
                        onClick={() => setRole('Doctor')}
                        style={role === 'Doctor' ? styles.activeToggle : styles.toggleBtn}
                    >
                        Doctor
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    {/* الحقول الأساسية لكل المستخدمين */}
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Full Name</label>
                        <input 
                            name="name" 
                            type="text" 
                            placeholder="Enter your name" 
                            style={styles.input} 
                            onChange={handleInputChange} 
                            required 
                        />
                    </div>

                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input 
                            name="email" 
                            type="email" 
                            placeholder="example@mail.com" 
                            style={styles.input} 
                            onChange={handleInputChange} 
                            required 
                        />
                    </div>

                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Password</label>
                        <input 
                            name="password" 
                            type="password" 
                            placeholder="********" 
                            style={styles.input} 
                            onChange={handleInputChange} 
                            required 
                        />
                    </div>

                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Phone Number</label>
                        <input 
                            name="phone" 
                            type="text" 
                            placeholder="01xxxxxxxxx" 
                            style={styles.input} 
                            onChange={handleInputChange} 
                            required 
                        />
                    </div>

                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Province</label>
                        <select
                            name={role === 'Doctor' ? 'doctorProvince' : 'patientProvince'}
                            value={role === 'Doctor' ? formData.doctorProvince : formData.patientProvince}
                            onChange={handleInputChange}
                            style={styles.input}
                            required
                        >
                            <option value="">Select your province</option>
                            <option value="Cairo">Cairo</option>
                            <option value="Giza">Giza</option>
                            <option value="Alexandria">Alexandria</option>
                            <option value="Luxor">Luxor</option>
                            <option value="Aswan">Aswan</option>
                            <option value="Suez">Suez</option>
                            <option value="Fayoum">Fayoum</option>
                            <option value="Sharqia">Sharqia</option>
                            <option value="Gharbia">Gharbia</option>
                            <option value="Dakahlia">Dakahlia</option>
                        </select>
                    </div>

                    {/* عرض حقول إضافية فقط إذا كان المختار "Doctor" */}
                    {role === 'Doctor' && (
                        <div style={styles.doctorSection}>
                            <h4 style={styles.subHeader}>Professional Information</h4>
                            
                            <div style={styles.fieldGroup}>
                                <input 
                                    name="specialization" 
                                    placeholder="Specialization (e.g. Surgeon)" 
                                    style={styles.input} 
                                    onChange={handleInputChange} 
                                    required 
                                />
                            </div>

                            <div style={styles.fieldGroup}>
                                <input 
                                    name="clinicAddress" 
                                    placeholder="Clinic Address" 
                                    style={styles.input} 
                                    onChange={handleInputChange} 
                                    required 
                                />
                            </div>

                            <div style={styles.fieldGroup}>
                                <input 
                                    name="licenseNumber" 
                                    placeholder="Medical License Number" 
                                    style={styles.input} 
                                    onChange={handleInputChange} 
                                    required 
                                />
                            </div>
                        </div>
                    )}

                    <button type="submit" style={styles.submitButton}>
                        Register as {role}
                    </button>
                </form>

            </div>
        </div>
    );
};

// الستايلات (تقدري تنقليها لملف CSS منفصل لو حبيتي)
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px',
        background: 'transparent'
    },
    card: {
        backgroundColor: 'rgba(4,17,30,0.95)',
        padding: '34px',
        borderRadius: '24px',
        boxShadow: '0 30px 90px rgba(0,0,0,0.35)',
        width: '100%',
        maxWidth: '520px',
        color: '#e8f4f0',
        border: '1px solid rgba(11,206,170,0.18)'
    },
    header: {
        textAlign: 'center',
        marginBottom: '25px',
        color: '#f4fbfa'
    },
    toggleWrapper: {
        display: 'flex',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: '12px',
        padding: '6px',
        marginBottom: '30px',
        border: '1px solid rgba(11,206,170,0.14)'
    },
    toggleBtn: {
        flex: 1,
        padding: '12px',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        transition: '0.3s',
        fontSize: '16px',
        color: '#d7f3f0'
    },
    activeToggle: {
        flex: 1,
        padding: '12px',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        backgroundColor: 'rgba(11,206,170,0.95)',
        color: '#04111e',
        fontWeight: '700',
        fontSize: '16px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column'
    },
    fieldGroup: {
        marginBottom: '15px'
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontSize: '14px',
        color: '#a7dcd7'
    },
    input: {
        width: '100%',
        padding: '14px',
        borderRadius: '12px',
        border: '1px solid rgba(11,206,170,0.2)',
        fontSize: '16px',
        boxSizing: 'border-box',
        color: '#e8f4f0',
        backgroundColor: 'rgba(255,255,255,0.04)'
    },
    doctorSection: {
        marginTop: '10px',
        padding: '18px',
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: '16px',
        borderLeft: '4px solid rgba(11,206,170,0.8)'
    },
    subHeader: {
        margin: '0 0 15px 0',
        fontSize: '16px',
        color: '#cbf6f0'
    },
    submitButton: {
        marginTop: '20px',
        padding: '14px',
        backgroundColor: '#0bceaa',
        color: '#04111e',
        border: 'none',
        borderRadius: '12px',
        fontSize: '18px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'background 0.3s'
    }
};

export default Register;