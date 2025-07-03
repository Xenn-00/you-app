import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:3000", {
  query: {
    userId: "6864b8dc8cd6e0dd22fd6016", // ganti ke user ID lo
  },
  transports: ["websocket"], // optional, tapi bisa stabilin koneksi
});

socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);
});

socket.on("newMessage", (data) => {
  console.log("📩 New message received:", data);
});

socket.on("disconnect", () => {
  console.log("🔌 Disconnected from server");
});

socket.on("connect_error", (err) => {
  console.error("❌ Connection error:", err.message);
});
