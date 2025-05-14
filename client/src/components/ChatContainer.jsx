import React, { useEffect, useRef } from "react";
import assets, { messagesDummyData } from "../assets/assets";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const scrollEnd = useRef();

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return selectedUser ? (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/*                           Navbar                */}
      <div className="flex items-center border-b border-stone-500 gap-3 py-3 mx-4">
        <img
          className="w-8 rounded-full"
          src={assets.profile_martin}
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
        {messagesDummyData.map((msg, index) => (
          <div
            className={`flex items-end gap-2 justify-end ${
              msg.senderId !== "680f50e4f10f3cd28382ecf9" && "flex-row-reverse"
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
                  msg.senderId === "680f50e4f10f3cd28382ecf9"
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
                  msg.senderId === "680f50e4f10f3cd28382ecf9"
                    ? assets.avatar_icon
                    : assets.profile_martin
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
      {/* <div className="flex justify-between bg-[#282142]/50 p-3 rounded-full absolute b-0 left-0">
        <input
          className="border-none outline-none text-sm text-white "
          type="text"
          placeholder="Send a messege"
        />
        <img className="w-3 h-3" src={assets.gallery_icon} alt="gellary" />
      </div> */}
    </div>
  ) : (
    <div className="flex justify-center items-center h-full w-full flex-col gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img className="max-w-16" src={assets.logo_icon} alt="" />
      <p className="text-lg font-medium text-white">Chat any time</p>
    </div>
  );
};

export default ChatContainer;
