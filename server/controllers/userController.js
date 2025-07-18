import { generateToken } from "../configs/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

import { v2 as cloudinary } from "cloudinary";

// Sign Up User
export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, bio } = req.body;
    if (!fullName || !email || !password || !bio) {
      return res.json({
        success: false,
        message: "Please Full all the fields",
      });
    }
    const isUser = await User.findOne({ email });
    if (isUser) {
      return res.json({
        success: false,
        message: "User Alreay Availible",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    const token = generateToken(newUser._id);
    res.json({
      success: true,
      userData: newUser,
      token,
      message: "User Added Successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Fuction to User login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await User.findOne({ email });

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);
    if (!isPasswordCorrect) {
      return res.json({ success: false, message: "Invalid Password " });
    }
    // I Neeeeeeeeeeeeeeeeeeeeeeeed TO check the email late as well
    const token = generateToken(userData._id);
    res.json({
      success: true,
      userData,
      token,
      message: "Logged In Successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Controller to check if the user is authenticated
export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

// Fuction to update user profile
export const updateUser = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userId = req.user._id;
    let updatedUser;

    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: upload.secure_url, bio, fullName },
        { new: true }
      );
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Update error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};
