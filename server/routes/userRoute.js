import express, { Router } from "express";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  updatePassword,
  updateUserProfile,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";

const userRouter = Router();

// PUBLIC ROUTES
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// PRIVATE ROUTES -
userRouter.get("/me", authMiddleware, getCurrentUser);
userRouter.put("/update-profile", authMiddleware, updateUserProfile);
userRouter.put("/update-password", authMiddleware, updatePassword);

export default userRouter;
