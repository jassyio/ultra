import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  // Reset state when user changes
  useEffect(() => {
    if (!user) {
      setChats([]);
      setSelectedChat(null);
      setError(null);
      setLoading(false);
    }
  }, [user]);

  // Fetch chats when the component mounts or when user changes
  useEffect(() => {
    const fetchChats = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const { data } = await axios.get("http://localhost:3001/api/chats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Process chats to only show other participants
        const processedChats = data.map(chat => {
          const otherParticipant = chat.participants.find(p => p._id !== user.id);
          if (!otherParticipant) return null;
          return {
            _id: chat._id,
            participants: [otherParticipant],
            lastMessage: chat.lastMessage,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt
          };
        }).filter(Boolean);
        
        setChats(processedChats);
      } catch (err) {
        console.error("Failed to load chats:", err);
        setError(err.response?.data?.message || "Failed to load chats");
        setChats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user]);

  // Create a new chat
  const createChat = async (userId) => {
    if (!user) throw new Error("User not authenticated");

    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const { data } = await axios.post(
        "http://localhost:3001/api/chats",
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const otherParticipant = data.participants.find(p => p._id !== user.id);
      const processedChat = {
        _id: data._id,
        participants: [otherParticipant],
        lastMessage: data.lastMessage,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      };

      setChats(prevChats => [...prevChats, processedChat]);
      setSelectedChat(processedChat);
      return processedChat;
    } catch (err) {
      console.error("Chat creation failed:", err);
      const errorMessage = err.response?.data?.message || "Failed to create chat";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Add a message to a chat (for API-based sending)
  const addMessageToChat = async (chatId, content) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const { data } = await axios.post(
        `http://localhost:3001/api/chats/${chatId}/messages`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the chat with the new message
      updateChatWithNewMessage(chatId, {
        _id: data._id,
        content: data.content,
        sender: data.sender,
        createdAt: data.createdAt
      });

      return {
        _id: data._id,
        content: data.content,
        sender: data.sender,
        chatId: data.chatId,
        createdAt: data.createdAt
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to send message";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Get a specific chat
  const getChat = async (chatId) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const { data } = await axios.get(
        `http://localhost:3001/api/chats/${chatId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const otherParticipant = data.participants.find(p => p._id !== user.id);
      return {
        _id: data._id,
        participants: [otherParticipant],
        lastMessage: data.lastMessage,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to load chat";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Update chat with new message (for real-time socket updates)
  const updateChatWithNewMessage = (chatId, message) => {
    setChats(prevChats =>
      prevChats.map(chat => {
        if (chat._id === chatId) {
          return {
            ...chat,
            lastMessage: {
              _id: message._id,
              content: message.content,
              sender: message.sender,
              createdAt: message.createdAt
            }
          };
        }
        return chat;
      })
    );
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        loading,
        error,
        createChat,
        addMessageToChat,
        getChat,
        updateChatWithNewMessage
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};