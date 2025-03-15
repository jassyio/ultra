import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import TopNavbar from './components/layout/TopNavbar';
import BottomNavbar from './components/layout/BottomNavbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ChatPage from './pages/ChatPage';
import UpdatesPage from './pages/UpdatesPage';
import CallsPage from './pages/CallsPage';
import StartPage from './pages/StartPage';
import SetupPage from './pages/SetupPage';
import RequireAuth from './components/common/RequireAuth';
import './styles/style.css'; // Import global styles

const Layout = ({ children }) => {
  const location = useLocation();

  // Hide Navbar on Start, Login, Register, and Setup pages
  const hideNavbar = ['/', '/login', '/register', '/setup'].includes(
    location.pathname
  );

  return (
    <>
      {!hideNavbar && <TopNavbar />}
      {children}
      {!hideNavbar && <BottomNavbar />}
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<StartPage />} />
              <Route path="/setup" element={<SetupPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/chat"
                element={
                  <RequireAuth>
                    <ChatPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/updates"
                element={
                  <RequireAuth>
                    <UpdatesPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/calls"
                element={
                  <RequireAuth>
                    <CallsPage />
                  </RequireAuth>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
