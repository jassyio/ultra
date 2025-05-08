import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

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

import MainLayout from "./components/layout/MainLayout";
import PrivateRoute from "./routes/PrivateRoute";

// Import SocketProvider to access socket context throughout the app
import { SocketProvider } from "./context/SocketContext";

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    // Wrap the app with the SocketProvider to provide socket connection to all components
    <SocketProvider>
      <MainLayout>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/chat" /> : <StartPage />} />
          <Route path="/login" element={user ? <Navigate to="/chat" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/chat" /> : <Register />} />
          <Route path="/verification" element={<VerificationPage />} />
          <Route path="/setup" element={<SetupPage />} />

          <Route path="/chat" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
          <Route path="/communities" element={<PrivateRoute><CommunitiesPage /></PrivateRoute>} />
          <Route path="/calls" element={<PrivateRoute><CallsPage /></PrivateRoute>} />
          <Route path="/updates" element={<PrivateRoute><UpdatesPage /></PrivateRoute>} />

          <Route path="*" element={user ? <Navigate to="/chat" /> : <Navigate to="/" />} />
        </Routes>
      </MainLayout>
    </SocketProvider>
  );
};

export default App;
