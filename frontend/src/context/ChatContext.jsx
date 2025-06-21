import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";

export const ChatContext = createContext();
const BACKEND_URL = "http://localhost:3001";

export const ChatProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchChats = useCallback(async () => {
    if (!user) {
      setChats([]);
      setSelectedChat(null);
      setMessages({});
      return;
    }

    setLoading(true);
    try {
      console.log("Fetching chats...");
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        setError("Authentication required");
        setLoading(false);
        return;
      }

      const { data } = await axios.get(`${BACKEND_URL}/api/chats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Chats received:", data?.length || 0);
      const initialMessages = {};
      data.forEach((chat) => {
        initialMessages[chat._id] = [];
      });

      setChats(data);
      setMessages((prev) => ({ ...prev, ...initialMessages }));
    } catch (err) {
      console.error("Error fetching chats:", err.response || err.message);
      setError(err.response?.data?.message || "Failed to load chats");
      setChats([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]); // Only depend on user.id, not the entire selectedChat object

  useEffect(() => {
    fetchChats();
  }, [user, fetchChats]);

  useEffect(() => {
    if (!user) return;

    const fetchOfflineMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${BACKEND_URL}/api/messages/offline`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.messages?.length > 0) {
          setMessages((prev) => {
            const updated = { ...prev };
            data.messages.forEach((msg) => {
              if (!updated[msg.chatId]) updated[msg.chatId] = [];
              if (!updated[msg.chatId].some((m) => m._id === msg._id)) {
                updated[msg.chatId].push(msg);
              }
            });
            return updated;
          });

          setChats((prev) => {
            const chatUpdates = {};
            data.messages.forEach((msg) => {
              if (
                !chatUpdates[msg.chatId] ||
                new Date(msg.createdAt) > new Date(chatUpdates[msg.chatId].createdAt)
              ) {
                chatUpdates[msg.chatId] = msg;
              }
            });

            return prev.map((chat) =>
              chatUpdates[chat._id]
                ? {
                    ...chat,
                    lastMessage: chatUpdates[chat._id],
                    updatedAt: chatUpdates[chat._id].createdAt,
                  }
                : chat
            );
          });
        }
      } catch (err) {
        console.error("Failed to fetch offline messages:", err);
      }
    };

    fetchOfflineMessages();
  }, [user]);

  const fetchMessagesForChat = useCallback(async (chatId) => {
    if (!user || !chatId) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${BACKEND_URL}/api/messages/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages((prev) => {
        const current = prev[chatId] || [];
        const seenIds = new Set(current.map((msg) => msg._id));
        const merged = [...current];

        (data.messages || []).forEach((msg) => {
          if (!seenIds.has(msg._id)) {
            merged.push(msg);
          }
        });

        return { ...prev, [chatId]: merged };
      });

      if (data.messages?.length > 0) {
        const lastMessage = data.messages[data.messages.length - 1];
        setChats((prev) =>
          prev.map((chat) =>
            chat._id === chatId
              ? { ...chat, lastMessage, updatedAt: lastMessage.createdAt }
              : chat
          )
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load messages");
      setMessages((prev) => ({ ...prev, [chatId]: [] }));
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addMessageToChat = useCallback((chatId, message) => {
    console.log("➕ addMessageToChat:", message);

    setMessages((prev) => {
      const currentMsgs = prev[chatId] || [];

      const isDuplicate = currentMsgs.some(
        (m) =>
          m._id === message._id ||
          (message.tempId && m.tempId && m.tempId === message.tempId)
      );
      if (isDuplicate) {
        console.warn("❗ Skipping duplicate in addMessageToChat:", message);
        return prev;
      }

      return {
        ...prev,
        [chatId]: [...currentMsgs, message],
      };
    });

    setChats((prev) =>
      prev.map((chat) =>
        chat._id === chatId
          ? { ...chat, lastMessage: message, updatedAt: message.createdAt }
          : chat
      )
    );
  }, []);

  const updateChatWithNewMessage = useCallback((chatId, message) => {
    console.log("📥 updateChatWithNewMessage:", message);

    // First, handle messages state
    setMessages((prev) => {
      const currentMsgs = prev[chatId] || [];
      
      // Real message from server - Filter out any pending message with same content
      if (!message.isPending && message._id && message._id.length > 15) {
        // MongoDB IDs are longer than timestamp IDs we use for pending
        const filtered = currentMsgs.filter(m => 
          // Add null check before calling toString()
          !(m._id && typeof m._id.toString === 'function' && 
            m._id.toString().length < 15 && 
            m.content === message.content)
        );
        
        // Check for exact duplicates by ID - with null check
        if (filtered.some(m => m._id && m._id === message._id)) {
          console.log("⚠️ Skipping duplicate message:", message._id);
          return prev;
        }
        
        console.log("✅ Replacing pending with confirmed message");
        return {
          ...prev,
          [chatId]: [...filtered, message]
        };
      }
      
      // Pending message - only add if no existing message with same content
      if (currentMsgs.some(m => m.content === message.content)) {
        console.log("⚠️ Skipping duplicate pending message");
        return prev;
      }
      
      console.log("✅ Adding new message to chat");
      return {
        ...prev,
        [chatId]: [...currentMsgs, {...message, isPending: true}]
      };
    });

    // Then, update chats list
    // Only update chat list with real (non-pending) messages
    if (!message.isPending && message._id && message._id.length > 15) {
      setChats(prev =>
        prev.map(chat =>
          chat._id === chatId
            ? { ...chat, lastMessage: message, updatedAt: message.createdAt }
            : chat
        )
      );
    }
  }, []);  // Remove dependency on user.id to avoid unnecessary re-renders

  const selectChat = useCallback(async (chat) => {
    setSelectedChat(chat);
    if (chat && chat._id && !messages[chat._id]?.length) {
      await fetchMessagesForChat(chat._id);
    }
  }, [fetchMessagesForChat, messages]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,
        selectedChat,
        setSelectedChat: selectChat,
        messages,
        setMessages,
        fetchMessagesForChat,
        addMessageToChat,
        updateChatWithNewMessage,
        refreshChats: fetchChats,
        loading,
        error,
        setError,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
