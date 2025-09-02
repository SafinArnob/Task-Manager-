import express from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  verifyUser,
} from "../controller/user.controller.js";
import { auth } from "../middleware/authMiddleware.js";
import { createTask, deleteTask, getTask, getTasks, updateTask } from "../controller/task.controller.js";


const router = express.Router();

// AUTH ROUTES
router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.post("/auth/verify", verifyUser);
router.post("/auth/refresh", refreshAccessToken);
router.post("/auth/logout", auth, logoutUser);


//Task Manager Routes
router.post("/tasks/create", auth, createTask);
router.get("/tasks", auth, getTasks);
router.get("/tasks/:id", auth, getTask);
router.put("/tasks/:id", auth, updateTask);
router.delete("/tasks/:id", auth, deleteTask);

export default router;
