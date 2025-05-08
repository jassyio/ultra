import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow"; // This is the chat display with messages
import { Box } from "@mui/material";

const ChatLayout = () => {
  const { selectedChat } = useContext(ChatContext);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        bgcolor: "background.default",
      }}
    >
      {/* Chat List Sidebar */}
      <Box
        sx={{
          width: { xs: "100%", sm: "35%", md: "30%" },
          borderRight: "1px solid #e0e0e0",
          display: { xs: selectedChat ? "none" : "block", sm: "block" },
        }}
      >
        <ChatList />
      </Box>

      {/* Chat Window Area */}
      <Box
        sx={{
          flex: 1,
          display: { xs: selectedChat ? "block" : "none", sm: "block" },
          position: "relative",
        }}
      >
        {selectedChat ? (
          <ChatWindow />
        ) : (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "text.secondary",
              fontSize: "1.1rem",
            }}
          >
            Select a chat to start messaging
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatLayout;
