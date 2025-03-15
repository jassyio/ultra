import React from "react";
import { useSwipeable } from "react-swipeable";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import TopNavbar from "../components/layout/TopNavbar";
import BottomNavbar from "../components/layout/BottomNavbar";

const pages = ["/chat", "/updates", "/calls", "/groups"]; // The main bottom tabs

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentIndex = pages.indexOf(location.pathname);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < pages.length - 1) {
        navigate(pages[currentIndex + 1]);
      }
    },
    onSwipedRight: () => {
      if (currentIndex > 0) {
        navigate(pages[currentIndex - 1]);
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col" {...handlers}>
        {/* Top Navbar */}
        <TopNavbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4">{children}</main>

        {/* Bottom Navbar for Mobile */}
        <BottomNavbar />
      </div>
    </div>
  );
};

export default MainLayout;
