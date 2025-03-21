import { useState, useContext } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Register = () => {
  const [userDetails, setUserDetails] = useState({ name: "", phone: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    // ✅ Allow signup without checking credentials (for testing)
    login({ phone: userDetails.phone });
    navigate("/chat"); // Redirect to chat after signup
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
        Create an account
      </Typography>
      <TextField
        label="Full Name"
        name="name"
        value={userDetails.name}
        onChange={handleChange}
        sx={{ width: "300px", marginBottom: 2 }}
      />
      <TextField
        label="Phone Number"
        name="phone"
        type="tel"
        value={userDetails.phone}
        onChange={handleChange}
        sx={{ width: "300px", marginBottom: 2 }}
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        value={userDetails.password}
        onChange={handleChange}
        sx={{ width: "300px", marginBottom: 2 }}
      />
      <Button variant="contained" onClick={handleRegister} sx={{ backgroundColor: "#25D366", width: "300px", marginTop: 2 }}>
        Sign Up
      </Button>
      <Typography sx={{ marginTop: 2 }}>
        Already have an account? <span onClick={() => navigate("/login")} style={{ color: "#128C7E", cursor: "pointer" }}>Login</span>
      </Typography>
    </Box>
  );
};

export default Register;
