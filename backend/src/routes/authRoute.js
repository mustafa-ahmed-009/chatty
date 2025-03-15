import express from "express";
import {
  authneticate,
  checkAuth,
  login,
  logOut,
  signUp,
  updateProfile,
} from "../controllers/authController.js";
import {
  signupValidator,
  loginValidator,
  updateUserValidator,
} from "../validators/authValidator.js";
const router = express.Router();

router.post("/signup", signupValidator, signUp);
router.post("/login", loginValidator, login);
router.post("/logout", logOut);
router.put("/update-profile", authneticate, updateUserValidator, updateProfile);
router.get("/check", authneticate, checkAuth);
export default router;
