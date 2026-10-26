import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, getStoredUser, getToken, setAuthData, clearAuthData } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(getToken());
  const [loading, setLoading] = useState(true);

  // Validate or sync profile on load if token exists
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = getToken();
      if (storedToken) {
        try {
          const res = await authAPI.getProfile();
          if (res.success && res.data) {
            setUser(res.data);
          }
        } catch (err) {
          console.warn('Session expired or invalid, logging out:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (credentials) => {
    const res = await authAPI.login(credentials);
    if (res.success && res.data) {
      setAuthData(res.data.token, res.data);
      setToken(res.data.token);
      setUser(res.data);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authAPI.register(userData);
    if (res.success && res.data) {
      setAuthData(res.data.token, res.data);
      setToken(res.data.token);
      setUser(res.data);
    }
    return res;
  };

  const logout = () => {
    clearAuthData();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
