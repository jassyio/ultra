import { useState, useEffect } from "react";
import Sidebar from "../layout/Sidebar";
import TopNavbar from "../layout/TopNavbar";  // ✅ Import fixed
import BottomNavbar from "../layout/BottomNavbar";
import ChatPage from "../pages/ChatPage";
import CommunitiesPage from "../pages/CommunitiesPage";
import CallsPage from "../pages/CallsPage";
import GroupsPage from "../pages/GroupsPage";

const MainLayout = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [activeTab, setActiveTab] = useState("Chat"); // Default to "Chat"

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
        <TopNavbar className="fixed top-0 w-full z-50" />

        {/* Page Content - Centered */}
        <div className="flex-grow flex items-center justify-center mt-16 mb-16">
          {activeTab === "Chat" && <ChatPage />}
          {activeTab === "status" && <CommunitiesPage />}
          {activeTab === "calls" && <CallsPage />}
          {activeTab === "groups" && <GroupsPage />}
        </div>

        {/* Fixed Bottom Navbar (Mobile Only) */}
        {!isDesktop && <BottomNavbar activeTab={activeTab} setActiveTab={setActiveTab} className="fixed bottom-0 w-full z-50" />}
      </div>
    </div>
  );
};

export default MainLayout;
