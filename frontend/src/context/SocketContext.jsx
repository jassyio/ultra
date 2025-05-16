import { createContext, useState, useEffect } from "react";
import io from "socket.io-client";

// Create the Socket Context
export const SocketContext = createContext();

// Your backend WebSocket server URL
const SOCKET_SERVER_URL = "http://localhost:3001";

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState({});  // Change to object to store messages by chatId

  useEffect(() => {
    // Connect to the Socket.IO server
    const newSocket = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
      withCredentials: true, // Useful if the server uses authentication
    });

    setSocket(newSocket);

    // Listen for incoming messages
    newSocket.on("receiveMessage", (message) => {
      console.log("📨 New message received:", message);
      // Store only necessary message data
      const cleanedMessage = {
        _id: message._id,
        content: message.content,
        sender: message.sender,
        chatId: message.chatId,
        createdAt: message.createdAt
      };
      setMessages((prevMessages) => ({
        ...prevMessages,
        [message.chatId]: [...(prevMessages[message.chatId] || []), cleanedMessage]
      }));
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
      newSocket.off("receiveMessage");
      newSocket.off("connect_error");
      newSocket.off("reconnect");
      newSocket.off("reconnect_error");
      newSocket.close();
    };
  }, []);

  // Function to add a new message locally
  const addMessage = (chatId, message) => {
    // Store only necessary message data
    const cleanedMessage = {
      _id: message._id,
      content: message.content,
      sender: message.sender,
      chatId: message.chatId,
      createdAt: message.createdAt,
      pending: message.pending
    };
    setMessages((prevMessages) => ({
      ...prevMessages,
      [chatId]: [...(prevMessages[chatId] || []), cleanedMessage]
    }));
  };

  // Get messages for a specific chat
  const getChatMessages = (chatId) => {
    return messages[chatId] || [];
  };

  return (
    <SocketContext.Provider value={{ 
      socket, 
      messages,
      addMessage,
      getChatMessages,
      setMessages 
    }}>
      {children}
    </SocketContext.Provider>
  );
};
