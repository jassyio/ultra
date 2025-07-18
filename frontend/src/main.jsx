import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ Import Router
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext"; 
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import theme from './theme';

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter> {/* ✅ Wrap everything in Router */}
    <AuthProvider>
      <ChatProvider>
        <MuiThemeProvider theme={theme}>
          <App />
        </MuiThemeProvider>
      </ChatProvider>
    </AuthProvider>
  </BrowserRouter>
);
