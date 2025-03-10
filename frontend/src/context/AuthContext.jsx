import React, { createContext, useState } from "react";

export const AuthContext = createContext(); // ✅ Create Auth Context

export const AuthProvider = ({ children }) => { // ✅ Named Export
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    // Mock login logic
    setUser({ username });
  };

  const register = (username, password) => {
    // Mock register logic
    setUser({ username });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
