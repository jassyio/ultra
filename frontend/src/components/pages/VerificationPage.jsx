import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Verification = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerification = async () => {
    setLoading(true);
    try {
      // Send OTP to the backend for verification
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/verify-otp`, { otp: verificationCode });
      
      if (response.status === 200) {
        // On success, navigate to the next page (Profile Setup or Dashboard)
        navigate("/setup"); 
      }
    } catch (error) {
      alert("Invalid verification code or OTP expired");
      console.error("OTP verification failed:", error.response?.data?.message || error.message);
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
        Verify Your Account
      </Typography>
      <TextField
        label="Verification Code"
        name="verificationCode"
        type="text"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        sx={{ width: "300px", marginBottom: 2 }}
      />
      <Button
        variant="contained"
        onClick={handleVerification}
        sx={{
          backgroundColor: "#25D366",
          width: "300px",
          marginTop: 2,
        }}
        disabled={loading}
      >
        {loading ? "Verifying..." : "Verify"}
      </Button>
    </Box>
  );
};

export default Verification;
