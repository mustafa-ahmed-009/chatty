import express from "express";
import { authneticate } from "../controllers/authController.js";
import { getMessages, getUsersForSideBar, sendMessage } from "../controllers/messageController.js";
const router = express.Router();

router.route("/users").get(authneticate , getUsersForSideBar);
router.route("/:id").get(authneticate , getMessages);
router.route("/send/:id").post(authneticate , sendMessage);
export default router;
