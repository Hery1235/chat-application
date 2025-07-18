import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {
  const { updateProfile, authUser } = useContext(AuthContext);
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);
  const [isProfileImageSelected, setIsProfileImageSelected] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isProfileImageSelected) {
      console.log("NOt selected");
      updateProfile({ fullName: name, bio });
      navigate("/");
      return;
    }
    console.log(" selected");
    const reader = new FileReader();
    reader.readAsDataURL(profileImage);
    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({ profilePic: base64Image, fullName: name, bio });
    };
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div
        className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600
      flex items-center justify-center max-sm:flex-col-reverse rounded-lg"
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 p-10 flex-1"
          action=""
        >
          <h3 className="text-lg">Profile Details</h3>
          <label
            className="flex items-center gap-3 cursor-pointer"
            htmlFor="avatar"
          >
            <input
              onChange={(e) => {
                setProfileImage(e.target.files[0]);
                setIsProfileImageSelected(true);
              }}
              type="file"
              name=""
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              className={`w-12 h-12 rounded-full`}
              src={
                profileImage
                  ? URL.createObjectURL(profileImage)
                  : assets.avatar_icon
              }
              alt=""
            />
            Upload profile image
          </label>
          <input
            onChange={(e) => {
              setName(e.target.value);
            }}
            className="p-2 border border-gray-500 rounded-md focus:outline-none
          focus:ring-2 focus-ring-violet-500"
            type="text"
            value={name}
            placeholder="Your Name"
            required
          />
          <textarea
            className="p-2 border border-gray-500 rounded-md focus:outline-none
          focus:ring-2 focus-ring-violet-500"
            name=""
            onChange={(e) => {
              setBio(e.target.value);
            }}
            rows={3}
            value={bio}
            required
            placeholder="Write Profile Bio"
          ></textarea>
          <button
            className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 
            rounded-full text-lg cursor-pointer"
            type="submit"
          >
            Save
          </button>
        </form>
        <img
          className="max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10"
          src={authUser?.profilePic || assets.logo_icon}
          alt=""
        />
      </div>
    </div>
  );
};

export default ProfilePage;
