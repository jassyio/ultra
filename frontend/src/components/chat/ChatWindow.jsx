import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { SocketContext } from "../../context/SocketContext";
import { AuthContext } from "../../context/AuthContext";
import { Box, Typography, Alert } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Message from "./Message";
import MessageInput from "./MessageInput";
import TopNavbar from "../layout/TopNavbar";

const ChatWindow = () => {
  const {
    chats,
    selectedChat,
    setSelectedChat,
    loading,
    error,
    clearError,
    updateChatWithNewMessage
  } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  const {
    socket,
    isConnected,
    messages: allMessages,
    joinChatRoom,
    leaveChatRoom,
    sendMessage
  } = useContext(SocketContext);

  const [connectionError, setConnectionError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const [typingStatus, setTypingStatus] = useState(null);
  const [isOnline, setIsOnline] = useState(false);

  // Defensive: Don't render if no chat selected
  if (!selectedChat) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        Select a chat to start messaging
      </div>
    );
  }

  // Get chat partner from chat list
  const chatPartner =
    chats.find((c) => c._id === selectedChat._id)?.participants.find(
      (p) => p._id !== user?.id
    );

  // Get messages for the current chat
  const messages = allMessages[selectedChat._id] || [];

  // Socket status tracking and room management
  useEffect(() => {
    if (!socket || !selectedChat?._id) return;

    const joinRoom = () => {
      socket.emit("joinRoom", selectedChat._id);
    };

    const handleRoomJoined = (data) => {
      if (data.chatId === selectedChat._id) {
        setConnectionError(null);
      }
    };

    const handleConnectionError = (error) => {
      setConnectionError("Connection lost. Attempting to reconnect...");
      if (retryCount < maxRetries) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          joinRoom();
        }, Math.min(1000 * Math.pow(2, retryCount), 5000));
      } else {
        setConnectionError("Unable to connect. Please try refreshing the page.");
      }
    };

    socket.on("roomJoined", handleRoomJoined);
    socket.on("connect_error", handleConnectionError);
    socket.on("error", handleConnectionError);

    if (isConnected) {
      joinRoom();
    }

    return () => {
      socket.off("roomJoined", handleRoomJoined);
      socket.off("connect_error", handleConnectionError);
      socket.off("error", handleConnectionError);
      if (selectedChat?._id) {
        socket.emit("leaveRoom", selectedChat._id);
      }
    };
  }, [socket, selectedChat?._id, isConnected, retryCount]);

  // Reset retry count when changing chats
  useEffect(() => {
    setRetryCount(0);
    setConnectionError(null);
  }, [selectedChat?._id]);

  // Typing indicator
  useEffect(() => {
    if (selectedChat?._id && socket?.connected) {
      socket.on("typing", (data) => {
        if (data.chatId === selectedChat._id && data.sender !== user?.id) {
          setTypingStatus(data);
        }
      });

      return () => {
        socket.off("typing");
      };
    }
  }, [selectedChat?._id, socket?.connected, user?.id]);

  // Handle online status
  useEffect(() => {
    if (socket && chatPartner?._id) {
      const handleUserOnline = (userId) => {
        if (userId === chatPartner._id) setIsOnline(true);
      };
      const handleUserOffline = (userId) => {
        if (userId === chatPartner._id) setIsOnline(false);
      };
      socket.on("userOnline", handleUserOnline);
      socket.on("userOffline", handleUserOffline);
      return () => {
        socket.off("userOnline", handleUserOnline);
        socket.off("userOffline", handleUserOffline);
      };
    }
  }, [socket, chatPartner?._id]);

  const handleSendMessage = (content) => {
    if (!selectedChat?._id || !content.trim() || !user?.id) return;
    if (!socket?.connected) {
      if (socket) socket.connect();
      return;
    }
    const newMsg = {
      content: content.trim(),
      sender: user.id,
      chatId: selectedChat._id,
      createdAt: new Date().toISOString()
    };
    joinChatRoom(selectedChat._id);
    const pendingMessage = sendMessage(selectedChat._id, newMsg);
    if (pendingMessage) {
      updateChatWithNewMessage(selectedChat._id, pendingMessage);
    }
  };

  if (!chatPartner) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <TopNavbar
        title={chatPartner?.name || "Chat"}
        avatar={chatPartner?.avatar || "/default-avatar.png"}
        showBackButton={!!selectedChat}
        onBack={() => setSelectedChat(null)}
      />

      {connectionError && (
        <Alert severity="error" sx={{ m: 1 }}>
          {connectionError}
        </Alert>
      )}

      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          height: '100%',
          position: 'relative'
        }}
      >
        {/* Messages Container */}
        <Box 
          sx={{ 
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#f0f2f5',
            pb: 2
          }}
          className="dark:bg-gray-900"
        >
          <Box sx={{ py: 3, px: '5%' }}>
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <Message 
                  key={`${msg._id || msg.createdAt}-${index}`}
                  message={msg}
                  isOwnMessage={msg.sender === user?.id}
                  isPending={msg.pending}
                />
              ))
            ) : (
              <Box 
                sx={{ 
                  textAlign: 'center',
                  color: '#8696a0',
                  mt: 10,
                  fontSize: '0.875rem'
                }}
              >
                No messages yet
              </Box>
            )}
            {typingStatus && typingStatus.sender !== user?.id && (
              <Box 
                sx={{ 
                  color: '#8696a0',
                  fontSize: '0.75rem',
                  px: 4 
                }}
              >
                typing...
              </Box>
            )}
          </Box>
        </Box>

        {/* Message Input - Fixed at bottom */}
        <Box 
          sx={{ 
            position: 'sticky',
            bottom: 0,
            width: '100%',
            bgcolor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider'
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
    </Box>
  );
};

export default ChatWindow;