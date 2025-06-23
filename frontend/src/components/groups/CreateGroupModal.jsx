import { useState } from "react";
import { FaTimes, FaUsers, FaUserPlus } from "react-icons/fa";
import axios from "axios";
import groupService from "../../api/groupService";

const CreateGroupModal = ({ isOpen, onClose, onCreateGroup }) => {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [members, setMembers] = useState([]); // {id, name, email, avatar}
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [memberError, setMemberError] = useState("");

  const handleAddMember = async () => {
    setMemberError("");
    const trimmed = memberEmail.trim().toLowerCase();
    if (!/\S+@\S+\.\S+/.test(trimmed)) {
      setMemberError("Enter a valid email.");
      return;
    }
    if (members.some((m) => m.email === trimmed)) {
      setMemberError("User already added.");
      return;
    }
    setChecking(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `http://localhost:3001/api/users/check?email=${trimmed}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.exists) {
        setMembers((prev) => [...prev, data.user]);
        setMemberEmail("");
      } else {
        setMemberError("User not found. Only registered users can be added.");
      }
    } catch (err) {
      setMemberError("Server error. Try again.");
    } finally {
      setChecking(false);
    }
  };

  const handleRemoveMember = (email) => {
    setMembers((prev) => prev.filter((m) => m.email !== email));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting group form"); // Add this
    if (!groupName.trim()) {
      setError("Group name is required");
      return;
    }
    if (members.length === 0) {
      setError("Add at least one member.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      console.log("onCreateGroup is", onCreateGroup);
      const success = await onCreateGroup({
        name: groupName.trim(),
        description: groupDescription.trim(),
        members: members.map((m) => m.id),
      });
      if (success) {
        setGroupName("");
        setGroupDescription("");
        setMembers([]);
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
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Add Members (email)</label>
            <div className="flex gap-2">
              <input
                type="email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                placeholder="Enter user email"
                className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                disabled={loading || checking}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddMember();
                  }
                }}
              />
              <button
                type="button"
                className="px-3 py-2 bg-blue-500 text-white rounded"
                onClick={handleAddMember}
                disabled={loading || checking}
              >
                {checking ? "..." : <FaUserPlus />}
              </button>
            </div>
            {memberError && (
              <div className="mt-1 text-xs text-red-600">{memberError}</div>
            )}
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            {members.map((m) => (
              <span
                key={m.email}
                className="flex items-center bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full text-sm"
              >
                <img
                  src={m.avatar || "/default-avatar.png"}
                  alt={m.name}
                  className="w-6 h-6 rounded-full mr-2"
                />
                {m.name || m.email}
                <button
                  type="button"
                  className="ml-2 text-red-500"
                  onClick={() => handleRemoveMember(m.email)}
                  disabled={loading}
                >
                  <FaTimes />
                </button>
              </span>
            ))}
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