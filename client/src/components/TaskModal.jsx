import React, { useCallback, useEffect, useState } from "react";
import {
  baseControlClasses,
  DEFAULT_TASK,
  priorityStyles,
} from "../assets/dummy";
import {
  AlignLeft,
  Calendar,
  CheckCircle,
  Flag,
  Plus,
  PlusCircle,
  Save,
  X,
} from "lucide-react";

//API URL
const API_URL = import.meta.env.VITE_API_URL;

function TaskModal({ isOpen, onClose, onSave, taskToEdit, onLogout }) {
  const [taskData, setTaskData] = useState(DEFAULT_TASK);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!isOpen) return;
    if (taskToEdit) {
      const normalizeTask =
        taskToEdit?.completed === "Yes" || taskToEdit?.completed === true
          ? "Yes"
          : "No";
      setTaskData({
        ...DEFAULT_TASK,
        title: taskToEdit?.title || "",
        description: taskToEdit?.description || "",
        priority: taskToEdit?.priority || "Low",
        dueDate: taskToEdit?.dueDate?.split("T")[0] || "",
        completed: normalizeTask,
        id: taskToEdit?._id || "",
      });
    } else {
      setTaskData(DEFAULT_TASK);
    }
    setError(null);
  }, [taskToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const getHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      onLogout();
      return;
    }
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      console.log(taskData);
      e.preventDefault();
      if (taskData.dueDate < today) {
        setError("Due date cannot be in the past");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const isEdit = Boolean(taskData.id);
        const url = isEdit
          ? `${API_URL}/api/v1/tasks/update/${taskData.id}`
          : `${API_URL}/api/v1/tasks/create`;
        const method = isEdit ? "PUT" : "POST";

        const response = await fetch(url, {
          method,
          headers: getHeaders(),
          body: JSON.stringify(taskData),
        });
        if (!response.ok) {
          if (response.status === 401) {
            onLogout?.();
            return;
          }
          const err = await response.json();
          throw new Error(err.message || "Failed to save task");
        }
        const data = await response.json();
        onSave?.(data);
        onClose();
        setLoading(false);
      } catch (error) {
        setError(error.message || "Failed to save task");
      } finally {
        setLoading(false);
      }
    },
    [taskData, onSave, onClose, onLogout, getHeaders, today]
  );

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 backdrop-blur-sm z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-purple-100 max-w-md w-full shadow-lg p-6 relative animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            {taskData.id ? (
              <Save className="w-5 h-5 text-purple-600" />
            ) : (
              <PlusCircle className="w-5 h-5 text-purple-600" />
            )}
            {taskData.id ? "Edit Task" : "Add Task"}
          </h2>
          <button
            onClick={onClose}
            className="p-2  hover:bg-purple-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </p>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title
            </label>
            <div className="flex items-center border border-purple-100 rounded-lg px-2 py-2.5 focus-within:ring-2  focus-within:ring-purple-500 focus-within:border-purple-500 transition-all duration-300">
              <input
                type="text"
                id="title"
                name="title"
                value={taskData.title}
                onChange={handleChange}
                className="w-full focus:outline-none text-sm"
                placeholder="Enter task title"
                required
              />
            </div>
          </div>
          <div>
            <label className="flex items-center gap-1  text-sm font-medium text-gray-700 mb-1">
              <AlignLeft className="w-4 h-4 text-purple-500" />
              Description
            </label>
            <textarea
              rows={3}
              name="description"
              id="description"
              value={taskData.description}
              onChange={handleChange}
              className={baseControlClasses}
              placeholder="Enter task description"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1  text-sm font-medium text-gray-700 mb-1">
                <Flag className="w-4 h-4 text-purple-500" />
                Priority
              </label>
              <select
                required
                name="priority"
                id="priority"
                value={taskData.priority}
                onChange={handleChange}
                className={`${baseControlClasses} ${
                  priorityStyles[taskData.priority]
                }`}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1  text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 text-purple-500" />
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                id="dueDate"
                value={taskData.dueDate}
                onChange={handleChange}
                className={baseControlClasses}
                required
                min={today}
              />
            </div>
          </div>
          <div>
            <label className="flex items-center gap-1  text-sm font-medium text-gray-700 mb-2">
              <CheckCircle className="w-4 h-4 text-purple-500" />
              Status
            </label>
            <div className="flex gap-2">
              {[
                { value: "Yes", label: "Completed" },
                { value: "No", label: "In Progress" },
              ].map(({ value, label }) => (
                <label
                  key={value}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <input
                    key={value}
                    type="radio"
                    name="completed"
                    value={value}
                    checked={taskData.completed === value}
                    onChange={handleChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 rounded"
                  />
                  <span className="text-sm ml-2 text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-md transition-colors duration-300"
          >
            {loading ? (
              "Saving..."
            ) : taskData.id ? (
              <>
                <Save className="w-4 h-4" /> Update Task
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> Create Task
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
