import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { SocketContext } from "../../context/SocketContext";
import { AuthContext } from "../../context/AuthContext";
import Avatar from "@mui/material/Avatar";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

const ChatWindow = () => {
  const { selectedChat, setSelectedChat, updateChatWithNewMessage } = useContext(ChatContext);
  const { getChatMessages, addMessage, socket } = useContext(SocketContext);
  const { user } = useContext(AuthContext);
  const [typingStatus, setTypingStatus] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  // Get the other participant's information
const chatPartner = selectedChat?.participants?.find(p => p._id !== user?.id);; // There will only be one participant (the other person)

  // Get messages for the current chat
  const messages = getChatMessages(selectedChat?._id);

  useEffect(() => {
    if (socket) {
      const handleConnect = () => setIsConnected(true);
      const handleDisconnect = () => setIsConnected(false);
      const handleError = () => setIsConnected(false);

      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);
      socket.on('connect_error', handleError);

      // Check initial connection state
      setIsConnected(socket.connected);

      return () => {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        socket.off('connect_error', handleError);
      };
    }
  }, [socket]);

  useEffect(() => {
    if (socket && selectedChat?._id) {
      socket.on("receiveMessage", (msg) => {
        if (msg.chatId === selectedChat._id) {
          addMessage(selectedChat._id, msg);
          updateChatWithNewMessage(selectedChat._id, msg);
        }
      });

      socket.on("typing", (data) => {
        if (data.chatId === selectedChat._id && data.sender !== user?.id) {
          setTypingStatus(data);
        }
      });

      socket.on("userOnline", (userId) => {
        if (chatPartner?._id === userId) {
          setIsOnline(true);
        }
      });

      socket.on("userOffline", (userId) => {
        if (chatPartner?._id === userId) {
          setIsOnline(false);
        }
      });

      return () => {
        socket.off("receiveMessage");
        socket.off("typing");
        socket.off("userOnline");
        socket.off("userOffline");
      };
    }
  }, [socket, selectedChat, chatPartner, addMessage, updateChatWithNewMessage, user]);

  if (!selectedChat || !chatPartner) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="h-16 px-4 flex items-center bg-[#f0f2f5] dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <button 
          onClick={() => setSelectedChat(null)} 
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 mr-2"
        >
          <ArrowLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <Avatar 
          src={chatPartner.avatar || "/default-avatar.png"} 
          alt={chatPartner.name}
          sx={{ width: 40, height: 40 }}
        />
        <div className="ml-3 flex-1 min-w-0">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white truncate">
            {chatPartner.name}
          </h2>
          {isOnline && (
            <p className="text-xs text-green-500">online</p>
          )}
        </div>
      </div>

      {/* Connection Error Alert */}
      {!isConnected && (
        <div className="bg-[#fef8e7] text-[#946c00] px-4 py-2 text-[13px] text-center">
          Waiting for network...
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-[#f0f2f5] dark:bg-gray-900">
        <div className="py-3 px-[5%]">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <Message 
                key={`${msg._id || msg.createdAt}-${index}`}
                message={msg}
                isOwnMessage={msg.sender === user?.id}
                isPending={msg.pending}
              />
            ))
          ) : (
            <div className="text-center text-[#8696a0] mt-10 text-sm">
              No messages yet
            </div>
          )}
          {typingStatus && typingStatus.sender !== user?.id && (
            <div className="text-[#8696a0] text-xs px-4">typing...</div>
          )}
        </div>
      </div>

      {/* Message Input */}
      <MessageInput 
        chatId={selectedChat._id} 
        onMessageSent={(content) => {
          const newMsg = {
            content,
            sender: user.id,
            chatId: selectedChat._id,
            createdAt: new Date().toISOString(),
            pending: true
          };
          addMessage(selectedChat._id, newMsg);
          updateChatWithNewMessage(selectedChat._id, newMsg);
        }}
        disabled={!isConnected}
      />
    </div>
  );
};

export default ChatWindow;
