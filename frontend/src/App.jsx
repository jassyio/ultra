import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import StartPage from "./components/pages/StartPage";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import SetupPage from "./components/pages/SetupPage";
import ChatPage from "./components/pages/ChatPage";
import CommunitiesPage from "./components/pages/CommunitiesPage";
import CallsPage from "./components/pages/CallsPage";
import UpdatesPage from "./components/pages/UpdatesPage";
import VerificationPage from "./components/pages/VerificationPage";
import SettingsPage from "./components/pages/SettingsPage"; // <-- Add this import
import CreateGroupPage from "./components/pages/CreateGroupPage";
import GroupChat from "./components/groups/GroupChat"; // <-- Import GroupChat component
import GroupInfo from "./components/groups/GroupInfo";

import MainLayout from "./components/layout/MainLayout";
import PrivateRoute from "./routes/PrivateRoute";

// Import SocketProvider to access socket context throughout the app
import { SocketProvider } from "./context/SocketContext";

const App = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  return (
    // Wrap the app with the SocketProvider to provide socket connection to all components
    <SocketProvider>
      <MainLayout>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >{user ? <Navigate to="/chat" /> : <StartPage />}</motion.div>} />
            <Route path="/login" element={<motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >{user ? <Navigate to="/chat" /> : <Login />}</motion.div>} />
            <Route path="/register" element={<motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >{user ? <Navigate to="/chat" /> : <Register />}</motion.div>} />
            <Route path="/verification" element={<motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            ><VerificationPage /></motion.div>} />
            <Route path="/setup" element={<motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            ><SetupPage /></motion.div>} />

            <Route path="/chat" element={<motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            ><PrivateRoute><ChatPage /></PrivateRoute></motion.div>} />
            <Route path="/communities" element={<motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            ><PrivateRoute><CommunitiesPage /></PrivateRoute></motion.div>} />
            <Route path="/calls" element={<motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            ><PrivateRoute><CallsPage /></PrivateRoute></motion.div>} />
            <Route path="/updates" element={<motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            ><PrivateRoute><UpdatesPage /></PrivateRoute></motion.div>} />
            <Route path="/settings" element={<motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            ><PrivateRoute><SettingsPage /></PrivateRoute></motion.div>} />
            <Route path="/groups/new" element={<motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            ><CreateGroupPage /></motion.div>} />
            <Route path="/groups/:groupId" element={<motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            ><GroupChat /></motion.div>} />
            <Route path="/groups/:groupId/info" element={<motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            ><GroupInfo /></motion.div>} />

            <Route path="*" element={<motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >{user ? <Navigate to="/chat" /> : <Navigate to="/" />}</motion.div>} />
          </Routes>
        </AnimatePresence>
      </MainLayout>
    </SocketProvider>
  );
};

export default App;