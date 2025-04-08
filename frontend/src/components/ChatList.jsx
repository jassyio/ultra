import React, { useState } from 'react';
import FloatingButton from './common/FloatingButton';

const ChatList = ({ chats, onChatSelect, onAddChat }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="chat-list relative">
      <input
        type="text"
        placeholder="Search chats or contacts"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <ul>
        {filteredChats.map(chat => (
          <li
            key={chat.id}
            onClick={() => onChatSelect(chat)}
            className="p-2 border-b cursor-pointer hover:bg-gray-100"
          >
            {chat.name}
          </li>
        ))}
      </ul>
      <FloatingButton
        onClick={onAddChat}
        icon={<span>+</span>}
        tooltip="Start a new chat"
      />
    </div>
  );
};

export default ChatList;