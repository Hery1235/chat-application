import React from "react";

const RightSidebar = ({ selectedUser }) => {
  return (
    <div className={`hidden ${selectedUser ? "md:block" : "hidden"}`}>
      <h1>RightSidebar</h1>
    </div>
  );
};

export default RightSidebar;
