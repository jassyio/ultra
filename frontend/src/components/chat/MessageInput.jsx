import { useState, useContext } from "react";
import { ChatContext } from "../../context/ChatContext";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const { sendMessage } = useContext(ChatContext);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessage(message);
    setMessage(""); // Clear input after sending
  };

  return (
    <div className="flex items-center p-3 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 p-2 border rounded-md outline-none dark:bg-gray-700 dark:text-white"
      />
      <button
        onClick={handleSend}
        className="ml-3 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
