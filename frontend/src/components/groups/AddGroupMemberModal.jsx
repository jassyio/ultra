import { useState } from "react";
import { FaTimes, FaUserPlus } from "react-icons/fa";
import axios from "axios";
import groupService from "../../api/groupService";

const AddGroupMemberModal = ({ groupId, onClose, onMemberAdded }) => {
  const [email, setEmail] = useState("");
  const [checking, setChecking] = useState(false);
  const [adding, setAdding] = useState(false);
  const [foundUser, setFoundUser] = useState(null);
  const [error, setError] = useState("");

  const handleCheckEmail = async () => {
    setError("");
    setFoundUser(null);
    const trimmed = email.trim().toLowerCase();
    if (!/\S+@\S+\.\S+/.test(trimmed)) {
      setError("Enter a valid email.");
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
        setFoundUser(data.user);
      } else {
        setError("User not found. Only registered users can be added.");
      }
    } catch (err) {
      setError("Server error. Try again.");
    } finally {
      setChecking(false);
    }
  };

  const handleAddMember = async () => {
    if (!foundUser) return;
    setAdding(true);
    setError("");
    try {
      await groupService.addMember(groupId, foundUser.id);
      setEmail("");
      setFoundUser(null);
      if (onMemberAdded) onMemberAdded();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not add member. They may already be in the group."
      );
    } finally {
      setAdding(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setFoundUser(null);
    setError("");
    setChecking(false);
    setAdding(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-11/12 max-w-sm">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold">Add Group Member</h2>
          <button onClick={handleClose} className="text-gray-500">
            <FaTimes />
          </button>
        </div>
        <div className="p-4">
          {error && (
            <div className="mb-3 p-2 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded">
              {error}
            </div>
          )}
          {!foundUser ? (
            <>
              <label className="block text-sm font-medium mb-1">
                Enter user email
              </label>
              <div className="flex gap-2 mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@email.com"
                  className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  disabled={checking || adding}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleCheckEmail();
                    }
                  }}
                />
                <button
                  type="button"
                  className="px-3 py-2 bg-blue-500 text-white rounded"
                  onClick={handleCheckEmail}
                  disabled={checking || adding}
                >
                  {checking ? "..." : <FaUserPlus />}
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-500"
                  disabled={checking || adding}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={foundUser.avatar || "/default-avatar.png"}
                  alt={foundUser.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-semibold">{foundUser.name}</div>
                  <div className="text-xs text-gray-500">{foundUser.email}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded"
                  onClick={handleAddMember}
                  disabled={adding}
                >
                  {adding ? "Adding..." : "Add to Group"}
                </button>
                <button
                  type="button"
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded"
                  onClick={handleClose}
                  disabled={adding}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddGroupMemberModal;