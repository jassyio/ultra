import { useState, useContext } from "react";
import { Box, TextField, Button, Typography, Checkbox, FormControlLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const Login = () => {
  const [credentials, setCredentials] = useState({ phone: "", password: "", rememberMe: false });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await axios.post(`${backendUrl}/api/auth/login`, {
        email: credentials.phone, // Assuming phone is used as email
        password: credentials.password,
      });

      if (response.status === 200) {
        login(response.data.token, credentials.rememberMe);
        navigate("/chat"); // Redirect to chat after successful login
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Login failed. Please try again.");
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
        Login to Ultra
      </Typography>
      <TextField
        label="Phone Number"
        name="phone"
        type="tel"
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
            checked={credentials.rememberMe}
            onChange={() => setCredentials({ ...credentials, rememberMe: !credentials.rememberMe })}
          />
        }
        label="Remember Me"
      />
      <Button variant="contained" onClick={handleLogin} sx={{ backgroundColor: "#25D366", width: "300px", marginTop: 2 }}>
        Login
      </Button>
      <Typography
        sx={{ marginTop: 2, cursor: "pointer", color: "#128C7E" }}
        onClick={() => navigate("/forgot-password")}
      >
        Forgot Password?
      </Typography>
      <Typography sx={{ marginTop: 2 }}>
        Don't have an account? <span onClick={() => navigate("/register")} style={{ color: "#128C7E", cursor: "pointer" }}>Sign up</span>
      </Typography>
    </Box>
  );
};

export default Login;
