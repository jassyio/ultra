import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { SocketContext } from "../../context/SocketContext";
import Avatar from "@mui/material/Avatar";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { ArrowLeftIcon, PhoneIcon, VideoCameraIcon, EllipsisVerticalIcon } from "@heroicons/react/24/solid";

const ChatWindow = () => {
  const { selectedChat, setSelectedChat } = useContext(ChatContext);
  const { messages, setMessages, socket } = useContext(SocketContext);
  const [typingStatus, setTypingStatus] = useState(null); // For typing status
  const [isOnline, setIsOnline] = useState(false); // For tracking user's online status

  useEffect(() => {
    if (socket) {
      socket.on("receiveMessage", (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });

      socket.on("typing", (data) => {
        setTypingStatus(data); // Update typing status
      });

      socket.on("userOnline", (userId) => {
        if (userId === selectedChat?.id) {
          setIsOnline(true); // Mark the selected user as online
        }
      });

      socket.on("userOffline", (userId) => {
        if (userId === selectedChat?.id) {
          setIsOnline(false); // Mark the selected user as offline
        }
      });

      return () => {
        socket.off("receiveMessage");
        socket.off("typing");
        socket.off("userOnline");
        socket.off("userOffline");
      };
    }
  }, [socket, setMessages, selectedChat]);

  if (!selectedChat) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-700 bg-gray-100 dark:bg-gray-900 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={() => setSelectedChat(null)} className="text-gray-600 dark:text-white">
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <Avatar src={selectedChat.avatar} alt={selectedChat.name} className="w-10 h-10" />
          <span className="font-semibold text-lg dark:text-white truncate">{selectedChat.name}</span>
        </div>

        {/* Online status */}
        <div className="flex items-center space-x-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-500'}`} />
          <span className="text-sm text-green-500">{isOnline ? "Online" : "Offline"}</span>
        </div>

        {/* Icons */}
        <div className="flex space-x-4">
          {[PhoneIcon, VideoCameraIcon, EllipsisVerticalIcon].map((Icon, idx) => (
            <button key={idx} className="text-gray-600 dark:text-white hover:text-blue-500">
              <Icon className="w-6 h-6" />
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <Message key={index} msg={msg} />
          ))
        ) : (
          <div className="text-center text-gray-400 mt-10">No messages yet. Start the conversation!</div>
        )}

        {/* Typing status */}
        {typingStatus && (
          <div className="text-sm text-gray-500">{`${typingStatus.sender} is typing...`}</div>
        )}
      </div>

      {/* Message Input */}
      <MessageInput chatId={selectedChat.id} />
    </div>
  );
};

export default ChatWindow;
