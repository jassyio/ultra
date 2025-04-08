import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Replace with your backend URL

const ChatWindow = ({ selectedChat }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (selectedChat) {
      // Fetch messages for the selected chat
      // Replace with actual API call
      setMessages(selectedChat.messages || []);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (selectedChat) {
      socket.emit('joinChat', selectedChat.id);

      socket.on('message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socket.emit('leaveChat', selectedChat.id);
        socket.off('message');
      };
    }
  }, [selectedChat]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        chatId: selectedChat.id,
        text: newMessage,
        sender: 'user', // Replace with actual sender info
        timestamp: new Date(),
      };
      socket.emit('sendMessage', message);
      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage('');
    }
  };

  return (
    <div className="chat-window">
      {selectedChat ? (
        <>
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender === 'user' ? 'sent' : 'received'}`}>
                <p>{msg.text}</p>
                <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
              </div>
            ))}
          </div>
          <div className="message-input">
            <input
              type="text"
              placeholder="Type a message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button onClick={sendMessage} className="p-2 bg-blue-500 text-white rounded">
              Send
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">Select a chat to start messaging</p>
      )}
    </div>
  );
};

export default ChatWindow;