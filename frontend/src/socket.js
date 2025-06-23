import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:3001", {
  autoConnect: false,
  transports: ["websocket"],
});

export default socket;