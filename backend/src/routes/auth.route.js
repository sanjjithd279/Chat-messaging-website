import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);
//updating profile is a put request
router.put("/update-profile", protectRoute, updateProfile); //protectRoute makes sure that you can only do this if logged in successfully

router.get("/check", protectRoute, checkAuth);

export default router;
