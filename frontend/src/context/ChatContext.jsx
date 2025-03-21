import { createContext, useState, useEffect } from "react";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);

  // Load chats from localStorage or initialize default chats
  useEffect(() => {
    const storedChats = JSON.parse(localStorage.getItem("chats"));
    setChats(
      storedChats || [
        {
          id: 1,
          name: "Alice Johnson",
          avatar: "https://randomuser.me/api/portraits/women/1.jpg",
          lastMessage: "Hey! How’s it going?",
          time: "10:30 AM",
          unread: true,
        },
        {
          id: 2,
          name: "Bob Smith",
          avatar: "https://randomuser.me/api/portraits/men/2.jpg",
          lastMessage: "How are you?",
          time: "9:45 AM",
          unread: false,
        },
        {
          id: 3,
          name: "Gaming Squad 🎮",
          avatar: "https://randomuser.me/api/portraits/men/3.jpg",
          lastMessage: "Who's online for a match?",
          time: "Yesterday",
          unread: true,
        },
        {
          id: 4,
          name: "Emily White",
          avatar: "https://randomuser.me/api/portraits/women/4.jpg",
          lastMessage: "See you at 5 PM!",
          time: "Monday",
          unread: false,
        },
        {
          id: 5,
          name: "Michael Lee",
          avatar: "https://randomuser.me/api/portraits/men/5.jpg",
          lastMessage: "Great meeting today!",
          time: "Sunday",
          unread: true,
        },
        {
          id: 6,
          name: "Family Chat 🏡",
          avatar: "https://randomuser.me/api/portraits/women/6.jpg",
          lastMessage: "Dinner at 7 PM, don’t be late!",
          time: "Saturday",
          unread: false,
        },
        {
          id: 7,
          name: "Sarah Connor",
          avatar: "https://randomuser.me/api/portraits/women/7.jpg",
          lastMessage: "Don't forget our plans!",
          time: "Friday",
          unread: false,
        },
        {
          id: 8,
          name: "Work Team 💼",
          avatar: "https://randomuser.me/api/portraits/men/8.jpg",
          lastMessage: "Project deadline is tomorrow!",
          time: "Thursday",
          unread: true,
        },
        {
          id: 9,
          name: "Jake Paul",
          avatar: "https://randomuser.me/api/portraits/men/9.jpg",
          lastMessage: "Let's catch up soon!",
          time: "Wednesday",
          unread: false,
        },
        {
          id: 10,
          name: "Anna Baker",
          avatar: "https://randomuser.me/api/portraits/women/10.jpg",
          lastMessage: "I’ll call you later.",
          time: "Tuesday",
          unread: true,
        },
      ]
    );
  }, []);

  // Load messages when a chat is selected
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

    const newMessage = {
      id: Date.now(),
      text,
      sender: "You",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem(`messages_${selectedChat.id}`, JSON.stringify(updatedMessages));

    // Update chat preview (last message & time)
    setChats((prevChats) => {
      const updatedChats = prevChats.map((chat) =>
        chat.id === selectedChat.id
          ? { ...chat, lastMessage: text, time: newMessage.time, unread: false }
          : chat
      );

      localStorage.setItem("chats", JSON.stringify(updatedChats));
      return updatedChats;
    });
  };

  return (
    <ChatContext.Provider value={{ chats, selectedChat, setSelectedChat, messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};
