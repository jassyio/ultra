// src/context/ChatContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [user, setUser] = useState(null); // You can fetch this from localStorage or backend

  const fetchChats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/chats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChats(res.data);
    } catch (err) {
      console.error("Failed to load chats", err);
    }
  };

  useEffect(() => {
    // This should be a real auth call in production
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
    if (userData) fetchChats();
  }, []);

  return (
    <ChatContext.Provider value={{ chats, setChats, activeChat, setActiveChat, user, fetchChats }}>
      {children}
    </ChatContext.Provider>
  );
};
