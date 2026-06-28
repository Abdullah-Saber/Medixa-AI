import axios from 'axios';

// API Base Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5230/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
  
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore if endpoint missing
    }
    localStorage.removeItem('token');
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  registerPatient: async (userData) => {
    const response = await api.post('/patientauth/register', userData);
    return response.data;
  },

  googleLoginPatient: async (idToken) => {
    const response = await api.post('/patientauth/google', { idToken });
    return response.data;
  },
};

// Patient Services
export const patientService = {
  getAll: async () => {
    const response = await api.get('/patient');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/patient/${id}`);
    return response.data;
  },
  
  create: async (patientData) => {
    const response = await api.post('/patient', patientData);
    return response.data;
  },
  
  update: async (id, patientData) => {
    const response = await api.put(`/patient/${id}`, patientData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/patient/${id}`);
    return response.data;
  },
  
  getOrders: async (patientId) => {
    const response = await api.get(`/order/patient/${patientId}`);
    return response.data;
  }
};

// Doctor Services
export const doctorService = {
  getAll: async () => {
    const response = await api.get('/doctor');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/doctor/${id}`);
    return response.data;
  },
  
  create: async (doctorData) => {
    const response = await api.post('/doctor', doctorData);
    return response.data;
  },
  
  update: async (id, doctorData) => {
    const response = await api.put(`/doctor/${id}`, doctorData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/doctor/${id}`);
    return response.data;
  }
};

// Order Services
export const orderService = {
  getAll: async () => {
    const response = await api.get('/order');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/order/${id}`);
    return response.data;
  },
  
  create: async (orderData) => {
    const response = await api.post('/order', orderData);
    return response.data;
  },
  
  update: async (id, orderData) => {
    const response = await api.put(`/order/${id}`, orderData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/order/${id}`);
    return response.data;
  },
  
  getByPatient: async (patientId) => {
    const response = await api.get(`/order/patient/${patientId}`);
    return response.data;
  }
};

// Result Services
export const resultService = {
  getAll: async () => {
    const response = await api.get('/result');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/result/${id}`);
    return response.data;
  },
  
  create: async (resultData) => {
    const response = await api.post('/result', resultData);
    return response.data;
  },
  
  update: async (id, resultData) => {
    const response = await api.put(`/result/${id}`, resultData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/result/${id}`);
    return response.data;
  },
  
  getByTechnician: async (technicianId) => {
    const response = await api.get(`/result/technician/${technicianId}`);
    return response.data;
  },
  
  getByOrder: async (orderId) => {
    const response = await api.get(`/result/order/${orderId}`);
    return response.data;
  }
};

// Lab Test Services
export const labTestService = {
  getAll: async () => {
    const response = await api.get('/labtests');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/labtests/${id}`);
    return response.data;
  },
  
  create: async (testData) => {
    const response = await api.post('/labtests', testData);
    return response.data;
  },
  
  update: async (id, testData) => {
    const response = await api.put(`/labtests/${id}`, testData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/labtests/${id}`);
    return response.data;
  }
};

// Employee Services
export const employeeService = {
  getAll: async () => {
    const response = await api.get('/employee');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/employee/${id}`);
    return response.data;
  },
  
  create: async (employeeData) => {
    const response = await api.post('/employee', employeeData);
    return response.data;
  },
  
  update: async (id, employeeData) => {
    const response = await api.put(`/employee/${id}`, employeeData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/employee/${id}`);
    return response.data;
  },
  
  getActive: async () => {
    const response = await api.get('/employee/active');
    return response.data;
  },
  
  getByRole: async (role) => {
    const response = await api.get(`/employee/role/${role}`);
    return response.data;
  },
  
  deactivate: async (id) => {
    const response = await api.put(`/employee/${id}/deactivate`);
    return response.data;
  },
  
  activate: async (id) => {
    const response = await api.put(`/employee/${id}/activate`);
    return response.data;
  }
};

// Appointment Services
export const appointmentService = {
  getAll: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },
  
  create: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },
  
  update: async (id, appointmentData) => {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  },
  
  getByPatient: async (patientId) => {
    const response = await api.get(`/appointments/patient/${patientId}`);
    return response.data;
  },

  getByDoctor: async (doctorId) => {
    const response = await api.get(`/appointments/doctor/${doctorId}`);
    return response.data;
  },
};

// AI Services
export const aiService = {
  interpretResult: async (resultId) => {
    const response = await api.post(`/ai/interpret/${resultId}`);
    return response.data;
  },
  
  getRecommendations: async (patientId) => {
    const response = await api.get(`/ai/recommendations/${patientId}`);
    return response.data;
  },
  
  analyzeTrends: async (patientId) => {
    const response = await api.get(`/ai/trends/${patientId}`);
    return response.data;
  }
};

// Specialization Services
export const specializationService = {
  getAll: async () => {
    const response = await api.get('/specialization');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/specialization/${id}`);
    return response.data;
  },

  create: async (specializationData) => {
    const response = await api.post('/specialization', specializationData);
    return response.data;
  },

  update: async (id, specializationData) => {
    const response = await api.put(`/specialization/${id}`, specializationData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/specialization/${id}`);
    return response.data;
  }
};

// Export default API instance
export default api;

