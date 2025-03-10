import { Routes, Route, Navigate } from "react-router-dom";
import StartPage from "./pages/StartPage";
import SetupPage from "./pages/SetupPage";
import ChatPage from "./pages/ChatPage";
import UpdatesPage from "./pages/UpdatesPage";
import CommunitiesPage from "./pages/CommunitiesPage";
import CallsPage from "./pages/CallsPage";
import SettingsPage from "./pages/SettingsPage";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/setup" element={<SetupPage />} />
      <Route path="/chats" element={<ChatPage />} />
      <Route path="/updates" element={<UpdatesPage />} />
      <Route path="/communities" element={<CommunitiesPage />} />
      <Route path="/calls" element={<CallsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/login" element={<Login />} />

      {/* Redirect unknown routes to start */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
