import React, { useContext, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";
import { chatContext } from "../../context/chatContext";

const HomePage = () => {
  const { selectedUser, setSelectedUser } = useContext(chatContext);
  const [showChat, setShowChat] = useState(false);
  return (
    <div className="text-white w-full h-screen border sm:px-[15%] sm:py-[5%]">
      <div
        className={`border-2 border-gray-600 backdrop-blur-xl rounded-2xl overflow-hidden w-full h-[100%] 
          grid grid-cols-1 relative ${
            selectedUser
              ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr] "
              : "md:grid-cols-2"
          }`}
      >
        <Sidebar showChat={showChat} />
        <ChatContainer />
        <RightSidebar />
      </div>
    </div>
  );
};

export default HomePage;
