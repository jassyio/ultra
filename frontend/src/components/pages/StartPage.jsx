import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ChatIcon from "@mui/icons-material/Chat";

const StartPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#075e54",
        color: "white",
      }}
    >
      <ChatIcon sx={{ fontSize: 80, marginBottom: 2 }} />
      <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        Welcome to Ultra
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 4, textAlign: "center", maxWidth: "80%" }}>
        Secure, fast, and simple messaging for everyone.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#25D366", "&:hover": { backgroundColor: "#1ebe5d" } }}
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
