// src/layouts/MainLayout.jsx
import React from "react";
import Sidebar from "../components/layout/Sidebar";
import TopNavbar from "../components/layout/TopNavbar";
import BottomNavbar from "../components/layout/BottomNavbar";

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
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
