import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { Chat, Groups, Call, Update } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext"; // Import ChatContext

const BottomNavbar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const { selectedChat } = useContext(ChatContext); // Get chat state

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue.toLowerCase()}`); // Navigate to the selected page
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
        bgcolor: "background.paper",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
        zIndex: 1000,
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
