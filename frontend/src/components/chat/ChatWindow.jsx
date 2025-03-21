import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import MessageInput from "./MessageInput";
import Message from "./Message";
import Avatar from "@mui/material/Avatar";
import {
  ArrowLeftIcon,
  PhoneIcon,
  VideoCameraIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/solid";

const ChatWindow = () => {
  const { selectedChat, messages, setSelectedChat } = useContext(ChatContext);

  if (!selectedChat) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      {/* Chat Header */}
      <div className="p-4 border-b dark:border-gray-700 bg-gray-100 dark:bg-gray-900 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Back Button */}
          <button onClick={() => setSelectedChat(null)} className="text-gray-600 dark:text-white">
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          {/* Profile Avatar & Name */}
          <Avatar src={selectedChat.avatar} alt={selectedChat.name} className="w-10 h-10" />
          <span className="font-semibold text-lg dark:text-white">{selectedChat.name}</span>
        </div>

        {/* Call & More Options */}
        <div className="flex space-x-4">
          <button className="text-gray-600 dark:text-white hover:text-blue-500">
            <PhoneIcon className="w-6 h-6" />
          </button>
          <button className="text-gray-600 dark:text-white hover:text-blue-500">
            <VideoCameraIcon className="w-6 h-6" />
          </button>
          <button className="text-gray-600 dark:text-white hover:text-blue-500">
            <EllipsisVerticalIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <Message key={index} text={msg.text} sender={msg.sender} time={msg.time} status={msg.status} />
          ))
        ) : (
          <div className="text-center text-gray-400 mt-10">No messages yet. Start the conversation!</div>
        )}
      </div>

      {/* Message Input */}
      <MessageInput />
    </div>
  );
};

export default ChatWindow;
