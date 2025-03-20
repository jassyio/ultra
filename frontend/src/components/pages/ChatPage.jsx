import React, { useEffect, useState, useContext } from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { Chat, Groups, Update, Call } from "@mui/icons-material";
import { ChatContext } from "../../context/ChatContext";
import ChatList from "../chat/ChatList";
import ChatWindow from "../chat/ChatWindow";
import Updates from "../pages/UpdatesPage";
import Communities from "../pages/CommunitiesPage";
import Calls from "../pages/CallsPage";

const ChatPage = ({ setShowNavbar }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const { selectedChat } = useContext(ChatContext); // To track if a chat is open

  useEffect(() => {
    if (setShowNavbar) {
      setShowNavbar(true); // Ensure navbar is visible on this page
    }
  }, [setShowNavbar]);

  return (
    <div className="flex flex-col h-screen">
      {/* Main Content (Changes Based on Tab) */}
      <div className="flex-1 overflow-hidden">
        {tabIndex === 0 && (selectedChat ? <ChatWindow /> : <ChatList />)}
        {tabIndex === 1 && <Updates />}
        {tabIndex === 2 && <Communities />}
        {tabIndex === 3 && <Calls />}
      </div>

      {/* Bottom Navigation (WhatsApp-Like Tabs) */}
      <BottomNavigation
        value={tabIndex}
        onChange={(event, newIndex) => setTabIndex(newIndex)}
        showLabels
        sx={{ position: "fixed", bottom: 0, width: "100%", boxShadow: 2 }}
      >
        <BottomNavigationAction label="Chats" icon={<Chat />} />
        <BottomNavigationAction label="Updates" icon={<Update />} />
        <BottomNavigationAction label="Communities" icon={<Groups />} />
        <BottomNavigationAction label="Calls" icon={<Call />} />
      </BottomNavigation>
    </div>
  );
};

export default ChatPage;
