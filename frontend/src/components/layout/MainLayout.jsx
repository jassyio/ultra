import { useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { routeConfig } from "../../config/routeConfig";
import TopNavbar from "./TopNavbar";
import BottomNavbar from "./BottomNavbar";

const MainLayout = ({ children }) => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("Chat");

  const path = location.pathname;
  const showNavbars = Object.keys(routeConfig).includes(path);
  const currentTitle = routeConfig[path]?.title || "Ultra";

  useEffect(() => {
    setActiveTab(routeConfig[path]?.title || "Chat");
  }, [path]);

  return (
    <div className="flex flex-col h-screen">
      {user && showNavbars && (
        <div className="fixed top-0 w-full z-50">
          <TopNavbar title={currentTitle} />
        </div>
      )}

      <div className={`flex-grow flex items-center justify-center ${showNavbars ? "pt-16 pb-16" : ""}`}>
        {children}
      </div>

      {user && showNavbars && (
        <div className="fixed bottom-0 w-full z-50">
          <BottomNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      )}
    </div>
  );
};

export default MainLayout;
