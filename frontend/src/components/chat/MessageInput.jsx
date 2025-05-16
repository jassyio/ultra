import { useState, useContext, useEffect } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import { Send, AttachFile } from "@mui/icons-material";
import { SocketContext } from "../../context/SocketContext";
import { AuthContext } from "../../context/AuthContext";

const MessageInput = ({ chatId, onMessageSent }) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { socket } = useContext(SocketContext);
  const { user } = useContext(AuthContext);

  // Emit typing status after user stops typing for a moment (debounced)
  useEffect(() => {
    let typingTimeout;

    if (message.trim() && socket) {
      setIsTyping(true);
      socket.emit("typing", { 
        sender: user?.name || "User", 
        chatId, 
        isTyping: true 
      });

      typingTimeout = setTimeout(() => {
        socket.emit("typing", { 
          sender: user?.name || "User", 
          chatId, 
          isTyping: false 
        });
        setIsTyping(false);
      }, 1500);
    } else {
      setIsTyping(false);
      if (socket) {
        socket.emit("typing", { 
          sender: user?.name || "User", 
          chatId, 
          isTyping: false 
        });
      }
    }

    return () => clearTimeout(typingTimeout);
  }, [message, socket, chatId, user]);

  const handleSend = () => {
    if (message.trim() === "") return;

    // Call the onMessageSent callback with the message content
    onMessageSent(message.trim());
    setMessage(""); // Clear the input
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
        padding: "10px",
        borderTop: "1px solid #ccc",
        bgcolor: "background.paper",
      }}
      className="dark:bg-gray-800 dark:border-gray-700"
    >
      {/* Attach File Button */}
      <IconButton sx={{ mr: 1 }} className="text-gray-600 dark:text-gray-400">
        <AttachFile />
      </IconButton>

      {/* Message Input */}
      <TextField
        fullWidth
        placeholder="Type a message..."
        variant="outlined"
        size="small"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        multiline
        maxRows={4}
        sx={{
          borderRadius: "20px",
          bgcolor: "white",
          flex: 1,
          "& .MuiOutlinedInput-root": {
            borderRadius: "20px",
          }
        }}
        className="dark:bg-gray-700 dark:text-white"
      />

      {/* Send Button */}
      <IconButton 
        onClick={handleSend} 
        sx={{ ml: 1 }}
        disabled={!message.trim()}
        className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500"
      >
        <Send />
      </IconButton>
    </Box>
  );
};

export default MessageInput;