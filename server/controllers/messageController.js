// Get all user except logged in user

import Message from "../models/Message.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";
import { io, userSocketMap } from "../server.js";

// Get all user and unseen messages for all of them
export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;

    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );

    const unseenMessages = {};
    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        reciverId: userId,
        seem: false,
      });
      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });
    await Promise.all(promises);
    res.json({ success: true, users: filteredUsers, unseenMessages });
    // const promises = await Message.find({ reciverId: userId, seen: false });
  } catch (error) {
    console.log(error.messages);
    res.json({ success: false, message: error.message });
  }
};

// Get all messages for selected user
export const getMessagesForSelectedUsers = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const userId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: userId, reciverId: selectedUserId },
        { senderId: selectedUserId, reciverId: userId },
      ],
    });
    await Message.updateMany(
      { senderId: selectedUserId, reciverId: userId },
      { seen: true }
    );

    res.json({ success: true, messages });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Api to mark messages as seen using message id
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });
    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Send message to user
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { image, text } = req.body;
    const reciverId = req.params.id;

    let imagesUrl;
    if (image) {
      const uploadResponce = await cloudinary.uploader.upload(image);
      imagesUrl = uploadResponce.secure_url;
    }
    const newMessage = await Message.create({
      senderId,
      reciverId,
      image: imagesUrl,
      text,
    });

    // Emit the new message to the reciver's socket

    const reciverSocketId = userSocketMap[reciverId];
    if (reciverSocketId) {
      io.to(reciverSocketId).emit("newMessage", newMessage);
    }
    res.json({ success: true, newMessage });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
