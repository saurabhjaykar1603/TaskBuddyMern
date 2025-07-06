/* eslint-disable no-unused-vars */
import React from "react";
import {
  ADD_BUTTON,
  EMPTY_STATE,
  FILTER_LABELS,
  FILTER_OPTIONS,
  FILTER_WRAPPER,
  HEADER,
  ICON_WRAPPER,
  LABEL_CLASS,
  SELECT_CLASSES,
  STAT_CARD,
  STATS,
  STATS_GRID,
  TAB_ACTIVE,
  TAB_BASE,
  TAB_INACTIVE,
  TABS_WRAPPER,
  VALUE_CLASS,
  WRAPPER,
} from "../assets/dummy";
import { Calendar, FilterIcon, HomeIcon, Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import TaskItem from "../components/TaskItem";
import axios from "axios";
import { toast } from "react-toastify";
import TaskModal from "../components/TaskModal";

const API_URL = import.meta.env.VITE_API_URL;

function Dashboard() {
  const { tasks, refreshTasks } = useOutletContext();
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const stats = useMemo(
    () => ({
      total: tasks.length,
      lowPriority: tasks.filter(
        (task) => task.priority?.toLowerCase() === "low"
      ).length,
      mediumPriority: tasks.filter(
        (task) => task.priority?.toLowerCase() === "medium"
      ).length,
      highPriority: tasks.filter(
        (task) => task.priority?.toLowerCase() === "high"
      ).length,
      completedTasks: tasks.filter(
        (task) =>
          task.completed == true ||
          task.status ===
            (typeof task.completed === "string" &&
              task.completed.toLowerCase() === "yes")
      ).length,
    }),
    [tasks]
  );

  //filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      switch (filter) {
        case "today":
          return dueDate.toDateString() === today.toDateString();
        case "week":
          return dueDate >= today && dueDate <= nextWeek;
        case "nextWeek":
          return dueDate > nextWeek;
        case "high":
        case "medium":
        case "low":
          return task.priority?.toLowerCase() === filter;
        default:
          return true;
      }
    });
  }, [tasks, filter]);

  // save task
  const handleSaveTask = useCallback(
    async (taskData) => {
      try {
        if (taskData?._id) {
          await axios.put(`${API_URL}/api/v1/tasks/update/${taskData._id}`, taskData);
          refreshTasks();
          setShowModal(false);
          setSelectedTask(null);
        } else {
          await axios.post(`${API_URL}/api/v1/tasks/create`, taskData);
          refreshTasks();
          setShowModal(false);
          setSelectedTask(null);
        }
        toast.success("Task saved successfully");
      } catch (error) {
        console.error("Error saving task:", error);
        toast.error("Failed to save task");
      }
    },
    [refreshTasks]
  );

  // logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    navigate("/login");
  }, [navigate]);

  
  return (
    <div className={WRAPPER}>
      {/* HEADER */}
      <div className={HEADER}>
        <div className="min-w-0 ">
          <h2 className="text-xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <HomeIcon className="text-purple-600 w-5 h-5 md:w-6 md:h-6 shrink-0" />
            <span className="truncate">Task Overview</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1 ml-1 truncate">
            Welcome back,{" "}
            <span className="font-semibold">Manage your tasks effectively</span>
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className={ADD_BUTTON}>
          <Plus size={18} />
          Add New Task
        </button>
      </div>
      {/* STATS */}
      <div className={STATS_GRID}>
        {STATS.map(
          ({
            key,
            label,
            icon: Icon,
            iconColor,
            borderColor = "border-purple-100",
            valueKey,
            textColor,
            gradient,
          }) => (
            <div key={key} className={`${borderColor} ${STAT_CARD}`}>
              <div className="flex items-center gap-2 md:gap-2">
                <div className={`${ICON_WRAPPER} ${iconColor}`}>
                  <Icon className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="min-w-0">
                  <p
                    className={`${VALUE_CLASS} ${
                      gradient
                        ? "bg-gradient-to-r from-fuchsia-600 bg-clip-text text-transparent"
                        : textColor
                    }`}
                  >
                    {stats[valueKey]}
                  </p>
                  <p className={LABEL_CLASS}>{label}</p>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* TASKS */}
      <div className={"space-y-4"}>
        <div className={FILTER_WRAPPER}>
          <div className="flex items-center gap-2 min-w-0">
            <FilterIcon className="w-5 h-5 text-purple-600" />
            <h2 className="text-base md:text-lg font-semibold text-gray-800 truncate">
              {FILTER_LABELS[filter]}
            </h2>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={SELECT_CLASSES}
          >
            {FILTER_OPTIONS.map((option, index) => (
              <option key={index} value={option}>
                {option?.charAt(0)?.toUpperCase() + option?.slice(1)}
              </option>
            ))}
          </select>
          <div className={TABS_WRAPPER}>
            {FILTER_OPTIONS.map((option, index) => (
              <button
                key={index}
                className={`${TAB_BASE} ${
                  filter === option ? TAB_ACTIVE : TAB_INACTIVE
                } cursor-pointer`}
                onClick={() => setFilter(option)}
              >
                {option?.charAt(0)?.toUpperCase() + option?.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className={"space-y-4"}>
          {filteredTasks.length == 0 ? (
            <div className={EMPTY_STATE.wrapper}>
              <div className={EMPTY_STATE.iconWrapper}>
                <Calendar className="w-8 h-8 text-purple-500" />
              </div>
              <h2 className={"text-lg font-semibold text-gray-800 mb-2"}>
                No tasks found
              </h2>
              <p className={"text-sm text-gray-500 mb-4"}>
                {filter === "all"
                  ? "Create a new task to get started"
                  : `No ${filter} tasks found`}
              </p>
              <button
                onClick={() => setShowModal(true)}
                className={EMPTY_STATE.btn}
              >
                Add New Task
              </button>
            </div>
          ) : (
            filteredTasks?.map((task) => (
              <TaskItem
                key={task?._id || task?.id}
                task={task}
                onRefresh={refreshTasks}
                showCompleteCheckbox={true}
                onEdit={() => {
                  setShowModal(true);
                  setSelectedTask(task);
                }}
              />
            ))
          )}
        </div>
        {/* Add Task Desktop */}
        <div
          onClick={() => setShowModal(true)}
          className=" hidden md:flex items-center justify-center p-4 border-2 border-dashed border-purple-100 rounded-xl hover:border-purple-400 bg-purple-50/50 cursor-pointer transition-colors"
        >
          <Plus size={24} className="h-5 w-5text-purple-600 mr-2" />
          <span className="text-gray-600 font-medium">Add New Task</span>
        </div>
      </div>
      {/* Modal */}
      <TaskModal
        isOpen={showModal || !!selectedTask}
        onClose={() => {
          setShowModal(false);
          setSelectedTask(null);
        }}
        taskToEdit={selectedTask}
        onSave={handleSaveTask}
        onLogout={handleLogout}
      />
    </div>
  );
}

export default Dashboard;

