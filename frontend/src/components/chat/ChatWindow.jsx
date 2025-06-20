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

  // Fetch messages when chat opens
  useEffect(() => {
    if (selectedChat?._id) {
      fetchMessagesForChat(selectedChat._id);
    }
  }, [selectedChat?._id]);

  // Handle incoming socket messages
  useEffect(() => {
    if (!socket || !selectedChat) return;

    const handleIncomingMessage = (message) => {
      const chatId = message.chatId || message.chat?._id;

      // ✅ Normalize sender ID
      const senderId =
        typeof message.sender === "object" ? message.sender._id : message.sender;

      // ✅ Avoid re-adding messages from self
      if (senderId === user.id) return;

      updateChatWithNewMessage(chatId, message);
    };

    socket.on("message received", handleIncomingMessage);
    return () => socket.off("message received", handleIncomingMessage);
  }, [socket, selectedChat?._id, user.id, updateChatWithNewMessage]);

  // Scroll to bottom on message list update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages[selectedChat?._id]?.length]);

  const chatPartner = chats
    .find((c) => c._id === selectedChat?._id)
    ?.participants.find((p) => p._id !== user?.id);

  if (!selectedChat || !chatPartner) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        Select a chat to start messaging
      </div>
    );
  }

  const chatMessages = messages[selectedChat._id] || [];

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

    // ✅ Add pending message to UI
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

      const confirmed = data.data;

      // ✅ Replace pending with confirmed message
      setMessages((prev) => {
        const existing = prev[selectedChat._id] || [];
        const filtered = existing.filter(
          (m) =>
            !(
              m.isPending &&
              m.content === confirmed.content &&
              ((typeof m.sender === "object" ? m.sender._id : m.sender) === user.id)
            )
        );
        return {
          ...prev,
          [selectedChat._id]: [...filtered, confirmed],
        };
      });

      // ✅ Update chat preview (not messages again)
      setTimeout(() => {
        updateChatWithNewMessage(selectedChat._id, confirmed);
      }, 50);
    } catch (err) {
      console.error("Message send failed", err);
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
