import { createContext, useState, useEffect } from "react";
import io from "socket.io-client";

// Create the Socket Context
export const SocketContext = createContext();

// Your backend WebSocket server URL
const SOCKET_SERVER_URL = "http://localhost:3001";

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Connect to the Socket.IO server
    const newSocket = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
      withCredentials: true, // Useful if the server uses authentication
    });

    setSocket(newSocket);

    // Listen for incoming messages
    newSocket.on("message", (message) => {
      console.log("📨 New message received:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Handle connection errors
    newSocket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err);
    });

    // Handle reconnect attempts
    newSocket.on("reconnect", () => {
      console.log("🔄 Reconnected to the socket server");
    });

    newSocket.on("reconnect_error", (err) => {
      console.error("❌ Reconnection failed:", err);
    });

    // Clean up on unmount
    return () => {
      newSocket.off("message");
      newSocket.off("connect_error");
      newSocket.off("reconnect");
      newSocket.off("reconnect_error");
      newSocket.close();
    };
  }, []);

  // Function to emit messages
  const sendMessage = (messageContent) => {
    if (socket) {
      socket.emit("send_message", messageContent);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, messages, sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};
