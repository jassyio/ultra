import { BottomNavigation, BottomNavigationAction, useTheme } from "@mui/material";
import { Chat, Groups, Call, Update } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";

const BottomNavbar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const { selectedChat } = useContext(ChatContext);
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue.toLowerCase()}`);
  };

  // Hide BottomNavbar when a chat is open
  if (selectedChat) return null;

  return (
    <BottomNavigation
      value={activeTab}
      onChange={handleTabChange}
      showLabels
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        bgcolor: theme.palette.primary.dark, // Use a darker primary shade for the background
        boxShadow: "0 -4px 12px rgba(0,0,0,0.2)", // Increased shadow for depth
        zIndex: 1000,
        
        // Style for selected tab indicator
        "& .MuiBottomNavigationAction-root.Mui-selected": {
          color: 'white', // Selected icon/label color
          background: theme.palette.primary.gradient, // Gradient for selected tab
          borderRadius: '16px', // Rounded corners for selected tab
          margin: '4px', // Spacing around the selected tab
          boxShadow: theme.shadows[4],
        },

        // Style for unselected tabs and hover
        "& .MuiBottomNavigationAction-root": {
          color: 'rgba(255,255,255,0.7)', // Unselected icon/label color
          transition: 'transform 0.2s ease-in-out, color 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
            color: 'white',
            backgroundColor: 'rgba(255,255,255,0.08)', // Subtle background on hover
          },
        },

        // Ensure labels are always visible and white
        "& .MuiBottomNavigationAction-label": {
          color: 'inherit', // Inherit color from the parent action
          fontSize: '0.75rem',
          fontWeight: 'bold',
          marginTop: '4px',
        },
      }}
    >
      <BottomNavigationAction label="Chats" icon={<Chat fontSize="small" />} value="chat" />
      <BottomNavigationAction label="Communities" icon={<Groups fontSize="small" />} value="communities" />
      <BottomNavigationAction label="Calls" icon={<Call fontSize="small" />} value="calls" />
      <BottomNavigationAction label="Updates" icon={<Update fontSize="small" />} value="updates" />
    </BottomNavigation>
  );
};

export default BottomNavbar;
