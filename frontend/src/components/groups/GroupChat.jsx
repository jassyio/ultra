import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { FaArrowLeft, FaEllipsisV, FaUsers, FaUserPlus } from "react-icons/fa";
import socket from "../../socket";
import groupService from "../../api/groupService";
import MessageInput from "../chat/MessageInput";
import LoadingScreen from "../common/LoadingScreen";
import useAuth from "../../hooks/useAuth";
import AddGroupMemberModal from "./AddGroupMemberModal"; // <-- You will create this

const GroupChat = () => {
  const { groupId } = useParams();
  console.log("GroupChat Params:", groupId); // Debug log

  if (!groupId) {
    console.error("Group ID is undefined");
    return <div>Invalid group ID</div>;
  }

  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddMember, setShowAddMember] = useState(false);
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

  // After fetching group, check if user is admin
  const isAdmin = group?.admins?.some((admin) => admin._id === user._id);

  // Handler for adding member
  const handleMemberAdded = async () => {
    // Refresh group info after adding member
    const groupResponse = await groupService.getGroupById(groupId);
    setGroup(groupResponse.data);
    setShowAddMember(false);
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
        
        {/* Only show add member if admin */}
        {isAdmin && (
          <button
            className="text-green-600 mr-2"
            title="Add member"
            onClick={() => setShowAddMember(true)}
          >
            <FaUserPlus />
          </button>
        )}
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
          messages.map((message) => {
            const isSender = message.sender._id === user._id;
            return (
              <div 
                key={message._id}
                className={`mb-2 max-w-xs p-3 rounded-lg ${
                  isSender ? "ml-auto bg-green-100 dark:bg-green-800" : "bg-white dark:bg-gray-700"
                }`}
              >
                {!isSender && (
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
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input */}
      <MessageInput onSendMessage={handleSendMessage} />

      {/* Add Member Modal */}
      {showAddMember && (
        <AddGroupMemberModal
          groupId={groupId}
          onClose={() => setShowAddMember(false)}
          onMemberAdded={handleMemberAdded}
        />
      )}

      <Outlet /> {/* Renders nested routes */}
    </div>
  );
};

export default GroupChat;