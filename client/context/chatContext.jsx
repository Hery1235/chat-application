import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import React from "react";

export const chatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [message, setMessage] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  // Funtion to get all user
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/message/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Function to get messages for selected user
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/message/${userId}`);
      if (data.success) {
        setMessage(data.messages);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fuction to send message to selected user

  const sendMessage = async (messageData) => {
    try {
      console.log("I am at check POint 4");
      const { data } = await axios.post(
        `/api/message/send/${selectedUser._id}`,
        messageData
      );
      if (data.success) {
        setMessage((prevMessages) => [...prevMessages, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Function subscribe to messages

  const subscribeToMessages = async () => {
    if (!socket) return;

    // Avoid duplicate listeners
    socket.off("newMessage");

    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessage((prevMessages) => [...prevMessages, newMessage]);
        axios.put(`/api/message/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((prevUnSeenMessages) => ({
          ...prevUnSeenMessages,
          [newMessage.senderId]: prevUnSeenMessages[newMessage.senderId]
            ? prevUnSeenMessages[newMessage.senderId] + 1
            : 1,
        }));
      }
    });
  };

  // Function to unsubscribe from messages
  const unSubsribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };
  useEffect(() => {
    subscribeToMessages();
    return () => unSubsribeFromMessages;
  }, [socket, selectedUser]);

  const value = {
    message,
    setMessage,
    users,
    setUsers,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    socket,
    axios,
    getUsers,
    sendMessage,
    getMessages,
  };

  return <chatContext.Provider value={value}>{children}</chatContext.Provider>;
};
