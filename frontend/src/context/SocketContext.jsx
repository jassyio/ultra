import { createContext, useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext); // Ensure user is fetched from AuthContext
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      console.error("❌ User is not authenticated");
      return;
    }

    const newSocket = io("http://localhost:3001", {
      transports: ["websocket"],
      auth: { userId: user.id },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      setIsConnected(true);
      console.log(`✅ Connected to server: ${newSocket.id}`);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      console.log("❌ Disconnected from server");
    });

    return () => {
      newSocket.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [user?.id]); // Ensure user.id is available before initializing socket

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};