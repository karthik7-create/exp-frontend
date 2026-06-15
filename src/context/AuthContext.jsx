import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ew_token'));
  const [loading, setLoading] = useState(true);
  const [isAnimatingLogin, setIsAnimatingLogin] = useState(false);

  const isAuthenticated = !!token && !!user;

  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch {
      // Token is invalid or expired
      localStorage.removeItem('ew_token');
      localStorage.removeItem('ew_user');
      setToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token, fetchUser]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('ew_token', newToken);
    if (userData) {
      localStorage.setItem('ew_user', JSON.stringify(userData));
    }
    setToken(newToken);
    setUser(userData || { email });
    setIsAnimatingLogin(true);
    setTimeout(() => setIsAnimatingLogin(false), 5000);
    return res.data;
  };

  const register = async (fullName, email, password) => {
    const res = await api.post('/auth/register', { fullName, email, password });
    const { token: newToken, user: userData } = res.data;
    if (newToken) {
      localStorage.setItem('ew_token', newToken);
      if (userData) {
        localStorage.setItem('ew_user', JSON.stringify(userData));
      }
      setToken(newToken);
      setUser(userData || { fullName, email });
      setIsAnimatingLogin(true);
      setTimeout(() => setIsAnimatingLogin(false), 5000);
    }
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('ew_token');
    localStorage.removeItem('ew_user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser,
    isAnimatingLogin,
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

export default AuthContext;
