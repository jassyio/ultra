

// Message.jsx
import { CheckIcon } from "@heroicons/react/24/solid";

const Message = ({ text, sender, time, status }) => {
  return (
    <div className={`flex flex-col max-w-xs p-2 rounded-md m-1 ${sender === "You" ? "bg-green-500 text-white ml-auto" : "bg-gray-200 dark:bg-gray-700"}`}>
      <p>{text}</p>
      <div className="flex justify-between items-center text-xs mt-1 text-gray-400">
        <span>{time}</span>
        {sender === "You" && (
          <span className="flex items-center">
            <CheckIcon className={`w-4 h-4 ${status === "read" ? "text-blue-500" : "text-gray-400"}`} />
            <CheckIcon className={`w-4 h-4 ${status === "read" ? "text-blue-500" : "text-gray-400"}`} />
          </span>
        )}
      </div>
    </div>
  );
};

export default Message;
