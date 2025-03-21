// MessageInput.jsx
import { useState } from "react";
import { PaperAirplaneIcon, PaperClipIcon, FaceSmileIcon } from "@heroicons/react/24/solid";

const MessageInput = ({ sendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="flex items-center p-3 border-t dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
      <button className="p-2 text-gray-500 dark:text-gray-400">
        <FaceSmileIcon className="w-6 h-6" />
      </button>
      <button className="p-2 text-gray-500 dark:text-gray-400">
        <PaperClipIcon className="w-6 h-6" />
      </button>
      <input
        type="text"
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 p-2 mx-2 rounded-lg bg-white dark:bg-gray-800 border dark:border-gray-700 focus:outline-none"
      />
      <button onClick={handleSend} className="p-2 text-blue-500">
        <PaperAirplaneIcon className="w-6 h-6 rotate-90" />
      </button>
    </div>
  );
};

export default MessageInput;
