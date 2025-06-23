import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMessages,
  sendMessage,
  getUsersForSidebar,
  getClassStudents,
  getUsersByClass,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/conversations", protectRoute, getUsersForSidebar);
router.get("/class/:classId/students", protectRoute, getClassStudents);
router.get("/class/:classId/users", protectRoute, getUsersByClass);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

export default router;
