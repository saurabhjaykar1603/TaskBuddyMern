import React, { useMemo, useState } from "react";
import { CT_CLASSES, layoutClasses, SORT_OPTIONS } from "../assets/dummy";
import { Clock, Filter, ListCheck, Plus } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import TaskItem from "../components/TaskItem";
import TaskModal from "../components/TaskModal";


function PendingPage() {
  const { tasks = [], refreshTasks } = useOutletContext();

  const [sortBy, setSortBy] = useState("newest");
  const [selectedTasks, setSelectedTasks] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // const authHeader = useCallback(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token) return null;
  //   return {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${token}`,
  //   };
  // }, []);

  const sortedPendingTasks = useMemo(() => {
    const filtered = tasks.filter(
      (t) =>
        !t.completed ||
        (typeof t.completed === "string" && t.completed.toLowerCase() === "no")
    );

    return filtered.sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);

      const order = { high: 3, medium: 2, low: 1 };
      return order[b.priority.toLowerCase()] - order[a.priority.toLowerCase()];
    });
  }, [tasks, sortBy]);

  return (
    <div className={`${layoutClasses.container}`}>
      <div className={`${layoutClasses.headerWrapper}`}>
        <div>
          <h1
            className={`text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2`}
          >
            <ListCheck className="w-6 h-6 text-purple-500" />
            Pending tasks
          </h1>
          <p className="text-gray-500 text-sm mt-1 ml-7 ">
            {sortedPendingTasks.length} task
            {sortedPendingTasks.length !== 1 && "s"} needing your attention
          </p>
        </div>

        <div className={`${CT_CLASSES.sortContainer}`}>
          <div className={`${CT_CLASSES.sortBox}`}>
            <div className={`${CT_CLASSES.filterLabel}`}>
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <Filter className="w-4 h-4 text-purple-500" />
          <span className="text-sm">Sort by :</span>
          <select
            name=""
            id=""
            value={sortBy}
            className={`${layoutClasses.select}`}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="priority">By Priority</option>
          </select>

          <div className={`${layoutClasses.tabWrapper}`}>
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.id}
                className={`${layoutClasses.tabButton(sortBy === option.id)} `}
                onClick={() => setSortBy(option.id)}
              >
                {option.icon} {option.label}
              </button>
            ))}
          </div>
        </div>
        </div>
        </div>
        </div>
      </div>

      <div
        className={`${layoutClasses.addBox}`}
        onClick={() => setShowModal(true)}
      >
        <div className="flex items-center gap-2 justify-center text-gray-500 group-hover:text-purple-600 transition-colors">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md group-hover:shadow-md transition-all duration-200">
            <Plus className="text-purple-500" size={18} />
          </div>
          <span className=" font-medium">Add Task</span>
        </div>
      </div>

      <div className="space-y-4">
        {sortedPendingTasks.length === 0 ? (
          <div className={layoutClasses.emptyState}>
            <div className="max-w-xs mx-auto py-6">
              <div className={layoutClasses.emptyIconBg}>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                All caught up!
              </h3>
              <p className="text-gray-500 mb-4 text-sm">
                You have no pending tasks at the moment - great job!
              </p>
              <button
                className={`${layoutClasses.emptyBtn} flex items-center justify-center mx-auto`}
                onClick={() => setShowModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create new task
              </button>
            </div>
          </div>
        ) : (
          <>
            {sortedPendingTasks.map((task) => (
              <TaskItem
                key={task.id || task._id}
                task={task}
                // onDelete={() => {
                //   handleDelete(task.id || task._id);
                // }}
                showCompleteCheckbox
                // onToggleComplete={() => {
                //   handleToggleComplete(task.id || task._id, task.completed);
                // }}
                onEdit={() => {
                  setSelectedTasks(task);
                  setShowModal(true);
                }}
                onRefresh={refreshTasks}
              />
            ))}
          </>
        )}
      </div>
      <TaskModal
        isOpen={!!selectedTasks || showModal}
        onClose={() => {
          setSelectedTasks(null);
          setShowModal(false);
          refreshTasks();
        }}
        taskToEdit={selectedTasks}
      />
    </div>
  );
}

export default PendingPage;
