import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createClass,
  joinClass,
  getUserClasses,
  getClassStudents,
} from "../controllers/class.controller.js";

const router = express.Router();

router.post("/create", protectRoute, createClass);
router.post("/join", protectRoute, joinClass);
router.get("/user-classes", protectRoute, getUserClasses);
router.get("/:classId/students", protectRoute, getClassStudents);

export default router;
