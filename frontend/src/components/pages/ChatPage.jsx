import React, { useState, useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { Box, Typography, Modal, TextField, Button, Backdrop, Fade } from "@mui/material";
import TopNavbar from "../layout/TopNavbar";
import MessageInput from "../chat/MessageInput";
import Message from "../chat/Message";
import FloatingButton from "../common/FloatingButton";
import AddIcon from "@mui/icons-material/Add";

const ChatPage = () => {
  const { chats, selectedChat, setSelectedChat, setChats } = useContext(ChatContext);

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [invitePrompt, setInvitePrompt] = useState(false);

  // Mock verified users (for now, replace with real verification logic)
  const verifiedUsers = ["alice@example.com", "bob@example.com"];

  const handleNewChat = () => {
    setOpen(true);
    setEmail("");
    setInvitePrompt(false);
  };

  const handleEmailSubmit = () => {
    const emailLower = email.toLowerCase();
    if (verifiedUsers.includes(emailLower)) {
      const newChat = {
        id: Date.now().toString(),
        name: emailLower,
        avatar: "/default-avatar.png",
        messages: [],
        lastMessage: "",
      };
      setChats((prevChats) => [...prevChats, newChat]);
      setSelectedChat(newChat);
      setOpen(false);
    } else {
      setInvitePrompt(true);
    }
  };

  const handleInvite = () => {
    alert(`Invitation sent to ${email}`);
    setOpen(false);
  };

  const handleCancelInvite = () => {
    setOpen(false);
  };

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
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  style={{ width: 40, height: 40, borderRadius: "50%" }}
                />
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

          <MessageInput sendMessage={sendMessage} />
        </Box>
      )}

      {/* Floating Button */}
      <FloatingButton icon={<AddIcon />} onClick={handleNewChat} />

      {/* New Chat Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: { timeout: 500, sx: { zIndex: 5 } }, // Set zIndex for the backdrop to ensure button is on top
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
              width: 300,
              zIndex: 10, // Higher z-index for modal content
            }}
          >
            <Typography variant="h6" mb={2}>
              Start New Chat
            </Typography>
            <TextField
              fullWidth
              label="Enter user email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              margin="normal"
            />
            {invitePrompt ? (
              <>
                <Typography variant="body2" color="textSecondary" mt={1}>
                  User not found. Invite to join?
                </Typography>
                <Box mt={2} display="flex" justifyContent="space-between">
                  <Button onClick={handleInvite} color="primary" variant="contained">
                    Invite
                  </Button>
                  <Button onClick={handleCancelInvite} color="secondary" variant="outlined">
                    Cancel
                  </Button>
                </Box>
              </>
            ) : (
              <Button
                onClick={handleEmailSubmit}
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
              >
                Start Chat
              </Button>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default ChatPage;
