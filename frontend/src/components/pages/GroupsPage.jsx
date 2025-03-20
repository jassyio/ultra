import { useState } from "react";
import { FaUsers, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

const GroupsPage = () => {
  const [groups, setGroups] = useState([
    { id: 1, name: "Family Chat", lastMessage: "See you all tonight!" },
    { id: 2, name: "Work Team", lastMessage: "Meeting at 10 AM." },
    { id: 3, name: "Football Fans", lastMessage: "Game on Saturday!" },
  ]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="px-4 py-3 text-lg font-semibold bg-white dark:bg-gray-800 shadow-md flex items-center justify-between">
        <span>Groups</span>
        <button className="text-green-500 text-xl">
          <FaPlus />
        </button>
      </div>

      {/* Group List */}
      <div className="flex-1 overflow-y-auto">
        {groups.map((group) => (
          <Link
            key={group.id}
            to={`/groups/${group.id}`}
            className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-green-500 text-white rounded-full text-lg">
              <FaUsers />
            </div>
            <div className="ml-3">
              <p className="text-base font-medium">{group.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{group.lastMessage}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Create Group Button */}
      <button className="fixed bottom-20 right-5 bg-green-500 text-white p-4 rounded-full shadow-lg text-xl">
        <FaPlus />
      </button>
    </div>
  );
};

export default GroupsPage;
