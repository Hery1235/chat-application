import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import connectDb from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import { Server } from "socket.io";

// Create Express app and Http server
const app = express();
const server = http.createServer(app);

// Initilize socket.io server
export const io = new Server(server, {
  cors: { origin: "*", credentials: true },
});
// Store online users
export const userSocketMap = {}; // userId: socketId

// Socket.io connection handler

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected", userId);
  if (userId) userSocketMap[userId] = socket.id;

  console.log("Connected Users are ", userSocketMap);

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    console.log(userSocketMap);
  });
});

// Middleware setup
app.use(cors());
app.use(express.json({ limit: "4mb" }));

// Connecting database
await connectDb();
connectCloudinary();
app.use("/api/status", (req, res) => {
  res.send("Server is live");
});

// APi for a user
app.use("/api/auth", userRouter);

//Api for messaegs
app.use("/api/message", messageRouter);

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log("Server is running of the port ", PORT);
  });
}
// Export server for vercel
export default server;
