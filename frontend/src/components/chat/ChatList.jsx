import { useContext, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import Avatar from "@mui/material/Avatar";

const ChatList = () => {
  const { chats, setSelectedChat, selectedChat } = useContext(ChatContext);
  const { user } = useContext(AuthContext);

  // Restore selected chat from localStorage on mount
  useEffect(() => {
    const savedChat = localStorage.getItem("selectedChat");
    if (savedChat) {
      setSelectedChat(JSON.parse(savedChat));
    }
  }, [setSelectedChat]);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    localStorage.setItem("selectedChat", JSON.stringify(chat));
  };

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-gray-900">
      <div className="h-[108px] px-4 pt-6 bg-[#f0f2f5] dark:bg-gray-800">
        <h1 className="text-[20px] leading-8 text-[#111b21] dark:text-white font-normal">
          Chats
        </h1>
      </div>
      <div className="px-[10px]">
        {chats.length === 0 && (
          <div className="text-center text-gray-400 mt-8">No chats yet</div>
        )}
        {chats.map((chat) => {
          const chatPartner = chat.participants.find((p) => p._id !== user?.id);
          if (!chatPartner) return null;

          return (
            <div
              key={chat._id}
              onClick={() => handleChatSelect(chat)}
              className={`flex items-center h-[72px] px-3 cursor-pointer hover:bg-[#f5f6f6] dark:hover:bg-gray-800 ${
                selectedChat?._id === chat._id ? "bg-[#f0f2f5] dark:bg-gray-800" : ""
              }`}
            >
              <Avatar
                src={chatPartner.avatar || "/default-avatar.png"}
                alt={chatPartner.name}
                sx={{ width: 49, height: 49, marginRight: "12px" }}
              />
              <div className="flex-1 min-w-0 border-t border-[#e9edef] dark:border-gray-700 py-[10px]">
                <div className="flex justify-between items-center">
                  <h2 className="text-[17px] leading-[21px] text-[#111b21] dark:text-white truncate">
                    {chatPartner.name}
                  </h2>
                  {chat.lastMessage && (
                    <span className="text-xs text-[#667781]">
                      {new Date(chat.lastMessage.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>
                {chat.lastMessage && (
                  <p className="text-[14px] text-[#667781] truncate mt-0.5">
                    {chat.lastMessage.content}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatList;