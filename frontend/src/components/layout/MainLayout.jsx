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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100vw',
      background: 'inherit',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
    }}>
      {user && showNavbars && (
        <div className="fixed top-0 w-full z-50">
          <TopNavbar title={currentTitle} />
        </div>
      )}

      <div style={{
        flex: 1,
        width: '100vw',
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        display: 'block',
      }}>
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
