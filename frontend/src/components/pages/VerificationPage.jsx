import { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { AuthContext } from "../../context/AuthContext";

const VerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyUser, login } = useContext(AuthContext);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);

  // Get email from navigation state
  const email = location.state?.email;

  if (!email) {
    navigate('/register');
    return null;
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const backendUrl = import.meta.env.MODE === "production"
        ? "https://ultra-3il5.onrender.com"
        : "http://localhost:3001";
      const response = await axios.post(`${backendUrl}/api/auth/verify-otp`, {
        email,
        otp
      });

      console.log("Response from backend:", response.data);

      if (response.status === 200) {
        // Store the token and user data
        await login(response.data.token, response.data.user);
        verifyUser();
        console.log("Navigating to setup page with email:", email);
        navigate('/setup', { state: { email } });
      }
    } catch (error) {
      console.error("Verification failed:", error.response?.data?.message || error.message);
      setError(error.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendDisabled) return;

    try {
      setResendDisabled(true);
      const backendUrl = import.meta.env.MODE === "production"
        ? "https://ultra-3il5.onrender.com"
        : "http://localhost:3001";
      await axios.post(`${backendUrl}/api/auth/resend-otp`, { email });
      
      // Start countdown
      let timeLeft = 30;
      setCountdown(timeLeft);
      
      const timer = setInterval(() => {
        timeLeft -= 1;
        setCountdown(timeLeft);
        
        if (timeLeft === 0) {
          clearInterval(timer);
          setResendDisabled(false);
        }
      }, 1000);
      
    } catch (error) {
      console.error("Failed to resend OTP:", error);
      setError("Failed to resend OTP. Please try again.");
      setResendDisabled(false);
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
        Verify Your Email
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3, textAlign: "center", maxWidth: "80%" }}>
        Please enter the verification code sent to {email}
      </Typography>
      <form onSubmit={handleVerify}>
        <TextField
          label="Verification Code"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          sx={{ width: "300px", marginBottom: 2 }}
          placeholder="Enter 6-digit code"
        />
        {error && (
          <Typography color="error" sx={{ marginBottom: 2, textAlign: "center" }}>
            {error}
          </Typography>
        )}
        <Button
          variant="contained"
          fullWidth
          sx={{
            padding: "12px 0",
            fontWeight: "bold",
            fontSize: "1rem",
            marginTop: 3,
            mb: 2, // Margin bottom for spacing
          }}
          onClick={handleVerify}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Verify OTP"}
        </Button>
      </form>
      <Button
        variant="text"
        onClick={handleResendOTP}
        disabled={resendDisabled}
        sx={{ color: "#128C7E" }}
      >
        {resendDisabled ? `Resend in ${countdown}s` : "Resend Code"}
      </Button>
    </Box>
  );
};

export default VerificationPage;