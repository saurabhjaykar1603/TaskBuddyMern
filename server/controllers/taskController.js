import Task from "../models/taskModel.js";

// Create a new task

export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, completed } = req.body;
    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      completed: completed === "Yes" || completed === true,
      owner: req.user._id,
    });
    const savedTask = await task.save();
    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: savedTask,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
