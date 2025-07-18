import React, { useEffect, useState } from "react";
import assets, { imagesDummyData } from "../assets/assets";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { chatContext } from "../../context/chatContext";

const RightSidebar = () => {
  const { selectedUser, message } = useContext(chatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);

  // Get all images and set them to state

  useEffect(() => {
    setMsgImages(message.filter((msg) => msg.image).map((msg) => msg.image));
  }, [message]);

  return (
    <div
      className={`hidden bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll ${
        selectedUser ? "md:block" : "hidden"
      }`}
    >
      {/*-------------------------Profile detail-------------------------- */}
      <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light am-auto ">
        <img
          className="w-20 aspect-[1/1] rounded-full"
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt=""
        />
        <h1 className="flex gap-2">
          <p className="w-2 h-2 rounded-full bg-green-500"></p>
          {selectedUser?.fullName}
        </h1>
        <p className="px-10 mx-ao">{selectedUser?.bio}</p>
      </div>
      <hr className="border-[#ffffff50] my-4" />
      {/*-------------------------Media-------------------------- */}
      <div className="px-5 text-xs">
        <p>Media</p>
        <div className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
          {msgImages.map((url, index) => (
            <div
              className="cursor-pointer rounded"
              onClick={() => {
                window.open(url);
              }}
              key={index}
            >
              <img className="h-full rounded-md" src={url} alt="" />
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={() => logout()}
        className="absolute bottom-5 left-1/2 transform -translate-x-1/2 
      bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm 
      font-light py-2 px-20 rounded-full cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
};

export default RightSidebar;
