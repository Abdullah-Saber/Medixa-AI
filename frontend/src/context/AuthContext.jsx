import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({ ...parsedUser, token });
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password, role = null) => {
    try {
      const response = await authService.login({ email, password, role });
      
      const userData = {
        id: response.user.id,
        email: response.user.email,
        role: response.user.role,
        name: response.user.name,
        token: response.token,
      };

      // Store in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.user.id,
        email: response.user.email,
        role: response.user.role,
        name: response.user.name,
      }));

      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.registerPatient(userData);
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const persistSession = (response) => {
    const userData = {
      id: response.user.id,
      email: response.user.email,
      role: response.user.role,
      name: response.user.name,
      token: response.token,
    };
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify({
      id: response.user.id,
      email: response.user.email,
      role: response.user.role,
      name: response.user.name,
    }));
    setUser(userData);
    return userData;
  };

  const googleLogin = async (idToken) => {
    try {
      const response = await authService.googleLoginPatient(idToken);
      return persistSession(response);
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    }
  };

  const isAuthenticated = !!user?.token;
  const isAdmin = user?.role === 'Admin';
  const isDoctor = user?.role === 'Doctor';
  const isPatient = user?.role === 'Patient';

  const getDashboardRoute = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'Admin':
        return '/admin';
      case 'Doctor':
        return '/doctor';
      case 'Patient':
        return '/patient';
      default:
        return '/';
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    googleLogin,
    isAuthenticated,
    isAdmin,
    isDoctor,
    isPatient,
    isLoading,
    getDashboardRoute,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
