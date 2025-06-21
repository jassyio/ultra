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

  // Fetch all chats
  const fetchChats = useCallback(async () => {
    if (!user) {
      setChats([]);
      setSelectedChat(null);
      setMessages({});
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${BACKEND_URL}/api/chats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const initialMessages = {};
      data.forEach((chat) => {
        initialMessages[chat._id] = [];
      });

      setChats(data);
      setMessages((prev) => ({ ...prev, ...initialMessages }));

      if (selectedChat && selectedChat._id) {
        fetchMessagesForChat(selectedChat._id);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load chats");
      setChats([]);
    } finally {
      setLoading(false);
    }
  }, [user, selectedChat]);

  // On user change or login
  useEffect(() => {
    fetchChats();
  }, [user, fetchChats]);

  // Offline messages
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

  // Fetch all messages for a specific chat
  const fetchMessagesForChat = useCallback(
    async (chatId) => {
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
    },
    [user]
  );

  // ✅ FIXED: Add message, replace pending, avoid duplicates
  const addMessageToChat = useCallback((chatId, message) => {
    setMessages((prev) => {
      const currentMsgs = prev[chatId] || [];
      let filtered = currentMsgs;
      if (message.tempId) {
        filtered = currentMsgs.filter(m => m.tempId !== message.tempId);
      }
      // Prevent duplicates by _id
      if (filtered.some(m => m._id === message._id)) return prev;
      return {
        ...prev,
        [chatId]: [...filtered, message],
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

  // Update chat list and chat window with new message (e.g. from socket)
  const updateChatWithNewMessage = useCallback(
    (chatId, message) => {
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === chatId
            ? { ...chat, lastMessage: message, updatedAt: message.createdAt }
            : chat
        )
      );

      setMessages((prev) => {
        const currentMsgs = prev[chatId] || [];
        const exists = currentMsgs.some((m) => m._id === message._id);
        if (exists) return prev;

        return {
          ...prev,
          [chatId]: [...currentMsgs, message],
        };
      });
    },
    []
  );

  // Select a chat and ensure messages are loaded
  const selectChat = useCallback(
    async (chat) => {
      setSelectedChat(chat);
      // Add null check here
      if (chat && chat._id && !messages[chat._id]?.length) {
        await fetchMessagesForChat(chat._id);
      }
    },
    [fetchMessagesForChat, messages]
  );

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
