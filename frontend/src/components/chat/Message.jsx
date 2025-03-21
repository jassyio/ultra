import { Box, Typography } from "@mui/material";

const Message = ({ msg }) => {
  return (
    <Box
      sx={{
        alignSelf: msg.sender === "you" ? "flex-end" : "flex-start",
        backgroundColor: msg.sender === "you" ? "#007AFF" : "#E5E5EA",
        color: msg.sender === "you" ? "white" : "black",
        borderRadius: "12px",
        p: 1.5,
        mb: 1,
        maxWidth: "75%",
        position: "relative",
        fontSize: "0.9rem",
      }}
    >
      <Typography variant="body2">{msg.text}</Typography>

      {/* Timestamp & Read Receipts inside the message bubble */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          fontSize: "0.7rem",
          mt: "5px",
          color: msg.sender === "you" ? "#d1eaff" : "gray",
          gap: "4px",
        }}
      >
        <span>{msg.timestamp}</span>
        {msg.sender === "you" && (
          <span style={{ fontSize: "0.75rem" }}>
            {msg.status === "sent" ? "✔️" : msg.status === "delivered" ? "✔✔️" : <span style={{ color: "#34B7F1" }}>✔✔️</span>}
          </span>
        )}
      </Box>
    </Box>
  );
};

export default Message;
