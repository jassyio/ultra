import { useState, useContext } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const Register = () => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { setAuthContext } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!userDetails.name || !userDetails.email || !userDetails.phone || !userDetails.password) {
      alert("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userDetails.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      const response = await axios.post(backendUrl, userDetails, {
        withCredentials: true,
      });

      // Check if OTP was successfully sent
      if (response.status === 200 && response.data.message === "OTP sent to email") {
        alert(response.data.message); // OTP sent
        // Redirect to verification page with email in state
        navigate("/verification", { state: { email: userDetails.email } });
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Registration failed. Please try again.");
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
        Create an account
      </Typography>
      <form onSubmit={handleRegister}>
        <TextField
          label="Full Name"
          name="name"
          value={userDetails.name}
          onChange={handleChange}
          sx={{ width: "300px", marginBottom: 2 }}
        />
        <TextField
          label="Email Address"
          name="email"
          type="email"
          value={userDetails.email}
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
          autoComplete="new-password"
          sx={{ width: "300px", marginBottom: 2 }}
        />

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
          {loading ? "Registering..." : "Sign Up"}
        </Button>
      </form>
      <Typography sx={{ marginTop: 2 }}>
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          style={{ color: "#128C7E", cursor: "pointer" }}
        >
          Login
        </span>
      </Typography>
    </Box>
  );
};

export default Register;
