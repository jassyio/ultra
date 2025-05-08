import { useContext, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext";
import Avatar from "@mui/material/Avatar";

const ChatList = () => {
  const { chats, setSelectedChat, selectedChat } = useContext(ChatContext);

  useEffect(() => {
    const savedChat = localStorage.getItem("selectedChat");
    if (savedChat) {
      const parsedChat = JSON.parse(savedChat);
      setSelectedChat(parsedChat);
    }
  }, [setSelectedChat]);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    localStorage.setItem("selectedChat", JSON.stringify(chat));
  };

  return (
    <div className="p-4 h-full overflow-y-auto bg-white dark:bg-gray-900">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Chats</h2>
      <ul className="space-y-2">
        {chats.map((chat) => (
          <li
            key={chat.id}
            onClick={() => handleChatSelect(chat)}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition duration-200 ${
              selectedChat?.id === chat.id
                ? "bg-blue-500 text-white shadow"
                : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <Avatar src={chat.avatar} alt={chat.name} className="w-12 h-12 mr-4" />

            <div className="flex-1 min-w-0">
              <h3
                className={`font-medium truncate ${
                  selectedChat?.id === chat.id ? "text-white" : "text-gray-900 dark:text-white"
                }`}
              >
                {chat.name}
              </h3>
              <p
                className={`text-sm truncate flex items-center ${
                  selectedChat?.id === chat.id
                    ? "text-white/80"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {chat.lastMessage}
                {chat.unread && (
                  <span className="ml-2 w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                )}
                {chat.isOnline && (
                  <span className="ml-2 text-green-500">🟢 Online</span>
                )}
                {chat.isTyping && (
                  <span className="ml-2 text-gray-500">...typing</span>
                )}
              </p>
            </div>

            <div
              className={`text-xs ${
                selectedChat?.id === chat.id
                  ? "text-white/70"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            >
              {chat.time}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
