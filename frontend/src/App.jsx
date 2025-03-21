import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import SetupPage from "./components/pages/SetupPage";
import ChatPage from "./components/pages/ChatPage";
import CommunitiesPage from "./components/pages/CommunitiesPage";
import CallsPage from "./components/pages/CallsPage";
import UpdatesPage from "./components/pages/UpdatesPage";
import TopNavbar from "./components/layout/TopNavbar";
import BottomNavbar from "./components/layout/BottomNavbar";

const App = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("Chat");

  // Define which pages should have navbars
  const showNavbars = ["/chat", "/communities", "/calls", "/updates"].includes(location.pathname);

  // Dynamic page title
  const pageTitles = {
    "/chat": "Ultra",
    "/communities": "Communities",
    "/calls": "Calls",
    "/updates": "Updates",
  };

  return (
    <div className="flex flex-col h-screen">
      {/* ✅ Only show Top Navbar if user is on Chat or main pages */}
      {user && showNavbars && (
        <div className="fixed top-0 w-full z-50">
          <TopNavbar title={pageTitles[location.pathname] || "Ultra"} />
        </div>
      )}

      {/* ✅ Main Content */}
      <div className={`flex-grow flex items-center justify-center ${showNavbars ? "pt-16 pb-16" : ""}`}>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/setup" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/setup" /> : <Register />} />
          <Route path="/setup" element={user ? <SetupPage /> : <Navigate to="/login" />} />
          <Route path="/chat" element={user ? <ChatPage /> : <Navigate to="/login" />} />
          <Route path="/communities" element={user ? <CommunitiesPage /> : <Navigate to="/login" />} />
          <Route path="/calls" element={user ? <CallsPage /> : <Navigate to="/login" />} />
          <Route path="/updates" element={user ? <UpdatesPage /> : <Navigate to="/login" />} />
          <Route path="/*" element={user ? <Navigate to="/chat" /> : <Navigate to="/login" />} />
        </Routes>
      </div>

      {/* ✅ Only show Bottom Navbar if user is on Chat or main pages */}
      {user && showNavbars && (
        <div className="fixed bottom-0 w-full z-50">
          <BottomNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      )}
    </div>
  );
};

export default App;
