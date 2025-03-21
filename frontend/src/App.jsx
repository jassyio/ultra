import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import StartPage from "./components/pages/StartPage"; // ✅ New Start Page
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

  // ✅ Sync active tab with URL
  useEffect(() => {
    const tabMap = {
      "/chat": "Chat",
      "/communities": "Communities",
      "/calls": "Calls",
      "/updates": "Updates",
    };
    setActiveTab(tabMap[location.pathname] || "Chat");
  }, [location.pathname]);

  // ✅ Pages that should show the navbars
  const showNavbars = ["/chat", "/communities", "/calls", "/updates"].includes(location.pathname);

  // ✅ Dynamic page titles
  const pageTitles = {
    "/chat": "Chat",
    "/communities": "Communities",
    "/calls": "Calls",
    "/updates": "Updates",
  };

  return (
    <div className="flex flex-col h-screen">
      {/* ✅ Only show Top Navbar on main pages */}
      {user && showNavbars && (
        <div className="fixed top-0 w-full z-50">
          <TopNavbar title={pageTitles[location.pathname] || "Ultra"} />
        </div>
      )}

      {/* ✅ Main Content */}
      <div className={`flex-grow flex items-center justify-center ${showNavbars ? "pt-16 pb-16" : ""}`}>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/chat" /> : <StartPage />} /> {/* ✅ StartPage as default */}
          <Route path="/login" element={user ? <Navigate to="/setup" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/setup" /> : <Register />} />
          <Route path="/setup" element={user ? <SetupPage /> : <Navigate to="/login" />} />
          <Route path="/chat" element={user ? <ChatPage /> : <Navigate to="/login" />} />
          <Route path="/communities" element={user ? <CommunitiesPage /> : <Navigate to="/login" />} />
          <Route path="/calls" element={user ? <CallsPage /> : <Navigate to="/login" />} />
          <Route path="/updates" element={user ? <UpdatesPage /> : <Navigate to="/login" />} />
          <Route path="*" element={user ? <Navigate to="/chat" /> : <Navigate to="/" />} /> {/* ✅ Redirect to StartPage if not logged in */}
        </Routes>
      </div>

      {/* ✅ Only show Bottom Navbar on main pages */}
      {user && showNavbars && (
        <div className="fixed bottom-0 w-full z-50">
          <BottomNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      )}
    </div>
  );
};

export default App;
