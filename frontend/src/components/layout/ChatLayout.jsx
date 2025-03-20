import React from "react";
import ChatHeader from "../components/chat/ChatHeader";
import ChatInput from "../components/chat/ChatInput";

const ChatLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-200">
      {/* Chat Header (Profile, Call Icons, Menu) */}
      <ChatHeader />

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">{children}</div>

      {/* Chat Input */}
      <ChatInput />
    </div>
  );
};

export default ChatLayout;
