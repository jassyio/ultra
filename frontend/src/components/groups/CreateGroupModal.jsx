import { useState } from "react";
import { FaTimes, FaUsers } from "react-icons/fa";

const CreateGroupModal = ({ isOpen, onClose, onCreateGroup }) => {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      setError("Group name is required");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const success = await onCreateGroup({
        name: groupName.trim(),
        description: groupDescription.trim()
      });
      
      if (success) {
        setGroupName("");
        setGroupDescription("");
        onClose();
      } else {
        setError("Failed to create group. Please try again.");
      }
    } catch (err) {
      setError(err.message || "An error occurred while creating the group");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-11/12 max-w-md">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold">Create New Group</h2>
          <button onClick={onClose} className="text-gray-500">
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded">
              {error}
            </div>
          )}
          
          <div className="flex items-center justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-green-500 text-white flex items-center justify-center text-3xl">
              <FaUsers />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Group Name</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              disabled={loading}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Group Description (optional)</label>
            <textarea
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              placeholder="Enter group description"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              disabled={loading}
              rows="3"
            />
          </div>
          
          <div className="flex justify-end">
            <button 
              type="button" 
              onClick={onClose}
              className="mr-2 px-4 py-2 text-gray-500"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`px-4 py-2 bg-green-500 text-white rounded ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;