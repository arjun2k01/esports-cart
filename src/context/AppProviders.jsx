// src/context/AppProviders.jsx
import React, { useEffect, createContext } from 'react';
import axios from 'axios';
import { usePersistentState } from '../hooks/usePersistentState';
import { ToastContainer } from '../components/ToastContainer';

// ======================
// ✅ API BASE URL SETUP
// ======================
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://esports-cart.onrender.com/api';

axios.defaults.baseURL = API_BASE_URL;

// ======================
// ✅ AUTH CONTEXT
// ======================
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = usePersistentState('esportsUser', null);
  const isAuthenticated = !!user;

  // ✅ Safe optional chaining (fixes "Cannot read property 'token'")
  useEffect(() => {
    if (user?.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/users/login', { email, password });
      setUser(data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const { data } = await axios.post('/users/register', { name, email, password });
      setUser(data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, signup }}>
      {children}
      <ToastContainer />
    </AuthContext.Provider>
  );
};

// ======================
// ✅ GLOBAL APP CONTEXT
// ======================
export const AppContext = createContext({
  apiBaseUrl: API_BASE_URL,
});

export default function AppProviders({ children }) {
  return (
    <AppContext.Provider value={{ apiBaseUrl: API_BASE_URL }}>
      <AuthProvider>{children}</AuthProvider>
    </AppContext.Provider>
  );
}
