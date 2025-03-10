import React, { useState } from 'react';
import FloatingButton from '../components/common/FloatingButton';
import { AiOutlinePlus } from 'react-icons/ai'; // Example icon

const ChatPage = () => {
  const [chats, setChats] = useState([
    { id: 1, name: 'John Doe', lastMessage: 'Hey there!', time: '10:00 AM' },
    { id: 2, name: 'Jane Doe', lastMessage: 'How are you?', time: '11:30 AM' },
    // ... more mock chat data
  ]);

  const handleNewChat = () => {
    // Logic to create a new chat
  };

  return (
    <div className="pb-20"> {/* Add padding to avoid overlap with BottomNavbar */}
      <ul>
        {chats.map((chat) => (
          <li key={chat.id} className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gray-400 mr-4">{/* Profile picture */}</div>
              <div>
                <h3 className="font-medium">{chat.name}</h3>
                <p className="text-sm text-gray-600">{chat.lastMessage}</p>
              </div>
              <span className="ml-auto text-sm text-gray-500">{chat.time}</span>
            </div>
          </li>
        ))}
      </ul>
      <FloatingButton onClick={handleNewChat} icon={<AiOutlinePlus />} />
    </div>
  );
};

export default ChatPage;