import asyncHandler from "express-async-handler";
import { Message } from "../models/messageModel.js";
import { User } from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";
import { getReceiverSocketId , io } from "../utils/socket.js";

export const getUsersForSideBar = asyncHandler(async (req, res) => { 
    const loggedInUser = req.user._id; 
    const filteredUsers = await User.find({ _id: { $ne: loggedInUser } }).select("fullName email profilePic");
    res.status(200).json({
        status: "success",
        data: filteredUsers,
    });

});

export const getMessages = asyncHandler(async (req, res) => {
    const { id:receiverId } = req.params;
    const loggedInUser = req.user._id.toString();

    
    
    const messages = await Message.find({
        $or: [
            { senderId: loggedInUser, receiverId: receiverId },
            { senderId: receiverId, receiverId: loggedInUser },
        ],
    })
    res.status(200).json(messages);
});
export const sendMessage = asyncHandler(async (req, res) => {
    const { id} = req.params;
    const senderId = req.user._id;
    const { text, image } = req.body;
    let imageUrl;
    if (image) {
        
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;

    }
    const newMessage = await Message.create({
  senderId,
  receiverId: id,
        text,
        image: imageUrl
    }) 
    await newMessage.save();
    const receiverSocketId = getReceiverSocketId(id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(201).json(newMessage);
});