// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "../lib/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Fetch user on first load (cookie auth)
  const fetchUser = async () => {
    try {
      const res = await axios.get("/users/profile");
      setUser(res.data);
    } catch {
      setUser(null);
    }
    setLoadingUser(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const res = await axios.post("/users/login", { email, password });
    setUser(res.data);
  };

  const register = async (name, email, password) => {
    const res = await axios.post("/users/register", {
      name,
      email,
      password,
    });
    setUser(res.data);
  };

  const logout = async () => {
    await axios.post("/users/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loadingUser,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
