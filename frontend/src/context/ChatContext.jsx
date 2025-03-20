import { createContext, useState, useEffect } from "react";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);

  // Load stored chats and messages from LocalStorage
  useEffect(() => {
    const storedChats = JSON.parse(localStorage.getItem("chats")) || [
      { id: 1, name: "Alice", lastMessage: "Hey!" },
      { id: 2, name: "Bob", lastMessage: "How are you?" },
    ];
    setChats(storedChats);
  }, []);

  useEffect(() => {
    if (selectedChat) {
      const storedMessages = JSON.parse(localStorage.getItem(`messages_${selectedChat.id}`)) || [];
      setMessages(storedMessages);
    } else {
      setMessages([]);
    }
  }, [selectedChat]);

  // Function to send a new message
  const sendMessage = (text) => {
    if (!text.trim() || !selectedChat) return;

    const newMsg = { id: Date.now(), text, sender: "You" };
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);

    // Store messages in localStorage for this chat
    localStorage.setItem(`messages_${selectedChat.id}`, JSON.stringify(updatedMessages));

    // Update chat preview (last message)
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === selectedChat.id ? { ...chat, lastMessage: text } : chat
      )
    );
  };

  // Store chats in LocalStorage when updated
  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  return (
    <ChatContext.Provider value={{ chats, selectedChat, setSelectedChat, messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};
