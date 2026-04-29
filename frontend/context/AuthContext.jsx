import { createContext, useContext, useState, useEffect } from 'react';

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

  const login = async (email, password) => {
    // Mock API call - replace with actual API
    const mockUsers = [
      { id: 1, email: 'admin@smartlab.com', password: 'admin123', role: 'Admin', name: 'Admin User' },
      { id: 2, email: 'doctor@smartlab.com', password: 'doctor123', role: 'Doctor', name: 'Dr. Ahmed' },
      { id: 3, email: 'patient@smartlab.com', password: 'patient123', role: 'Patient', name: 'John Doe' },
    ];

    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) {
      throw new Error('Invalid email or password');
    }

    // Generate mock JWT token
    const token = `mock_jwt_${foundUser.id}_${Date.now()}`;
    
    const userData = {
      id: foundUser.id,
      email: foundUser.email,
      role: foundUser.role,
      name: foundUser.name,
      token: token,
    };

    // Store in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({
      id: foundUser.id,
      email: foundUser.email,
      role: foundUser.role,
      name: foundUser.name,
    }));

    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAuthenticated = !!user?.token;
  const isAdmin = user?.role === 'Admin';

  const getDashboardRoute = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'Admin':
        return '/admin';
      case 'Doctor':
        return '/doctors';
      case 'Patient':
      default:
        return '/';
    }
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    isAdmin,
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
