import { useState } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import { Send, AttachFile } from "@mui/icons-material";

const MessageInput = ({ sendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() === "") return; // Prevent empty messages
    const newMsg = {
      text: message,
      sender: "you",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
    };
    sendMessage(newMsg); // Send the message
    setMessage(""); // Clear input after sending
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
    >
      {/* Attach File Icon */}
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
  );
};

export default MessageInput;
