import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";

export const ChatContext = createContext();

const BACKEND_URL = "http://localhost:3001";

export const ChatProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState({}); // { [chatId]: [messages] }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch chats on login
  useEffect(() => {
    if (!user) {
      setChats([]);
      setSelectedChat(null);
      setMessages({});
      return;
    }
    const fetchChats = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${BACKEND_URL}/api/chats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setChats(data);
      } catch (err) {
        setChats([]);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [user]);

  // Fetch offline messages on login
  useEffect(() => {
    if (!user) return;
    const fetchOfflineMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${BACKEND_URL}/api/messages/offline`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Merge offline messages into messages state
        if (data.messages) {
          setMessages(prev => {
            const updated = { ...prev };
            data.messages.forEach(msg => {
              if (!updated[msg.chatId]) updated[msg.chatId] = [];
              // Avoid duplicates
              if (!updated[msg.chatId].some(m => m._id === msg._id)) {
                updated[msg.chatId].push(msg);
              }
            });
            return updated;
          });
        }
      } catch {}
    };
    fetchOfflineMessages();
  }, [user]);

  // Fetch messages for a chat
  const fetchMessagesForChat = async (chatId) => {
    if (!user || !chatId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${BACKEND_URL}/api/messages/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(prev => ({ ...prev, [chatId]: data.messages || [] }));
    } catch {
      setMessages(prev => ({ ...prev, [chatId]: [] }));
    } finally {
      setLoading(false);
    }
  };

  // Add a new message to a chat (real-time or after sending)
  const addMessageToChat = (chatId, message) => {
    setMessages(prev => ({
      ...prev,
      [chatId]: [
        ...(prev[chatId] || []).filter(
          m => !(m.isPending && message.content && m.content === message.content)
        ),
        message,
      ],
    }));
  };

  const updateChatWithNewMessage = (chatId, message) => {
    setChats(prev =>
      prev.map(chat =>
        chat._id === chatId
          ? { ...chat, lastMessage: message, updatedAt: message.createdAt }
          : chat
      )
    );
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        messages,
        setMessages,
        fetchMessagesForChat,
        addMessageToChat,
        updateChatWithNewMessage, // <-- ADD THIS LINE
        loading,
        error
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};