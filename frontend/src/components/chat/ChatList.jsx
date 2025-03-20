import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import Avatar from "@mui/material/Avatar";

const ChatList = () => {
  const { chats, setSelectedChat, selectedChat } = useContext(ChatContext);

  return (
    <div className="p-4 h-full overflow-y-auto bg-white dark:bg-gray-900">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Chats</h2>
      <ul className="space-y-2">
        {chats.map((chat) => (
          <li
            key={chat.id}
            onClick={() => setSelectedChat(chat)}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition duration-200 ${
              selectedChat?.id === chat.id
                ? "bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {/* Profile Picture */}
            <Avatar src={chat.avatar} alt={chat.name} className="w-12 h-12 mr-3" />
            
            {/* Chat Details */}
            <div className="flex-1">
              <h3 className="font-medium">{chat.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {chat.lastMessage} {chat.unread ? <span className="font-bold text-green-500">•</span> : ""}
              </p>
            </div>

            {/* Time & Unread Indicator */}
            <div className="text-xs text-gray-400 dark:text-gray-500">
              {chat.time}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
