import { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { AuthContext } from "../../context/AuthContext";

const VerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyUser } = useContext(AuthContext);
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
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await axios.post(`${backendUrl}/api/auth/verify-otp`, {
        email,
        otp
      });

      console.log("Response from backend:", response.data);

      if (response.status === 200) {
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

  const handleResendOtp = async () => {
    setResendDisabled(true);
    setCountdown(30);
    
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      await axios.post(`${backendUrl}/api/auth/resend-otp`, { email });
      
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setResendDisabled(false);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to resend OTP');
      setResendDisabled(false);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 3 }}>
        Verify Your Email
      </Typography>
      <Typography sx={{ marginBottom: 2 }}>
        We've sent a 6-digit code to {email}
      </Typography>
      
      <form onSubmit={handleVerify} style={{ width: '300px' }}>
        <TextField
          label="Verification Code"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          fullWidth
          margin="normal"
          required
          inputProps={{ maxLength: 6 }}
        />
        
        {error && (
          <Typography color="error" sx={{ marginBottom: 2 }}>
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ marginTop: 2 }}
          disabled={loading || otp.length !== 6}
        >
          {loading ? <CircularProgress size={24} /> : 'Verify'}
        </Button>
      </form>

      <Typography sx={{ marginTop: 2 }}>
        Didn't receive the code?{' '}
        <Button
          onClick={handleResendOtp}
          disabled={resendDisabled}
          sx={{ color: resendDisabled ? 'text.disabled' : 'primary.main' }}
        >
          Resend {resendDisabled && `(${countdown}s)`}
        </Button>
      </Typography>
    </Box>
  );
};

export default VerificationPage;