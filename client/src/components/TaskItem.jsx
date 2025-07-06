/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  getPriorityBadgeColor,
  getPriorityColor,
  MENU_OPTIONS,
  TI_CLASSES,
} from "../assets/dummy";
import { Calendar, CheckCircle2, Clock, MoveVertical } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { format, isToday } from "date-fns";
import TaskModal from "./TaskModal";
const API_URL = import.meta.env.VITE_API_URL;

function TaskItem({
  task,
  onRefresh,
  onDelete,
  onEdit,
  onLogout,
  showCompleteCheckbox = true,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [isCompleted, setIsCompleted] = useState(
    [true, 1, "yes"].includes(
      typeof task?.completed === "string"
        ? task?.completed.toLowerCase()
        : task?.completed
    )
  );

  const [showEdit, setShowEdit] = useState(false);
  const [subtasks, setSubtasks] = useState(task?.subtasks || []);

  useEffect(() => {
    setIsCompleted(
      [true, 1, "yes"].includes(
        typeof task?.completed === "string"
          ? task?.completed.toLowerCase()
          : task?.completed
      )
    );
  }, [task?.completed]);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return {
      Authorization: `Bearer ${token}`,
    };
  };
  const borderColor = isCompleted
    ? "border-green-500"
    : getPriorityColor(task?.priority);

  const handleComplete = async () => {
    const newStatus = isCompleted ? "No" : "Yes";
    try {
      console.log(task);
      await axios.put(
        `${API_URL}/api/v1/tasks/update/${task?._id}`,
        { completed: newStatus },
        { headers: getAuthHeader() }
      );
      setIsCompleted(!isCompleted);
      onRefresh?.();
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        onLogout?.();
      }
    }
  };

  const progress =
    subtasks.length > 0
      ? (subtasks.filter((subtask) => subtask.completed).length /
          subtasks.length) *
        100
      : 0;

  const handleAction = (action) => {
    setShowMenu(false);
    if (action === "edit") {
      setShowEdit(true);
    }
    if (action === "delete") {
      handleDelete();
    }
  };
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/api/v1/tasks/delete/${task?._id}`, {
        headers: getAuthHeader(),
      });
      onRefresh?.();
      toast.success("Task deleted successfully");
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        onLogout?.();
      }
    }
  };
  const handleSave = async (updatedTask) => {
    try {
      const payload = (({
        title,
        description,
        priority,
        dueDate,
        completed,
      }) => ({
        title,
        description,
        priority,
        dueDate,
        completed,
      }))(updatedTask);

      // await axios.put(
      //   `${API_URL}/api/v1/tasks/update/${updatedTask?._id}`,
      //   payload,
      //   {
      //     headers: getAuthHeader(),
      //   }
      // );
      setShowEdit(false);
      onRefresh?.();
      toast.success("Task saved successfully");
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        onLogout?.();
      }
    }
  };
  return (
    <>
      <div className={`${TI_CLASSES.wrapper} ${borderColor}`}>
        <div className={`${TI_CLASSES.leftContainer}`}>
          {showCompleteCheckbox && (
            <button
              onClick={handleComplete}
              className={`cursor-pointer ${TI_CLASSES.completeBtn} ${
                isCompleted ? "text-green-500" : "text-gray-300"
              }`}
            >
              <CheckCircle2
                size={18}
                className={`${TI_CLASSES.checkboxIconBase} ${
                  isCompleted
                    ? "fill-green-400 text-white hover:text-white h-5 w-5"
                    : "text-gray-300 hover:text-gray-300"
                } `}
              />
            </button>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
              <h1
                className={`${TI_CLASSES.titleBase} ${
                  isCompleted ? "text-gray-400 line-through" : "text"
                }`}
              >
                {task?.title}
              </h1>
              <span
                className={`${TI_CLASSES.priorityBadge} ${getPriorityBadgeColor(
                  task?.priority
                )}`}
              >
                {task?.priority}
              </span>
            </div>
            {task?.description && (
              <p className={`${TI_CLASSES.description}`}>{task?.description}</p>
            )}
          </div>
        </div>
        <div className={`${TI_CLASSES.rightContainer}`}>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`${TI_CLASSES.menuButton}`}
            >
              <MoveVertical className="w-4 h-4 sm:w-5 sm:h-5" size={18} />
            </button>
            {showMenu && (
              <div className={`${TI_CLASSES.menuDropdown}`}>
                {MENU_OPTIONS.map((option) => (
                  <button
                    key={option.action}
                    onClick={() => handleAction(option.action)}
                    className={`w-full px-3 sm:px-4 py-2 text-left text-sm sm:text-sm hover:bg-purple-50 flex items-center gap-2 transition-colors duration-300`}
                  >
                    {option.icon} {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <div
              className={`${TI_CLASSES.dateRow} ${
                task.dueDate && isToday(new Date(task.dueDate))
                  ? "text-fuchsia-600"
                  : "text-gray-500"
              } mb-1`}
            >
              <Calendar className="w-3.5 h-3.5" />
              {task.dueDate
                ? isToday(new Date(task.dueDate))
                  ? "Today"
                  : format(new Date(task.dueDate), "MMM d, yyyy")
                : "-"}
            </div>

            <div className={`${TI_CLASSES.createdRow}`}>
              <Clock className=" h-3 w-3 sm:w-3.5 sm:h-3.5" />
              {task.createdAt
                ? format(new Date(task.createdAt), "MMM d, yyyy")
                : "-"}
            </div>
          </div>
        </div>
      </div>
      {
        <TaskModal
          isOpen={showEdit}
          onClose={() => setShowEdit(false)}
          taskToEdit={task}
          onSave={handleSave}
        />
      }
    </>
  );
}

export default TaskItem;
