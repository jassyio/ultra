import { createContext, useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "./AuthContext";
import { ChatContext } from "./ChatContext";
import io from "socket.io-client";
import axios from "axios";

export const SocketContext = createContext();

const BACKEND_URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL_HOSTED
    : import.meta.env.VITE_BACKEND_URL_LOCAL;

const handleLogin = async (credentials) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/auth/login`, credentials, {
      withCredentials: true, // Include cookies and authentication headers
    });
    console.log("Login successful:", response.data);
  } catch (error) {
    console.error("Login error:", error);
  }
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useContext(AuthContext);
  const { updateChatWithNewMessage } = useContext(ChatContext);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    if (!user?.id) return;

    let newSocket;
    let reconnectTimer;

    const connectSocket = () => {
      const token = localStorage.getItem('token');
      if (!user?.id || !token) return null;
      return io(BACKEND_URL, {
        transports: ["websocket"],
        withCredentials: true,
        auth: { userId: user.id, token },
        reconnection: false,
      });
    };

    newSocket = connectSocket();
    if (!newSocket) return;

    newSocket.on("connect", () => {
      setIsConnected(true);
      reconnectAttempts.current = 0;
      if (user?.id) newSocket.emit("userOnline", user.id);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      if (reconnectAttempts.current < maxReconnectAttempts) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
        reconnectTimer = setTimeout(() => {
          reconnectAttempts.current += 1;
          if (socket) socket.disconnect();
          setSocket(null);
        }, delay);
      }
    });

    newSocket.on("connect_error", (error) => {
      setIsConnected(false);
      if (reconnectAttempts.current < maxReconnectAttempts) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
        reconnectTimer = setTimeout(() => {
          reconnectAttempts.current += 1;
          if (socket) socket.disconnect();
          setSocket(null);
        }, delay);
      }
    });

    // Handle receiveMessage
    newSocket.on("receiveMessage", (message) => {
      setMessages(prevMessages => {
        const chatMessages = prevMessages[message.chatId] || [];
        let replaced = false;
        const updatedMessages = chatMessages.map(msg => {
          if (msg._id === message._id) {
            replaced = true;
            return { ...message };
          }
          return msg;
        });
        if (!replaced && !updatedMessages.some(msg => msg._id === message._id)) {
          updatedMessages.push({ ...message });
        }
        return {
          ...prevMessages,
          [message.chatId]: updatedMessages
        };
      });
      updateChatWithNewMessage && updateChatWithNewMessage(message.chatId, message);

      // If the message is not from me, emit delivered status
      if (message.sender !== user.id && message.status !== "delivered") {
        socket.emit("messageDelivered", {
          messageId: message._id,
          chatId: message.chatId
        });
      }
    });

    // Handle messageSent (confirmation from server)
    newSocket.on("messageSent", (message) => {
      setMessages(prevMessages => {
        const chatMessages = prevMessages[message.chatId] || [];
        let replaced = false;
        const updatedMessages = chatMessages.map(msg => {
          if (msg._id === message._id) {
            replaced = true;
            return { ...message };
          }
          return msg;
        });
        if (!replaced && !updatedMessages.some(msg => msg._id === message._id)) {
          updatedMessages.push({ ...message });
        }
        return {
          ...prevMessages,
          [message.chatId]: updatedMessages
        };
      });
      updateChatWithNewMessage && updateChatWithNewMessage(message.chatId, message);
    });

    // Handle messageDelivered (update status to delivered)
    newSocket.on("messageDelivered", ({ messageId, chatId }) => {
      setMessages(prevMessages => {
        const chatMessages = prevMessages[chatId] || [];
        const updatedMessages = chatMessages.map(msg =>
          msg._id === messageId ? { ...msg, status: "delivered" } : msg
        );
        return {
          ...prevMessages,
          [chatId]: updatedMessages
        };
      });
    });

    // Handle messageRead (update status to read)
    newSocket.on("messageRead", ({ messageId, chatId }) => {
      setMessages(prevMessages => {
        const chatMessages = prevMessages[chatId] || [];
        const updatedMessages = chatMessages.map(msg =>
          msg._id === messageId ? { ...msg, status: "read" } : msg
        );
        return {
          ...prevMessages,
          [chatId]: updatedMessages
        };
      });
    });

    setSocket(newSocket);

    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (newSocket) newSocket.disconnect();
    };
  }, [user, updateChatWithNewMessage]);

  // Send message with status "sent"
  const sendMessage = (chatId, message) => {
    if (!socket || !isConnected) {
      console.error("❌ Cannot send message: Socket not connected");
      return null;
    }
    if (!user?.id) {
      console.error("❌ Cannot send message: No user authenticated");
      return null;
    }
    const pendingMessage = {
      _id: Date.now().toString(),
      content: message.content.trim(),
      sender: user.id,
      chatId: chatId,
      createdAt: new Date().toISOString(),
      status: "sent"
    };
    setMessages(prevMessages => {
      const chatMessages = prevMessages[chatId] || [];
      return {
        ...prevMessages,
        [chatId]: [...chatMessages, pendingMessage]
      };
    });
    socket.emit("sendMessage", {
      content: message.content.trim(),
      chatId: chatId,
      sender: user.id
    });
    updateChatWithNewMessage && updateChatWithNewMessage(chatId, pendingMessage);
    return pendingMessage;
  };

  // Call this when user opens a chat to mark all as read
  const markMessagesAsRead = (chatId) => {
    if (!socket || !isConnected) return;
    const chatMessages = messages[chatId] || [];
    chatMessages.forEach(msg => {
      if (msg.sender !== user.id && msg.status !== "read") {
        socket.emit("messageRead", {
          messageId: msg._id,
          chatId: chatId
        });
      }
    });
  };

  const joinChatRoom = (chatId) => {
    if (!socket || !isConnected) return;
    socket.emit("joinRoom", chatId);
  };

  const leaveChatRoom = (chatId) => {
    if (!socket || !isConnected) return;
    socket.emit("leaveRoom", chatId);
  };

  return (
    <SocketContext.Provider value={{
      socket,
      isConnected,
      messages,
      sendMessage,
      joinChatRoom,
      leaveChatRoom,
      markMessagesAsRead // <-- Export this for use in your chat UI
    }}>
      {children}
    </SocketContext.Provider>
  );
};