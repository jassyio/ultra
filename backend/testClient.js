const io = require("socket.io-client");

// Connect to the backend WebSocket server (change to your backend URL if different)
const socket = io("http://localhost:3001");

// Wait for the connection to establish
socket.on("connect", () => {
  console.log("Connected to WebSocket server!");
  // Send a test message after connection
  socket.emit("send_message", "Hello from the test client!");
});

// Listen for incoming messages (if any)
socket.on("message", (message) => {
  console.log("Received message:", message);
});

// Handle disconnect event
socket.on("disconnect", () => {
  console.log("Disconnected from WebSocket server.");
});
