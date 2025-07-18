import React, { useEffect, useState } from "react";
import assets, { userDummyData } from "../assets/assets";
import avatar_icon from "../assets/avatar_icon.png";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { chatContext } from "../../context/chatContext";

const Sidebar = () => {
  const [input, setInputs] = useState(false);
  const { logout, onlineUsers } = useContext(AuthContext);
  const {
    selectedUser,
    setSelectedUser,
    users,
    getUsers,
    unseenMessages,
    setUnseenMessages,
  } = useContext(chatContext);
  const navigate = useNavigate();

  // Filter Users
  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  useEffect(() => {
    console.log("Calling to get users ");
    getUsers();
    console.log("The users are ", users);
  }, [onlineUsers]);
  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      <div className="pb-5">
        {/*                          Navbar                */}
        <div className="flex justify-between items-center">
          <img className="max-w-40" src={assets.logo} alt="logo" />
          <div className="relative py-2 group">
            <img
              className="max-h-5 cursor-pointer"
              src={assets.menu_icon}
              alt="menu"
            />
            <div
              className="flex flex-col absolute right-0 z-20 w-32 p-5 
            top-full border border-gray-600 p-4 rounded-md bg-[#282142] 
            text-gray-100 group-hover:block hidden"
            >
              <p
                onClick={() => {
                  navigate("/profile");
                }}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p
                onClick={() => {
                  logout();
                }}
                className="cursor-pointer text-sm"
              >
                Logout
              </p>
            </div>
          </div>
        </div>
        {/*                          Search box            */}
        <div className="bg-[#282141] rounded-full flex items-center gap-2 px-4 py-3 mt-5">
          <img className="w-3" src={assets.search_icon} alt="search" />
          <input
            onChange={(e) => setInputs(e.target.value)}
            className="border-none outline-none bg-transparent flex-1 text-white text-xs placeholder-[#c8c8c8]"
            type="text"
            placeholder="Search User ..."
          />
        </div>
        {/*                         UsersList               */}
        <div className="flex flex-col mt-6">
          {filteredUsers.map((user, index) => (
            <div
              onClick={() => {
                setSelectedUser(user);
                setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
              }}
              key={index}
              className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
                selectedUser?._id === user._id && "bg-[#282142]/50"
              }`}
            >
              <img
                className="w-[35px] rounded-full"
                src={user?.profilePic || assets.avatar_icon}
                alt="profilepic"
              />
              <div className="flex flex-col leading-5">
                <p>{user.fullName}</p>
                {onlineUsers.includes(user._id) ? (
                  <span className="text-green-400 text-xs">Online</span>
                ) : (
                  <span className="text-neutral-400 text-xs">Offline</span>
                )}
              </div>
              {unseenMessages[user._id] > 0 && (
                <p
                  className="absolute top-4 right-4 text-xs h-5 w-5 
              flex justify-center items-center rounded-full bg-violet-500/50"
                >
                  {unseenMessages[user._id]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
