import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
  getMessagesForSelectedUsers,
  getUsersForSidebar,
  markMessageAsSeen,
  sendMessage,
} from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getUsersForSidebar);
messageRouter.get("/:id", protectRoute, getMessagesForSelectedUsers);
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);
messageRouter.post("/send/:id", protectRoute, sendMessage);

export default messageRouter;
