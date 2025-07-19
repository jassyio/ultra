import { useState, useContext } from "react";
import { Box, TextField, Button, Typography, Checkbox, FormControlLabel, Alert, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const Login = () => {
  const [credentials, setCredentials] = useState({ phone: "", password: "", rememberMe: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const backendUrl =
    import.meta.env.MODE === "development"
      ? "http://localhost:3001" // Local backend for development
      : "https://ultra-3il5.onrender.com"; // Hosted backend on Render

  console.log("Using backend URL:", backendUrl);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!credentials.phone || !credentials.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const loginUrl = `${backendUrl.replace(/\/+$/, "")}/api/auth/login`;

      const response = await axios.post(loginUrl, {
        email: credentials.phone,
        password: credentials.password,
      });

      if (response.data.token) {
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
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        width: "100%",
        maxWidth: "100vw",
        px: { xs: 2, sm: 4 },
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 3, color: theme.palette.text.primary }}>
        Welcome Back
      </Typography>
      <form onSubmit={handleLogin} style={{ width: "100%", maxWidth: "400px" }}>
        <TextField
          label="Email Address"
          name="phone"
          type="email"
          value={credentials.phone}
          onChange={handleChange}
          sx={{ 
            width: "100%", 
            marginBottom: 2,
            "& .MuiOutlinedInput-root": {
              backgroundColor: theme.palette.background.paper,
            }
          }}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={credentials.password}
          onChange={handleChange}
          sx={{ 
            width: "100%", 
            marginBottom: 2,
            "& .MuiOutlinedInput-root": {
              backgroundColor: theme.palette.background.paper,
            }
          }}
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
          sx={{ width: "100%", marginBottom: 2, color: theme.palette.text.primary }}
        />
        {error && (
          <Alert severity="error" sx={{ width: "100%", marginBottom: 2 }}>
            {error}
          </Alert>
        )}
        <Button
          variant="contained"
          type="submit"
          fullWidth
          sx={{
            padding: "12px 0",
            fontWeight: "bold",
            fontSize: "1rem",
            marginTop: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            "&:hover": {
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
            }
          }}
          disabled={loading}
        >
          {loading ? "Logging In..." : "Login"}
        </Button>
      </form>
      <Typography sx={{ marginTop: 2, color: theme.palette.text.primary }}>
        Don't have an account?{" "}
        <span
          onClick={() => navigate("/register")}
          style={{ 
            color: theme.palette.primary.main, 
            cursor: "pointer",
            textDecoration: "underline"
          }}
        >
          Sign Up
        </span>
      </Typography>
    </Box>
  );
};

export default Login;
