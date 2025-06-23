import { useState, useEffect } from "react";
import { FaUsers, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import CreateGroupModal from "../groups/CreateGroupModal";
import groupService from "../../api/groupService";
import LoadingScreen from "../common/LoadingScreen";

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await groupService.getUserGroups();
      setGroups(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching groups:", err);
      setError("Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (groupData) => {
    console.log("Creating group with data:", groupData); // Add this
    try {
      const response = await groupService.createGroup(groupData);
      setGroups([...groups, response.data]);
      return true;
    } catch (err) {
      console.error("Error creating group:", err);
      return false;
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading groups..." />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="px-4 py-3 text-lg font-semibold bg-white dark:bg-gray-800 shadow-md flex items-center justify-between">
        <span>Groups</span>
        <button
          className="text-green-500 text-xl"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <FaPlus />
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 text-center text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-300">
          {error}
          <button
            onClick={fetchGroups}
            className="ml-2 underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Group List */}
      <div className="flex-1 overflow-y-auto">
        {groups.length === 0 && !loading && !error ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <p>No groups yet</p>
            <p className="mt-2 text-sm">Create a group to start chatting</p>
          </div>
        ) : (
          groups.map((group) => (
            <Link
              key={group._id || group.id}
              to={`/groups/${group._id || group.id}`}
              className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-green-500 text-white rounded-full text-lg">
                <FaUsers />
              </div>
              <div className="ml-3">
                <p className="text-base font-medium">{group.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {group.lastMessage?.content || `${group.members?.length || 0} members`}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Create Group Button */}
      <button
        className="fixed bottom-20 right-5 bg-green-500 text-white p-4 rounded-full shadow-lg text-xl"
        onClick={() => setIsCreateModalOpen(true)}
      >
        <FaPlus />
      </button>

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateGroup={handleCreateGroup}
      />
    </div>
  );
};

export default GroupsPage;
