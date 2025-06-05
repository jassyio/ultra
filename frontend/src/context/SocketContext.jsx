import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { ChatContext } from "./ChatContext";
import io from "socket.io-client";

export const SocketContext = createContext();

const SOCKET_SERVER_URL = "http://localhost:3001";

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useContext(AuthContext);
  const { updateChatWithNewMessage } = useContext(ChatContext);

  useEffect(() => {
    if (!user?.id) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const newSocket = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
      withCredentials: true,
      auth: { userId: user.id, token },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      setIsConnected(true);
      if (user?.id) newSocket.emit("userOnline", user.id);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      setIsConnected(false);
      console.error("❌ Socket connection error:", error);
    });

    // Handle receiveMessage
    newSocket.on("receiveMessage", (message) => {
      setMessages(prevMessages => {
        const chatMessages = prevMessages[message.chatId] || [];
        let replaced = false;
        const updatedMessages = chatMessages.map(msg => {
          // Replace optimistic message (by content, sender, and status "sent") or by _id
          if (
            (msg.status === "sent" && msg.content === message.content && msg.sender === message.sender && !msg._id.toString().match(/^[a-f\d]{24}$/i)) ||
            (msg._id === message._id)
          ) {
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

      if (message.sender !== user.id && message.status !== "delivered") {
        newSocket.emit("messageDelivered", {
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
          // Replace optimistic message (by content, sender, and status "sent") or by _id
          if (
            (msg.status === "sent" && msg.content === message.content && msg.sender === message.sender && !msg._id.toString().match(/^[a-f\d]{24}$/i)) ||
            (msg._id === message._id)
          ) {
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
      if (newSocket) newSocket.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [user?.id]); // Only user?.id as dependency

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

  // Mark all as read
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
      markMessagesAsRead
    }}>
      {children}
    </SocketContext.Provider>
  );
};