import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ Import Router
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext"; 
import { ThemeProvider } from './context/ThemeContext';

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter> {/* ✅ Wrap everything in Router */}
    <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          <App />
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);
