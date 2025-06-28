import { Router } from "express";
import {
  createTask,
  deleteTaskById,
  getTaskById,
  getTasks,
  updateTaskById,
} from "../controllers/taskController.js";
import authMiddleware from "../middleware/auth.js";

const taskRouter = Router();

// Route for getting all tasks and creating a new task
taskRouter.get("/get", authMiddleware, getTasks);
taskRouter.post("/create", authMiddleware, createTask);

// Routes for operations on specific tasks by ID
taskRouter.get("/get/:id", authMiddleware, getTaskById);
taskRouter.put("/update/:id", authMiddleware, updateTaskById);
taskRouter.delete("/delete/:id", authMiddleware, deleteTaskById);

export default taskRouter;
