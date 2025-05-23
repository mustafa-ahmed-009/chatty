import asyncHandler from "express-async-handler";
import { User as UserModel } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ApiError } from "../utils/apiError.js";
import cloudinary from "../config/cloudinary.js";
import { setAuthCookie } from "../utils/setAuthCookie.js";
import CryptoJS from "crypto-js"
import { sendEmail } from "../utils/sendEmail.js";

export const signUp  = asyncHandler(async (req, res , next)=>{
  const user = await UserModel.create({
      name : req.body.name , 
      email : req.body.email , 
      password : req.body.password , 
  })
const token = jwt.sign(
  {
    id: user._id,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: process.env.JWT_EXPIRES_IN,
  }
);
  setAuthCookie(res, token );
  
      req .user = user;
      next() ; 
})
//
export const login = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("incorrect email or password", 401));
  }
  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
  setAuthCookie(res, token);
  const userWithoutPassword = { ...user._doc };
  delete userWithoutPassword.password;
  res.status(200).json({
    status: "success",
    data: {
      user: userWithoutPassword,
    },
  });
});
export const sendNewUserVerificationCode = asyncHandler(async (req , res)=>{
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = CryptoJS.SHA256(resetCode).toString(CryptoJS.enc.Hex);
  const user = req.user;
  user.newUserVerificaitonCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
  user.newRegistrationCode = hashedResetCode ; 
  user.newUserVerified = false ; 
  await user.save();
  const message = `Hey ${user.name}! 👋  

  Welcome to Chatty! To get started, please verify your email using this code:  
  
  🔑 **Verification Code:** ${resetCode}  
  
  ⚠️ This code expires in 10 minutes, so don't wait too long!  
  
  If you didn’t sign up for Chatty, just ignore this message or let us know at support@chatty.com.  
  
  Happy chatting! 🎉  
  
  — The Chatty Team`;  
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message,
    });
    console.log(hashedResetCode);

  } catch (err) {
    user.newRegistrationCode = undefined;
    user.newUserVerificaitonCodeExpires = undefined;
    user.newUserVerified = undefined;

    await user.save();
 throw new ApiError(err ,500);

 
  }
  res.status(200).json({
    status: "success",
    message: "verification  code has been sent to the email ",
  });
})
export const verifyNewUserRegistrationCode = asyncHandler(async (req, res, next) => {
  const verificationCode = req.body.verificationCode
  const hashedResetCode = CryptoJS.SHA256(verificationCode).toString(CryptoJS.enc.Hex);
  
  const user = await UserModel.findOne({
    newRegistrationCode: hashedResetCode,
    newUserVerificaitonCodeExpires: { $gt: Date.now() },
  });
  
  if (!user) {
  throw new ApiError("verifcation code is invalid or expired", 500);
  }
  user.newUserVerified = true;
  user.newUserVerificaitonCodeExpires = undefined ; 
  user.newRegistrationCode =undefined ; 
  await user.save();
  res.status(200).json({
    status: "you have been sucessfully verified ",
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
  const currentUser = await UserModel.findById(decoded.userId).select("-password");
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
  const user = await UserModel.findByIdAndUpdate(
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