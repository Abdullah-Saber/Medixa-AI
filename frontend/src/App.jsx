import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar       from './components/Navbar';
import Breadcrumbs  from './components/Breadcrumbs';
import HomePage     from './pages/HomePage';
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AboutPage    from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import BookAppointmentPage from './pages/BookAppointmentPage';
import AdminDashboard from './pages/AdminDashboard';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import BookTestPage from './pages/BookTestPage';
import LabTestsPage from './pages/LabTestsPage';
import PatientOrdersPage from './pages/PatientOrdersPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import PatientResultsPage from './pages/PatientResultsPage';
import ResultDetailsPage from './pages/ResultDetailsPage';
import PatientAppointmentsPage from './pages/PatientAppointmentsPage';
import PatientProfilePage from './pages/PatientProfilePage';
import DoctorPatientsPage from './pages/DoctorPatientsPage';
import DoctorPatientRecordPage from './pages/DoctorPatientRecordPage';
import DoctorReviewResultsPage from './pages/DoctorReviewResultsPage';
import DoctorReviewResultDetailsPage from './pages/DoctorReviewResultDetailsPage';
import DoctorAppointmentsPage from './pages/DoctorAppointmentsPage';
import AppointmentDetailsPage from './pages/AppointmentDetailsPage';
import SpecializationsPage from './pages/SpecializationsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

import AdminRoute from './components/auth/AdminRoute';
import PatientRoute from './components/auth/PatientRoute';
import DoctorRoute from './components/auth/DoctorRoute';

function AppContent() {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  return (
    <ErrorBoundary>
      <Navbar />
      <Breadcrumbs />
      <Routes>
        <Route path="/"         element={<HomePage />} />
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/about"             element={<AboutPage />} />
        <Route path="/services"           element={<ServicesPage />} />
        <Route path="/book-appointment"   element={<BookAppointmentPage />} />
        <Route path="/admin/specializations" element={<AdminRoute><SpecializationsPage /></AdminRoute>} />
        <Route path="/admin/reports" element={<AdminRoute><ReportsPage /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><SettingsPage /></AdminRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/patient" element={<PatientRoute><PatientDashboard /></PatientRoute>} />
        <Route path="/patient/lab-tests" element={<PatientRoute><LabTestsPage /></PatientRoute>} />
        <Route path="/patient/book-test" element={<PatientRoute><BookTestPage /></PatientRoute>} />
        <Route path="/patient/orders" element={<PatientRoute><PatientOrdersPage /></PatientRoute>} />
        <Route path="/patient/orders/:id" element={<PatientRoute><OrderDetailsPage /></PatientRoute>} />
        <Route path="/patient/results" element={<PatientRoute><PatientResultsPage /></PatientRoute>} />
        <Route path="/patient/results/:id" element={<PatientRoute><ResultDetailsPage /></PatientRoute>} />
        <Route path="/patient/appointments" element={<PatientRoute><PatientAppointmentsPage /></PatientRoute>} />
        <Route path="/patient/appointments/:id" element={<PatientRoute><AppointmentDetailsPage /></PatientRoute>} />

        <Route path="/patient/profile" element={<PatientRoute><PatientProfilePage /></PatientRoute>} />
        <Route path="/doctor" element={<DoctorRoute><DoctorDashboard /></DoctorRoute>} />
        <Route path="/doctor/patients" element={<DoctorRoute><DoctorPatientsPage /></DoctorRoute>} />
        <Route path="/doctor/patients/:id" element={<DoctorRoute><DoctorPatientRecordPage /></DoctorRoute>} />
        <Route path="/doctor/results" element={<DoctorRoute><DoctorReviewResultsPage /></DoctorRoute>} />
        <Route path="/doctor/results/:id" element={<DoctorRoute><DoctorReviewResultDetailsPage /></DoctorRoute>} />
        <Route path="/doctor/appointments" element={<DoctorRoute><DoctorAppointmentsPage /></DoctorRoute>} />
      </Routes>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
