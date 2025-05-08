import React, { createContext, useState, useEffect, useRef } from "react";
import io from "socket.io-client"; // ✅ Add socket.io-client

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const socket = useRef(null); // ✅ Keep socket stable across re-renders

  // ✅ Connect to socket server on mount
  useEffect(() => {
    socket.current = io("http://localhost:3001", {
      withCredentials: true,
    });

    socket.current.on("connect", () => {
      console.log("🟢 Socket connected:", socket.current.id);
    });

    socket.current.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
    });

    // Optional: Handle incoming messages
    socket.current.on("receiveMessage", (message) => { // Adjusted to match backend event name
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  // ✅ Load chats from localStorage
  useEffect(() => {
    const storedChats = JSON.parse(localStorage.getItem("chats"));
    setChats(
      storedChats || [
        // Default chats array (as in the original code)
        { id: 1, name: "Alice Johnson", avatar: "https://randomuser.me/api/portraits/women/1.jpg", lastMessage: "Hey! How’s it going?", time: "10:30 AM", unread: true },
        { id: 2, name: "Bob Smith", avatar: "https://randomuser.me/api/portraits/men/2.jpg", lastMessage: "How are you?", time: "9:45 AM", unread: false },
        // More chats...
      ]
    );
  }, []);

  // ✅ Load messages when chat is selected
  useEffect(() => {
    if (selectedChat) {
      const storedMessages =
        JSON.parse(localStorage.getItem(`messages_${selectedChat.id}`)) || [];
      setMessages(storedMessages);
    } else {
      setMessages([]);
    }
  }, [selectedChat]);

  // ✅ Send a message
  const sendMessage = (text) => {
    if (!text.trim() || !selectedChat) return;

    const newMessage = {
      id: Date.now(),
      text,
      sender: "You",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem(
      `messages_${selectedChat.id}`,
      JSON.stringify(updatedMessages)
    );

    // ✅ Emit to server with recipientId
    socket.current.emit("sendMessage", {
      ...newMessage,
      recipientId: selectedChat.id, // Sending the recipientId
    });

    // Update chat preview
    setChats((prevChats) => {
      const updatedChats = prevChats.map((chat) =>
        chat.id === selectedChat.id
          ? {
              ...chat,
              lastMessage: text,
              time: newMessage.time,
              unread: false,
            }
          : chat
      );
      localStorage.setItem("chats", JSON.stringify(updatedChats));
      return updatedChats;
    });
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        selectedChat,
        setSelectedChat,
        messages,
        sendMessage,
        socket: socket.current,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
