import { useContext, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext";
import { SocketContext } from "../../context/SocketContext";
import { AuthContext } from "../../context/AuthContext";
import { Box, Alert } from "@mui/material";
import Message from "./Message";
import MessageInput from "./MessageInput";
import TopNavbar from "../layout/TopNavbar";
import axios from "axios";

const ChatWindow = () => {
  const {
    chats,
    selectedChat,
    setSelectedChat,
    messages,
    fetchMessagesForChat,
    addMessageToChat,
    updateChatWithNewMessage,
  } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  const { isConnected } = useContext(SocketContext);

  // Fetch messages for selected chat
  useEffect(() => {
    if (selectedChat?._id) {
      fetchMessagesForChat(selectedChat._id);
    }
  }, [selectedChat?._id]);

  // Get chat partner
  const chatPartner =
    chats.find((c) => c._id === selectedChat?._id)?.participants.find(
      (p) => p._id !== user?.id
    );

  // Defensive: Don't render if no chat selected or no partner
  if (!selectedChat || !chatPartner) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        Select a chat to start messaging
      </div>
    );
  }

  const chatMessages = messages[selectedChat._id] || [];

  // Optimistic send
  const handleSendMessage = async (content) => {
    if (!selectedChat?._id || !content.trim() || !user?.id) return;
    const tempId = Date.now().toString();
    const pendingMsg = {
      _id: tempId,
      sender: user.id,
      content,
      createdAt: new Date().toISOString(),
      isPending: true,
    };
    addMessageToChat(selectedChat._id, pendingMsg);

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `http://localhost:3001/api/messages/send`,
        {
          chatId: selectedChat._id,
          sender: user.id,
          content: content.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Replace pending with real message
      addMessageToChat(selectedChat._id, data.data);
      updateChatWithNewMessage(selectedChat._id, data.data);
    } catch {
      // Optionally show error or mark as failed
    }
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <TopNavbar
        title={chatPartner?.name || "Chat"}
        avatar={chatPartner?.avatar || "/default-avatar.png"}
        showBackButton={!!selectedChat}
        onBack={() => setSelectedChat(null)}
      />

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          bgcolor: "#f0f2f5",
          pb: 2,
          display: "flex",
          flexDirection: "column",
        }}
        className="dark:bg-gray-900"
      >
        <Box sx={{ py: 3, px: "5%" }}>
          {chatMessages.length > 0 ? (
            chatMessages.map((msg, index) => (
              <Message
                key={msg._id || index}
                message={msg}
                isOwnMessage={msg.sender === user.id}
                isPending={msg.isPending}
              />
            ))
          ) : (
            <Box
              sx={{
                textAlign: "center",
                color: "#8696a0",
                mt: 10,
                fontSize: "0.875rem",
              }}
            >
              No messages yet
            </Box>
          )}
        </Box>
      </Box>

      {/* Message Input */}
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          width: "100%",
          bgcolor: "background.paper",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
        className="dark:bg-gray-800 dark:border-gray-700"
      >
        <MessageInput
          chatId={selectedChat._id}
          onMessageSent={handleSendMessage}
          disabled={!isConnected}
        />
      </Box>
    </Box>
  );
};

export default ChatWindow;