import React, { useContext, useEffect, useRef, useState } from "react";
import assets, { messagesDummyData } from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { chatContext } from "../../context/chatContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const { selectedUser, setSelectedUser, sendMessage, getMessages, message } =
    useContext(chatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);
  const [input, setInput] = useState("");
  const scrollEnd = useRef();
  // Handle sending message
  const handelSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return null;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  // Handle sending image
  const handleSendImage = async (e) => {
    console.log("I am at check point one");
    const file = e.target.files[0];

    if (!file || !file.type.startsWith("image/")) {
      console.log("I am at check point two");
      toast.error("Select an image file");
      return;
    }

    console.log("I am at check point three");
    const reader = new FileReader(); // ✅ fixed this line

    reader.onloadend = async () => {
      try {
        await sendMessage({ image: reader.result });
        e.target.value = ""; // Clear input after send
      } catch (error) {
        toast.error("Failed to send image");
        console.error(error);
      }
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current && message) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

  return selectedUser ? (
    <div className="h-full overflow-scroll relative backdrop-blur-lg px-2">
      {/*                           Navbar                */}
      <div className="flex items-center border-b border-stone-500 gap-3 py-3 mx-4">
        <img
          className="w-8 rounded-full"
          src={selectedUser.profilePic || assets.avatar_icon}
          alt="profile"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}{" "}
          <span className="w-2 h-2 rounded-full bg-green-500"></span>{" "}
        </p>
        <img
          onClick={() => {
            setSelectedUser(null);
          }}
          className="md:hidden max-w-7"
          src={assets.arrow_icon}
          alt=""
        />
        <img className="max-md:hidden max-w-5" src={assets.help_icon} alt="" />
      </div>

      {/*                           Chat Area                */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-2 pb-6">
        {message.map((msg, index) => (
          <div
            className={`flex items-end gap-2 justify-end ${
              msg.senderId !== authUser._id && "flex-row-reverse"
            }`}
            key={index}
          >
            {msg.image ? (
              <img
                className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8 "
                src={msg.image}
              />
            ) : (
              <p
                className={`p-4 max-w-[200px] md:text-sm font-light rounded-full mb-8 break-all bg-violet-500/30 text-white ${
                  msg.senderId === authUser._id
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                }`}
              >
                {msg.text}
              </p>
            )}
            <div className="text-center text-sm">
              <img
                className="w-7 rounded-full"
                src={
                  msg.senderId === authUser?._id
                    ? authUser.profilePic
                    : selectedUser.profilePic || assets.avatar_icon
                }
                alt=""
              />
              <p className="text-gray-500">
                {formatMessageTime(msg.createdAt)}
              </p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/*                         Send message Areea              */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex flex-1 items-center bg-gray-100/2 p-3 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => (e.key === "Enter" ? handelSendMessage(e) : null)}
            className="border-none outline-none text-sm text-white placeholder-gray-400
           flex-1 rounded-lg"
            type="text"
            placeholder="Send a message "
          />
          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/png image/jpeg"
            hidden
          />
          <label htmlFor="image">
            <img
              className="w-5 mr-2 cursor-pointer"
              src={assets.gallery_icon}
              alt=""
            />
          </label>
        </div>
        <img
          onClick={handelSendMessage}
          className="w-7 cursor-pointer"
          src={assets.send_button}
          alt=""
        />
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-full w-full flex-col gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img className="max-w-16" src={assets.logo_icon} alt="" />
      <p className="text-lg font-medium text-white">Chat any time</p>
    </div>
  );
};

export default ChatContainer;
