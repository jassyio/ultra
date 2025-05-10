import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [user, setUser] = useState(null);

  // Fetch existing chats for the logged‐in user
  const fetchChats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/chats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched chats:", res.data); // Debug response data
      setChats(res.data);
    } catch (err) {
      console.error("Failed to load chats", err);
    }
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    console.log("User Data:", userData); // Debug the user data
    setUser(userData);
    if (userData) fetchChats();
  }, []);

  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        user,
        fetchChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
