import { io } from "socket.io-client";

const socket = io(import.meta.env.MODE === "production" ? "https://ultra-3il5.onrender.com" : "http://localhost:3001", {
  autoConnect: false,
  transports: ["websocket"],
});

export default socket;