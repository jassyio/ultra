import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { Box, Typography } from "@mui/material";
import TopNavbar from "../layout/TopNavbar";
import MessageInput from "../chat/MessageInput";
import Message from "../chat/Message";

const ChatPage = () => {
  const { chats, selectedChat, setSelectedChat } = useContext(ChatContext);

  // 🛠️ Fix: Ensure `selectedChat.messages` exists
  const sendMessage = (newMessage) => {
    if (!selectedChat) return;

    setSelectedChat((prevChat) => {
      const updatedChat = { ...prevChat };
      if (!updatedChat.messages) updatedChat.messages = [];
      updatedChat.messages.push(newMessage);
      return updatedChat;
    });
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <TopNavbar title={selectedChat ? selectedChat.name : "Ultra"} />

      {!selectedChat ? (
        <Box sx={{ flex: 1, overflowY: "auto", p: 1, mt: "48px" }}>
          {chats?.length > 0 ? (
            chats.map((chat) => (
              <Box
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px",
                  borderBottom: "1px solid #ccc",
                  cursor: "pointer",
                }}
              >
                <img src={chat.avatar} alt={chat.name} style={{ width: 40, height: 40, borderRadius: "50%" }} />
                <Box sx={{ marginLeft: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {chat.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "gray" }}>
                    {chat.lastMessage}
                  </Typography>
                </Box>
              </Box>
            ))
          ) : (
            <Typography sx={{ textAlign: "center", mt: 2 }}>No chats available</Typography>
          )}
        </Box>
      ) : (
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", mt: "48px", overflowY: "auto" }}>
          <Box sx={{ flex: 1, overflowY: "auto", p: 2, display: "flex", flexDirection: "column" }}>
            {selectedChat.messages?.length > 0 ? (
              selectedChat.messages.map((msg, index) => <Message key={index} msg={msg} />)
            ) : (
              <Typography sx={{ textAlign: "center", mt: 2 }}>No messages yet</Typography>
            )}
          </Box>

          {/* 🛠️ Fix: Pass the function correctly */}
          <MessageInput sendMessage={sendMessage} />
        </Box>
      )}
    </Box>
  );
};

export default ChatPage;
