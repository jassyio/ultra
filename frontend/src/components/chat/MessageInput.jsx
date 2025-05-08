import { useState, useContext, useEffect } from "react";
import { Box, TextField, IconButton, List, ListItem, ListItemText } from "@mui/material";
import { Send, AttachFile } from "@mui/icons-material";
import { SocketContext } from "../../context/SocketContext"; // Import the SocketContext

const MessageInput = ({ chatId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // State to store messages
  const [isTyping, setIsTyping] = useState(false); // Track typing status
  const { socket } = useContext(SocketContext); // Access socket from context

  // Emit typing status after user stops typing for a moment (debounced)
  useEffect(() => {
    let typingTimeout;

    if (message.trim()) {
      setIsTyping(true);
      typingTimeout = setTimeout(() => {
        if (socket) {
          socket.emit("typing", { sender: "you", chatId, isTyping: false });
          setIsTyping(false); // Stop typing status after user stops typing
        }
      }, 1500); // Typing indicator appears after 1.5 seconds of inactivity
    } else {
      setIsTyping(false);
    }

    return () => clearTimeout(typingTimeout);
  }, [message, socket, chatId]);

  const handleSend = () => {
    if (message.trim() === "") return;

    const newMsg = {
      text: message,
      sender: "you",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
      chatId: chatId, // Attach chatId
    };

    // Emit the message through socket.io
    socket.emit("sendMessage", newMsg); // Emit message to server

    // Update the messages state to display the sent message
    setMessages((prevMessages) => [...prevMessages, newMsg]);

    setMessage(""); // Clear the input
  };

  const handleTyping = () => {
    if (socket && message.trim()) {
      socket.emit("typing", { sender: "you", chatId, isTyping: true }); // Notify the other user that the current user is typing
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Messages List */}
      <List sx={{ flex: 1, overflowY: "auto", padding: "10px" }}>
        {messages.map((msg, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={msg.text}
              secondary={`${msg.sender} - ${msg.timestamp}`}
            />
          </ListItem>
        ))}
      </List>

      {/* Input Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "10px",
          borderTop: "1px solid #ccc",
          bgcolor: "background.paper",
        }}
      >
        {/* Attach File Button */}
        <IconButton sx={{ mr: 1 }}>
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
          onKeyUp={handleTyping} // Emit typing status when the user types
          onBlur={() => {
            if (socket && message.trim()) {
              socket.emit("typing", { sender: "you", chatId, isTyping: false });
            }
          }}
          multiline
          sx={{
            borderRadius: "20px",
            bgcolor: "white",
            flex: 1,
          }}
        />

        {/* Send Button */}
        <IconButton onClick={handleSend} sx={{ ml: 1 }}>
          <Send color="primary" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MessageInput;