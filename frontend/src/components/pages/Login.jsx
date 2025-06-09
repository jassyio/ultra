import { useState, useContext } from "react";
import { Box, TextField, Button, Typography, Checkbox, FormControlLabel, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const Login = () => {
  const [credentials, setCredentials] = useState({ phone: "", password: "", rememberMe: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission
    
    // Validate inputs
    if (!credentials.phone || !credentials.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      console.log("Attempting login with email:", credentials.phone);
      
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://ultra-backend.vercel.app/';
      console.log("Using backend URL:", backendUrl);
      
      const response = await axios.post(`${backendUrl}/api/auth/login`, {
        email: credentials.phone,
        password: credentials.password,
      });

      console.log("Login response:", response.data);

      if (response.data.token) {
        console.log("Login successful, setting token and user data");
        await login(response.data.token, response.data.user || { email: credentials.phone });
        navigate("/chat");
      } else {
        throw new Error("No token received from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 3 }}>
        Welcome Back
      </Typography>
      <form onSubmit={handleLogin}>
        <TextField
          label="Email Address"
          name="phone"
          type="email"
          value={credentials.phone}
          onChange={handleChange}
          sx={{ width: "300px", marginBottom: 2 }}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={credentials.password}
          onChange={handleChange}
          sx={{ width: "300px", marginBottom: 2 }}
        />
        <FormControlLabel
          control={
            <Checkbox
              name="rememberMe"
              checked={credentials.rememberMe}
              onChange={(e) => setCredentials({ ...credentials, rememberMe: e.target.checked })}
            />
          }
          label="Remember me"
          sx={{ width: "300px", marginBottom: 2 }}
        />
        {error && (
          <Alert severity="error" sx={{ width: "300px", marginBottom: 2 }}>
            {error}
          </Alert>
        )}
        <Button
          variant="contained"
          type="submit"
          sx={{
            backgroundColor: "#25D366",
            width: "300px",
            marginTop: 2,
          }}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
      <Typography sx={{ marginTop: 2 }}>
        Don't have an account?{" "}
        <span
          onClick={() => navigate("/register")}
          style={{ color: "#128C7E", cursor: "pointer" }}
        >
          Sign Up
        </span>
      </Typography>
    </Box>
  );
};

export default Login;
