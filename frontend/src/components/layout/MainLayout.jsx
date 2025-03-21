import { useState, useEffect } from "react";
import Sidebar from "../layout/Sidebar";
import TopNavbar from "../layout/TopNavbar";
import BottomNavbar from "../layout/BottomNavbar";
import ChatList from "../pages/ChatList";
import ChatWindow from "../pages/ChatWindow";
import CommunitiesPage from "../pages/CommunitiesPage";
import CallsPage from "../pages/CallsPage";
import GroupsPage from "../pages/GroupsPage";

const MainLayout = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [activeTab, setActiveTab] = useState("chat"); // Default to "chat"
  const [selectedChat, setSelectedChat] = useState(null); // Track selected chat

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar (Desktop Only) */}
      {isDesktop && <Sidebar />}

      {/* Main Content */}
      <div className="flex flex-col w-full">
        {/* Fixed Top Navbar */}
        <TopNavbar title="Chats" selectedChat={selectedChat} setSelectedChat={setSelectedChat} className="fixed top-0 w-full z-50" />

        {/* Page Content - Centered */}
        <div className="flex-grow flex items-center justify-center mt-16 mb-16">
          {selectedChat ? (
            <ChatWindow selectedChat={selectedChat} />
          ) : (
            <>
              {activeTab === "chat" && <ChatList setSelectedChat={setSelectedChat} />}
              {activeTab === "communities" && <CommunitiesPage />}
              {activeTab === "calls" && <CallsPage />}
              {activeTab === "groups" && <GroupsPage />}
            </>
          )}
        </div>

        {/* Fixed Bottom Navbar (Mobile Only) */}
        {!isDesktop && <BottomNavbar activeTab={activeTab} setActiveTab={setActiveTab} isChatOpen={!!selectedChat} />}
      </div>
    </div>
  );
};

export default MainLayout;
