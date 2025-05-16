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
      
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
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
      console.error("Login error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      setError(
        error.response?.data?.message || 
        error.message || 
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: 400,
        mx: "auto",
        p: 3,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>

      {error && (
        <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Email"
        name="phone"
        type="email"
        value={credentials.phone}
        onChange={handleChange}
        margin="normal"
        required
        disabled={loading}
        error={!!error && !credentials.phone}
        helperText={!!error && !credentials.phone ? "Email is required" : ""}
      />

      <TextField
        fullWidth
        label="Password"
        name="password"
        type="password"
        value={credentials.password}
        onChange={handleChange}
        margin="normal"
        required
        disabled={loading}
        error={!!error && !credentials.password}
        helperText={!!error && !credentials.password ? "Password is required" : ""}
      />

      <FormControlLabel
        control={
          <Checkbox
            name="rememberMe"
            checked={credentials.rememberMe}
            onChange={(e) =>
              setCredentials({ ...credentials, rememberMe: e.target.checked })
            }
            disabled={loading}
          />
        }
        label="Remember me"
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading || !credentials.phone || !credentials.password}
        sx={{ mt: 2 }}
      >
        {loading ? "Logging in..." : "Login"}
      </Button>

      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
        {loading ? "Connecting to server..." : ""}
      </Typography>
    </Box>
  );
};

export default Login;
