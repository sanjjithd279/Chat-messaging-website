import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.js";
import { io, getReveiverSocketId } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getClassStudents = async (req, res) => {
  try {
    const { classId } = req.params;
    const loggedInUserId = req.user._id;

    // Import Class model here to avoid circular dependency
    const Class = (await import("../models/class.model.js")).default;

    const classData = await Class.findById(classId).populate(
      "students",
      "fullName email profilePic"
    );

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Check if user is enrolled in this class
    if (
      !classData.students.some(
        (student) => student._id.toString() === loggedInUserId.toString()
      )
    ) {
      return res
        .status(403)
        .json({ message: "You are not enrolled in this class" });
    }

    // Filter out the current user from the students list
    const otherStudents = classData.students.filter(
      (student) => student._id.toString() !== loggedInUserId.toString()
    );

    res.status(200).json(otherStudents);
  } catch (error) {
    console.log("Error in getClassStudents controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUsersByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const loggedInUserId = req.user._id;

    // Import Class model here to avoid circular dependency
    const Class = (await import("../models/class.model.js")).default;

    const classData = await Class.findById(classId).populate(
      "students",
      "fullName email profilePic"
    );

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Check if user is enrolled in this class
    if (
      !classData.students.some(
        (student) => student._id.toString() === loggedInUserId.toString()
      )
    ) {
      return res
        .status(403)
        .json({ message: "You are not enrolled in this class" });
    }

    // Filter out the current user from the students list
    const otherStudents = classData.students.filter(
      (student) => student._id.toString() !== loggedInUserId.toString()
    );

    res.status(200).json(otherStudents);
  } catch (error) {
    console.log("Error in getUsersByClass controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      //upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSockedId = getReveiverSocketId(receiverId);
    if (receiverSockedId) {
      io.to(receiverSockedId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
