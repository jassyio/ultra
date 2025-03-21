import { useState, useContext } from "react";
import { Box, TextField, Button, Typography, Checkbox, FormControlLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [credentials, setCredentials] = useState({ phone: "", password: "", rememberMe: false });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    // ✅ Allow login without checking credentials (for testing)
    login({ phone: credentials.phone }, credentials.rememberMe);
    navigate("/chat"); // Redirect to chat after login
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
