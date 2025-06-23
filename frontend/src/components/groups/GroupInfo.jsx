import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUserPlus, FaTrash, FaSignOutAlt, FaPen } from "react-icons/fa";

const GroupInfo = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Placeholder for API call to fetch group details
    // For now, using mock data
    const mockGroup = {
      id: groupId,
      name: "Group " + groupId,
      description: "This is a group chat",
      createdAt: new Date().toISOString(),
      createdBy: "You",
      members: [
        { id: 1, name: "You", phone: "+1234567890", isAdmin: true },
        { id: 2, name: "John Doe", phone: "+0987654321" },
        { id: 3, name: "Jane Smith", phone: "+1122334455" }
      ]
    };
    
    setGroup(mockGroup);
    setLoading(false);
  }, [groupId]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!group) {
    return <div className="flex items-center justify-center h-screen">Group not found</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="px-4 py-3 bg-white dark:bg-gray-800 shadow-md flex items-center">
        <button 
          onClick={() => navigate(`/groups/${groupId}`)}
          className="mr-3 text-gray-500"
        >
          <FaArrowLeft />
        </button>
        <span className="text-lg font-semibold">Group Info</span>
      </div>
      
      {/* Group Details */}
      <div className="overflow-y-auto">
        <div className="p-4 bg-white dark:bg-gray-800 mb-2">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">{group.name}</h2>
            <button className="text-blue-500">
              <FaPen />
            </button>
          </div>
          
          {group.description && (
            <p className="text-gray-600 dark:text-gray-400 mb-2">{group.description}</p>
          )}
          
          <p className="text-xs text-gray-500">
            Created by {group.createdBy} on {new Date(group.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        {/* Members Section */}
        <div className="p-4 bg-white dark:bg-gray-800 mb-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">{group.members.length} Members</h3>
            <button className="text-blue-500 flex items-center">
              <FaUserPlus className="mr-1" /> Add
            </button>
          </div>
          
          <div>
            {group.members.map(member => (
              <div key={member.id} className="flex items-center mb-3 pb-2 border-b dark:border-gray-700">
                <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                  {member.name.charAt(0)}
                </div>
                <div className="ml-3 flex-1">
                  <p className="font-medium">{member.name}{member.isAdmin && " (admin)"}</p>
                  <p className="text-sm text-gray-500">{member.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Actions */}
        <div className="p-4 bg-white dark:bg-gray-800">
          <button className="flex items-center w-full p-3 text-red-500 mb-2">
            <FaSignOutAlt className="mr-3" /> Leave Group
          </button>
          
          {group.members.find(m => m.id === 1)?.isAdmin && (
            <button className="flex items-center w-full p-3 text-red-500">
              <FaTrash className="mr-3" /> Delete Group
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupInfo;