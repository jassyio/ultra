// FloatingButton.jsx

import React from "react";
import { Box } from "@mui/material";

const FloatingButton = ({ icon, onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: "fixed",
        bottom: "60px",
        right: "20px",
        backgroundColor: "primary.main",
        color: "white",
        borderRadius: "50%",
        padding: "16px",
        boxShadow: 3,
        cursor: "pointer",
        zIndex: 1000,
        transition: "transform 0.3s ease, background-color 0.3s ease",
        "&:hover": {
          transform: "scale(1.1)",
          backgroundColor: "primary.dark",
        },
      }}
    >
      {icon}
    </Box>
  );
};

export default FloatingButton;
