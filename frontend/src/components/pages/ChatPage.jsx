import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
  Avatar,
} from "@mui/material";
import TopNavbar from "../layout/TopNavbar";
import MessageInput from "../chat/MessageInput";
import Message from "../chat/Message";
import FloatingButton from "../common/FloatingButton";
import AddIcon from "@mui/icons-material/Add";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContext";
import AddChatModal from "../chat/AddChatModal";

const ChatPage = () => {
  const {
    chats,
    selectedChat,
    setSelectedChat,
    loading,
    error,
    clearError,
    addMessageToChat,
  } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  const { socket, getChatMessages, addMessage } = useContext(SocketContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  // Socket status tracking
  useEffect(() => {
    if (socket) {
      socket.on("connect", () => setSocketConnected(true));
      socket.on("disconnect", () => setSocketConnected(false));

      return () => {
        socket.off("connect");
        socket.off("disconnect");
      };
    }
  }, [socket]);

  const currentMessages = selectedChat
    ? getChatMessages(selectedChat._id)
    : [];

  // ✅ Get chat partner from chat list like in ChatList.jsx
  const chatPartner =
    selectedChat &&
    chats.find((c) => c._id === selectedChat._id)?.participants.find(
      (p) => p._id !== user?.id
    );

  const handleSendMessage = async (chatId, content) => {
    try {
      const tempMessage = {
        content,
        sender: user.id,
        chatId,
        createdAt: new Date().toISOString(),
        pending: true,
      };
      addMessage(chatId, tempMessage);
      const savedMessage = await addMessageToChat(chatId, content);
      addMessage(chatId, { ...savedMessage, pending: false });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <TopNavbar
        title={selectedChat ? chatPartner?.name || "Chat" : "Ultra"}
        avatar={
          selectedChat ? chatPartner?.avatar || "/default-avatar.png" : undefined
        }
        showBackButton={!!selectedChat}
        onBack={() => setSelectedChat(null)}
      />

      <Box sx={{ flex: 1, position: "relative", mt: "48px" }}>
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              zIndex: 1000,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={clearError}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={clearError} severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>

        {!selectedChat ? (
          <Box sx={{ flex: 1, overflowY: "auto", p: 1 }}>
            {chats.length > 0 ? (
              chats.map((chat) => {
                const partner = chat.participants.find(
                  (p) => p._id !== user?.id
                );
                return (
                  <Box
                    key={`chat-${chat._id}`}
                    onClick={() => setSelectedChat(chat)}
                    sx={{
                      p: 2,
                      mb: 1,
                      borderRadius: 1,
                      cursor: "pointer",
                      backgroundColor: "background.paper",
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      src={partner?.avatar || "/default-avatar.png"}
                      alt={partner?.name}
                      sx={{ width: 48, height: 48, mr: 2 }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {partner?.name}
                      </Typography>
                      {chat.lastMessage && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                        >
                          {chat.lastMessage.sender === user?.id ? "You: " : ""}
                          {chat.lastMessage.content}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                );
              })
            ) : (
              <Typography sx={{ textAlign: "center", mt: 2, color: "gray" }}>
                {loading
                  ? "Loading chats..."
                  : "No chats available. Start a new conversation!"}
              </Typography>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              height: "calc(100vh - 48px)",
            }}
          >
            <Box
              sx={{
                flex: 1,
                p: 2,
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
              }}
            >
              {currentMessages.length > 0 ? (
                currentMessages.map((msg, i) => (
                  <Message
                    key={`msg-${msg._id || msg.createdAt}-${i}`}
                    message={msg}
                    isOwnMessage={msg.sender === user?.id}
                    isPending={msg.pending}
                  />
                ))
              ) : (
                <Typography sx={{ textAlign: "center", mt: 2, color: "gray" }}>
                  No messages yet. Start the conversation!
                </Typography>
              )}
            </Box>
            <MessageInput
              chatId={selectedChat._id}
              onMessageSent={(content) =>
                handleSendMessage(selectedChat._id, content)
              }
              disabled={!socketConnected}
            />
          </Box>
        )}
      </Box>

      {!selectedChat && (
        <FloatingButton
          icon={<AddIcon />}
          onClick={() => setModalOpen(true)}
          disabled={loading}
        />
      )}

      <AddChatModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  );
};

export default ChatPage;
