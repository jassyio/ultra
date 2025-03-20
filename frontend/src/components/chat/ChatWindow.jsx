import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import MessageInput from "./MessageInput";
import { ArrowLeft } from "lucide-react"; // Icon for the back button

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
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b dark:border-gray-700 bg-gray-100 dark:bg-gray-900 flex items-center">
        <button onClick={() => setSelectedChat(null)} className="mr-3 text-gray-600 dark:text-white">
          <ArrowLeft size={24} />
        </button>
        <span className="font-semibold text-lg dark:text-white">{selectedChat.name}</span>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-800">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded-md max-w-xs ${
              msg.sender === "You" ? "bg-green-500 text-white ml-auto" : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <MessageInput />
    </div>
  );
};

export default ChatWindow;
