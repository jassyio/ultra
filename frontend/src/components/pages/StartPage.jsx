import { Box, Button, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ChatIcon from "@mui/icons-material/Chat";
import '../../styles/animations.css'; // Import the CSS for animations

const StartPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      className="gradient-bg-animation" // Apply the animation class
    >
      <ChatIcon sx={{ fontSize: 80, marginBottom: 2, color: "white" }} />
      <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 2, color: "white" }}>
        Welcome to Ultra
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 4, textAlign: "center", maxWidth: "80%", color: "white" }}>
        Secure, fast, and simple messaging for everyone.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
        <Button
          variant="outlined"
          sx={{
            color: "white", 
            borderColor: "white",
            "&:hover": { 
              borderColor: "white",
              backgroundColor: "rgba(255, 255, 255, 0.1)" 
            } 
          }}
          onClick={() => navigate("/register")}
        >
          Sign Up
        </Button>
      </Box>
    </Box>
  );
};

export default StartPage;
