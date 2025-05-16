import { useState, useContext, useEffect } from "react";
import { Box, TextField, IconButton, CircularProgress } from "@mui/material";
import { Send, AttachFile } from "@mui/icons-material";
import { SocketContext } from "../../context/SocketContext";
import { AuthContext } from "../../context/AuthContext";

const MessageInput = ({ chatId, disabled }) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { socket, isConnected, sendMessage } = useContext(SocketContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    let typingTimeout;

    if (message.trim() && socket?.connected) {
      setIsTyping(true);
      socket.emit("typing", { 
        sender: user?.name || "User", 
        chatId, 
        isTyping: true 
      });

      typingTimeout = setTimeout(() => {
        if (socket?.connected) {
          socket.emit("typing", { 
            sender: user?.name || "User", 
            chatId, 
            isTyping: false 
          });
        }
        setIsTyping(false);
      }, 1500);
    } else {
      setIsTyping(false);
      if (socket?.connected) {
        socket.emit("typing", { 
          sender: user?.name || "User", 
          chatId, 
          isTyping: false 
        });
      }
    }

    return () => {
      clearTimeout(typingTimeout);
      if (socket?.connected) {
        socket.emit("typing", { 
          sender: user?.name || "User", 
          chatId, 
          isTyping: false 
        });
      }
    };
  }, [message, socket, chatId, user]);

  const handleSend = async () => {
    if (message.trim() === "" || !isConnected || isSending) return;

    const messageContent = message.trim();
    setIsSending(true);
    setMessage(""); // Clear input for UX

    try {
      sendMessage(chatId, { content: messageContent });
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessage(messageContent); // Restore input if failed
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        p: 2,
        borderTop: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper"
      }}
    >
      <IconButton
        color="primary"
        aria-label="attach file"
        disabled={!isConnected || isSending || disabled}
      >
        <AttachFile />
      </IconButton>
      
      <TextField
        fullWidth
        multiline
        maxRows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={isConnected ? "Type a message..." : "Connecting..."}
        disabled={!isConnected || isSending || disabled}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2
          }
        }}
      />
      
      <IconButton
        color="primary"
        aria-label="send message"
        onClick={handleSend}
        disabled={!message.trim() || !isConnected || isSending || disabled}
      >
        {isSending ? <CircularProgress size={24} /> : <Send />}
      </IconButton>
    </Box>
  );
};

export default MessageInput;