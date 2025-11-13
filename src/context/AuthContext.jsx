import React, { createContext, useContext, useEffect } from 'react';
import axios from 'axios';
import { usePersistentState } from '../hooks/usePersistentState';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = usePersistentState("esportsUser", null);
  const isAuthenticated = !!user;

  useEffect(() => {
    if (user?.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post("/users/login", { email, password });
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
      const { data } = await axios.post("/users/register", {
        name,
        email,
        password,
      });
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
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);