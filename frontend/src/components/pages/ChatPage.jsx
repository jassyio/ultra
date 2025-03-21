import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { Box, List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography } from "@mui/material";
import TopNavbar from "../layout/TopNavbar";

const ChatPage = () => {
  const { chats, selectedChat, setSelectedChat } = useContext(ChatContext);

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Dynamic Navbar */}
      <TopNavbar title={selectedChat ? selectedChat.name : "Ultra"} />

      {/* Chat List View */}
      {!selectedChat ? (
        <Box sx={{ flex: 1, overflowY: "auto", p: 1, mt: "48px" }}> {/* Ensures it starts below navbar */}
          <List>
            {chats && chats.length > 0 ? (
              chats.map((chat) => (
                <ListItem key={chat.id} button onClick={() => setSelectedChat(chat)}>
                  <ListItemAvatar>
                    <Avatar src={chat.avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                        {chat.name.length > 10 ? chat.name.slice(0, 7) + "..." : chat.name}
                      </Typography>
                    }
                    secondary={chat.lastMessage}
                  />
                </ListItem>
              ))
            ) : (
              <Typography sx={{ textAlign: "center", mt: 2 }}>No chats available</Typography>
            )}
          </List>
        </Box>
      ) : (
        // Chat Window
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", p: 2, mt: "48px" }}>
          {selectedChat.messages && selectedChat.messages.length > 0 ? (
            selectedChat.messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  alignSelf: msg.sender === "you" ? "flex-end" : "flex-start",
                  backgroundColor: msg.sender === "you" ? "#007AFF" : "#E5E5EA",
                  color: msg.sender === "you" ? "white" : "black",
                  borderRadius: 2,
                  p: 1,
                  mb: 1,
                  maxWidth: "75%",
                }}
              >
                <Typography variant="body2">{msg.text}</Typography>
              </Box>
            ))
          ) : (
            <Typography sx={{ textAlign: "center", mt: 2 }}>No messages yet</Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ChatPage;
