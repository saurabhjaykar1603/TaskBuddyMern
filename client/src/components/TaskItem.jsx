import React, { useEffect, useState } from "react";
import { getPriorityColor, TI_CLASSES } from "../assets/dummy";
import { CheckCircle2 } from "lucide-react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

function TaskItem({
  tasks,
  onRefresh,
  onDelete,
  onEdit,
  onLogout,
  showCompleteCheckbox = true,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [isCompleted, setIsCompleted] = useState(
    [true, 1, "yes"].includes(
      typeof tasks?.completed === "string"
        ? tasks?.completed.toLowerCase()
        : tasks?.completed
    )
  );

  const [showEdit, setShowEdit] = useState(false);
  const [subtasks, setSubtasks] = useState(tasks?.subtasks || []);

  useEffect(() => {
    setIsCompleted(
      [true, 1, "yes"].includes(
        typeof tasks?.completed === "string"
          ? tasks?.completed.toLowerCase()
          : tasks?.completed
      )
    );
  }, [tasks?.completed]);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return {
      Authorization: `Bearer ${token}`,
    };
  };
  const borderColor = isCompleted
    ? "border-green-500"
    : getPriorityColor(tasks?.priority?.split(" ")[0]);

  const handleComplete = async () => {
    const newStatus = isCompleted ? "No" : "Yes";
    try {
      console.log(tasks);
      await axios.put(
        `${API_URL}/api/v1/tasks/update/${tasks?.dueDate}`,
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
  return (
    <div className={`${TI_CLASSES.wrapper} ${borderColor}`}>
      <div className={`${TI_CLASSES.leftContainer}`}>
        {showCompleteCheckbox && (
          <button
            onClick={handleComplete}
            className={`${TI_CLASSES.completeBtn} ${
              isCompleted ? "text-green-500" : "text-gray-300"
            }`}
          >
            <CheckCircle2
              size={18}
              className={`${TI_CLASSES.checkboxIconBase} ${
                isCompleted ? "fill-green-500" : ""
              } `}
            />
          </button>
        )}
      </div>
    </div>
  );
}

export default TaskItem;
