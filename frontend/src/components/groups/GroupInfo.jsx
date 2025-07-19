import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, Navigate } from "react-router-dom";
import { FaArrowLeft, FaUserPlus, FaTrash, FaSignOutAlt, FaPen } from "react-icons/fa";
import axios from "axios";

const GroupInfo = () => {
  const { groupId } = useParams();
  console.log("Extracted Group ID in GroupInfo:", groupId); // Debug log

  if (!groupId) {
    console.error("Group ID is undefined");
    return <Navigate to="/groups" replace />;
  }

  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Group ID:", groupId); // Debug log
    if (!groupId) {
      console.error("Group ID is undefined");
      setError("Invalid group ID");
      setLoading(false);
      return;
    }

    const fetchGroupDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.MODE === "production" ? "https://ultra-3il5.onrender.com" : "http://localhost:3001"}/api/groups/${groupId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setGroup(response.data.data); // Access the `data` property directly
        console.log("Group details:", response.data.data);
      } catch (err) {
        console.error("Error fetching group details:", err);
        setError("Failed to load group details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen">{error}</div>;
  }

  if (!group) {
    return <div className="flex items-center justify-center h-screen">Group not found</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="px-4 py-3 bg-white dark:bg-gray-800 shadow-md flex items-center">
        <button 
          onClick={() => navigate(`/groups/${groupId}/info`)}
          className="mr-3 text-gray-500"
        >
          <FaArrowLeft />
        </button>
        <Link to={`/groups/${groupId}/info`} className="text-lg font-semibold">
          Group Info
        </Link>
      </div>
      
      {/* Group Details */}
      <div className="overflow-y-auto">
        <div className="p-4 bg-white dark:bg-gray-800 mb-2">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">{group?.name || "No name available"}</h2>
            <button className="text-blue-500">
              <FaPen />
            </button>
          </div>
          
          {group?.description && (
            <p className="text-gray-600 dark:text-gray-400 mb-2">{group.description}</p>
          )}
          
          <p className="text-xs text-gray-500">
            Created by {group?.creator?.name || "Unknown"} on {new Date(group?.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        {/* Members Section */}
        <div className="p-4 bg-white dark:bg-gray-800 mb-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">{group?.members?.length || 0} Members</h3>
            <button className="text-blue-500 flex items-center">
              <FaUserPlus className="mr-1" /> Add
            </button>
          </div>
          
          <div>
            {group?.members?.map(member => (
              <div key={member._id} className="flex items-center mb-3 pb-2 border-b dark:border-gray-700">
                <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                  {member?.user?.name?.charAt(0) || "?"}
                </div>
                <div className="ml-3 flex-1">
                  <p className="font-medium">{member?.user?.name || "Unknown"}{member?.isAdmin && " (admin)"}</p>
                  <p className="text-sm text-gray-500">{member?.user?.phone || "No phone number"}</p>
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
          
          {group?.admins?.find(admin => admin._id === group?.creator?._id) && (
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