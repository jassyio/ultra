import { createContext, useState, useEffect } from "react";
import React from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsVerified(false);
  };

  const verifyUser = () => {
    setIsVerified(true);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isVerified, verifyUser }}>
      {children}
    </AuthContext.Provider>
  );
};
