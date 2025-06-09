import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("Initializing authentication...");
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        
        if (token && storedUser) {
          console.log("Found stored credentials, attempting to restore session");
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Verify token with backend
          try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://ultra-backend.vercel.app';
            await axios.get(`${backendUrl}/api/auth/verify`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Token verified successfully");
          } catch (verifyError) {
            console.error("Token verification failed:", verifyError);
            throw new Error("Invalid token");
          }
        } else {
          console.log("No stored credentials found");
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setError(error.message);
        logout(); // Clear invalid data
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (token, userData) => {
    try {
      console.log("Attempting to login with token and user data");
      if (!token) {
        throw new Error("No token provided");
      }
      if (!userData) {
        throw new Error("No user data provided");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setError(null);
      console.log("Login successful, session established");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
      throw error;
    }
  };

  const logout = () => {
    console.log("Logging out, clearing session data");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsVerified(false);
    setError(null);
  };

  const verifyUser = () => {
    setIsVerified(true);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        isVerified, 
        verifyUser,
        loading,
        error 
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
