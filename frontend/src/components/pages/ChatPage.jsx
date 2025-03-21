import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPhone, FaVideo, FaEllipsisV, FaSmile, FaPaperclip, FaMicrophone } from "react-icons/fa";

const ChatPage = () => {
  const { selectedChat, setSelectedChat } = useContext(ChatContext);
  const navigate = useNavigate();

  // If no chat is selected, go back to chat list
  if (!selectedChat) {
    navigate("/chats");
    return null;
  }

  return (
    <div className="flex flex-col h-screen">
      {/* ✅ Top Navbar */}
      <div className="bg-white shadow-md p-3 flex items-center justify-between fixed top-0 w-full z-50">
        <FaArrowLeft size={18} onClick={() => {
          setSelectedChat(null);
          navigate("/chats");
        }} className="cursor-pointer mx-2" />
        <img src={selectedChat.avatar} alt="Profile" className="w-8 h-8 rounded-full mr-2" />
        <h2 className="text-lg font-semibold flex-grow">
          {selectedChat.name.length > 10 ? selectedChat.name.substring(0, 7) + "..." : selectedChat.name}
        </h2>
        <FaPhone size={18} className="mx-2 cursor-pointer" />
        <FaVideo size={18} className="mx-2 cursor-pointer" />
        <FaEllipsisV size={18} className="mx-2 cursor-pointer" />
      </div>

      {/* ✅ Chat Messages */}
      <div className="flex-grow pt-16 pb-16 overflow-y-auto">
        {selectedChat.messages.map((msg, index) => (
          <div key={index} className={`p-2 my-1 rounded-lg ${msg.sender === "You" ? "bg-blue-500 text-white self-end" : "bg-gray-200"}`}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      {/* ✅ Input Area */}
      <div className="fixed bottom-0 w-full bg-gray-100 p-2 flex items-center">
        <FaSmile size={22} className="mx-2 cursor-pointer" />
        <input type="text" placeholder="Type a message" className="flex-grow px-3 py-2 border rounded-full" />
        <FaPaperclip size={22} className="mx-2 cursor-pointer" />
        <FaMicrophone size={22} className="mx-2 cursor-pointer" />
      </div>
    </div>
  );
};

export default ChatPage;
