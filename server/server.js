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

// ✅ CORS Configuration (Fix for Vercel)
const allowedOrigins = [
  "http://localhost:5173",
  "https://chat-application-am48.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like curl or mobile apps)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Handle preflight requests (critical for Vercel)
app.options("*", cors());

// Middleware
app.use(express.json({ limit: "4mb" }));

// ✅ Init Socket.io with separate CORS config
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
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

// Connect to DB and Cloudinary
await connectDb();
connectCloudinary();

// Health Check Route
app.use("/api/status", (req, res) => {
  res.send("Server is live");
});

// Routes
app.use("/api/auth", userRouter);
app.use("/api/message", messageRouter);

// Start server (locally only)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log("Server is running on port", PORT);
  });
}

// Export for Vercel
export default server;
