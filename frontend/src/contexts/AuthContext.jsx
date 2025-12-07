import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authAPI.getUser();
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    setUser(response.data.user);
    return response;
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
  };

  const googleLogin = () => {
    authAPI.googleLogin();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
