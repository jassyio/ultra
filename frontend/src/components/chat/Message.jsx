import { Box, Typography } from "@mui/material";

const Message = ({ msg }) => {
  const isUser = msg.sender === "you";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      <Box
        sx={{
          backgroundColor: isUser ? "#007AFF" : "#E5E5EA",
          color: isUser ? "white" : "black",
          borderRadius: "12px",
          padding: "12px",
          maxWidth: "75%",
          fontSize: "0.9rem",
          boxShadow: 1,
        }}
      >
        <Typography variant="body2">{msg.text}</Typography>

        {/* Timestamp & Status */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            fontSize: "0.7rem",
            marginTop: "6px",
            color: isUser ? "#d1eaff" : "gray",
            gap: "6px",
          }}
        >
          <span>{msg.timestamp}</span>
          {isUser && (
            <span>
              {msg.status === "sent" && "✔️"}
              {msg.status === "delivered" && "✔✔️"}
              {msg.status === "read" && <span style={{ color: "#34B7F1" }}>✔✔️</span>}
            </span>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Message;
