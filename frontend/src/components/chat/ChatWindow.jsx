import { useContext, useEffect, useRef } from "react";
import { ChatContext } from "../../context/ChatContext";
import { SocketContext } from "../../context/SocketContext";
import { AuthContext } from "../../context/AuthContext";
import { Box } from "@mui/material";
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
    setMessages,
  } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  const { socket, isConnected } = useContext(SocketContext);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (selectedChat?._id) {
      fetchMessagesForChat(selectedChat._id);
    }
  }, [selectedChat?._id]);

  // Update socket handler to be more robust
  useEffect(() => {
    if (!socket || !selectedChat) return;

    const handleIncomingMessage = (message) => {
      if (!message || !message.chatId) {
        console.warn("Received invalid socket message", message);
        return;
      }

      const chatId = message.chatId || message.chat?._id;

      // Don't skip your own messages - let the handler dedupe them
      updateChatWithNewMessage(chatId, message);
    };

    socket.on("message received", handleIncomingMessage);
    return () => socket.off("message received", handleIncomingMessage);
  }, [socket, selectedChat?._id, updateChatWithNewMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages[selectedChat?._id]?.length]);

  const chat = chats.find((c) => c._id === selectedChat?._id);

  let chatPartner = null;
  let chatTitle = "Chat";
  let chatAvatar = "/default-avatar.png";

  if (chat) {
    if (Array.isArray(chat.participants)) {
      // Direct chat
      chatPartner = chat.participants.find((p) => p._id !== user?.id);
      chatTitle = chatPartner?.name || "Chat";
      chatAvatar = chatPartner?.avatar || "/default-avatar.png";
    } else if (Array.isArray(chat.members)) {
      // Group chat
      chatTitle = chat.name || "Group";
      chatAvatar = "/default-group-avatar.png";
    }
  }

  if (!selectedChat || (!chatPartner && !Array.isArray(chat?.members))) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        Select a chat to start messaging
      </div>
    );
  }

  const chatMessages = messages[selectedChat._id] || [];

  const handleSendMessage = async (content) => {
    if (!selectedChat?._id || !content.trim() || !user?.id) return;

    const pendingMsg = {
      _id: Date.now().toString(),
      sender: user.id,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      chatId: selectedChat._id,
      isPending: true, // Make sure this is set!
    };

    addMessageToChat(selectedChat._id, pendingMsg);
    updateChatWithNewMessage(selectedChat._id, pendingMsg); // Only call updateChatWithNewMessage once with the pending message

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

      const confirmed = data.data;

      setMessages((prev) => {
        const existing = prev[selectedChat._id] || [];
        const filtered = existing.filter(
          (m) => !(m.isPending && m.content === content.trim()) // Remove reference to tempId
        );
        return {
          ...prev,
          [selectedChat._id]: [...filtered, confirmed],
        };
      });

      // No call to updateChatWithNewMessage here anymore (avoid double)
    } catch (err) {
      console.error("Message send failed", err);
    }
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <TopNavbar
        title={chatTitle}
        avatar={chatAvatar}
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
                key={msg._id || msg.tempId || index}
                message={msg}
                isOwnMessage={
                  (typeof msg.sender === "object"
                    ? msg.sender._id
                    : msg.sender) === user.id
                }
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
          <div ref={messagesEndRef} />
        </Box>
      </Box>

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
