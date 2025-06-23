import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEllipsisV, FaUsers } from "react-icons/fa";
import socket from "../../socket";
import groupService from "../../api/groupService";
import MessageInput from "../chat/MessageInput";
import LoadingScreen from "../common/LoadingScreen";
import useAuth from "../../hooks/useAuth";

const GroupChat = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  
  // Connect to socket and fetch initial data
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        setLoading(true);
        // Fetch group details
        const groupResponse = await groupService.getGroupById(groupId);
        setGroup(groupResponse.data);
        
        // Fetch messages
        const messagesResponse = await groupService.getGroupMessages(groupId);
        setMessages(messagesResponse.data.messages);
        
        // Mark messages as read
        await groupService.markGroupMessagesAsRead(groupId);
        
        // Join socket room
        socket.emit("joinGroupRoom", groupId);
        
        setError(null);
      } catch (err) {
        console.error("Error loading group chat:", err);
        setError("Failed to load group chat");
      } finally {
        setLoading(false);
      }
    };
    
    fetchGroupData();
    
    // Listen for new messages
    socket.on("newGroupMessage", (message) => {
      if (message.groupId === groupId) {
        setMessages(prev => [...prev, message]);
        
        // Mark message as read if we're in the chat
        if (message.sender._id !== user._id) {
          groupService.markGroupMessagesAsRead(groupId);
        }
      }
    });
    
    // Cleanup
    return () => {
      socket.off("newGroupMessage");
      socket.emit("leaveGroupRoom", groupId);
    };
  }, [groupId, user._id]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (content) => {
    if (!content.trim()) return;
    
    // Send through socket
    socket.emit("sendGroupMessage", {
      content,
      groupId,
      sender: user._id
    });
  };

  const handleOpenInfo = () => {
    navigate(`/groups/${groupId}/info`);
  };

  if (loading) {
    return <LoadingScreen message="Loading group chat..." />;
  }
  
  if (error) {
    return (
      <div className="flex flex-col h-screen items-center justify-center">
        <p className="text-red-500">{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => navigate("/groups")}
        >
          Go Back to Groups
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="px-4 py-3 bg-white dark:bg-gray-800 shadow-md flex items-center">
        <button 
          onClick={() => navigate("/groups")}
          className="mr-3 text-gray-500"
        >
          <FaArrowLeft />
        </button>
        
        <div className="w-10 h-10 flex items-center justify-center bg-green-500 text-white rounded-full">
          <FaUsers />
        </div>
        
        <div className="ml-3 flex-1" onClick={handleOpenInfo}>
          <p className="font-semibold">{group?.name}</p>
          <p className="text-xs text-gray-500">
            {group?.members?.length} members
          </p>
        </div>
        
        <button onClick={handleOpenInfo} className="text-gray-500">
          <FaEllipsisV />
        </button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages yet
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message._id}
              className={`mb-2 max-w-xs p-3 rounded-lg ${
                message.sender._id === user._id 
                  ? "ml-auto bg-green-100 dark:bg-green-800" 
                  : "bg-white dark:bg-gray-700"
              }`}
            >
              {message.sender._id !== user._id && (
                <p className="text-xs font-semibold text-green-500">
                  {message.sender.name}
                </p>
              )}
              <p>{message.content}</p>
              <p className="text-xs text-gray-500 text-right">
                {new Date(message.createdAt).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input */}
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default GroupChat;