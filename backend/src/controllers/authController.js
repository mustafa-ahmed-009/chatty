import asyncHandler from "express-async-handler";
import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/utils.js";
import { ApiError } from "../utils/apiError.js";
import cloudinary from "../config/cloudinary.js";
export const signUp = asyncHandler(async (req, res) => {
  const user = await User.create({
    fullName: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  
  const token = generateToken(user._id, res);
  res.status(201).json({
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    profilePic: user.profilePic,
    createdAt:user.createdAt, 
  });
});
//
export const login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Invalid credentials"));
  }
  const token = generateToken(user._id, res);
  res.status(200).json({
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    profilePic: user.profilePic,
    createdAt:user.createdAt, 
  });
});
export const logOut = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      message: "logged out sucessfully ",
    });
  } catch (error) {
    next(new ApiError(error.message, 500));
  }
};

export const authneticate = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]; // our jwt token which was send via api or client
  } else {
    token = req.cookies.jwt;

  }
  if (!token) {
    return next(
      new ApiError(
        "You are not login, Please login to get access this route",
        401
      )
    );
  }
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.userId).select("-password");
  if (!currentUser) {
    return next(
      new ApiError(
        "The user that belong to this token does no longer exist",
        401
      )
    );
  }
  req.user = currentUser;
  next();
});


export const updateProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { profilePic, fullName, phone, email } = req.body;

  // Initialize an empty update object
  const updateFields = {};

  // Add fields to the update object only if they are provided in the request body
  if (profilePic) {
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    updateFields.profilePic = uploadResponse.secure_url;
  }
  if (fullName) {
    updateFields.fullName = fullName;
  }
  if (phone) {
    updateFields.phone = phone;
  }
  if (email) {
    updateFields.email = email;
  }

  // If no fields are provided, return an error
  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  // Update the user with the constructed update object
  const user = await User.findByIdAndUpdate(
    userId,
    updateFields,
    { new: true } // Return the updated document
  );

  if (!user) {
    return next(new ApiError(`No document for this id ${userId}`, 404));
  }

  res.status(200).json({ user });
});
export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};