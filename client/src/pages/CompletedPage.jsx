import React, { useMemo, useState } from "react";
import { CT_CLASSES, SORT_OPTIONS } from "../assets/dummy";
import { useOutletContext } from "react-router-dom";
import { CalendarCheck, Check, CheckCircle, Filter } from "lucide-react";
import TaskItem from "../components/TaskItem";

export default function CompletedPage() {
  const { tasks = [], refetchTasks } = useOutletContext();
  const [sortBy, setSortBy] = useState("newest");

  const sortedCompletedTasks = useMemo(() => {
    return tasks
      .filter((task) =>
        [true, 1, "yes"].includes(
          typeof task.completed === "string"
            ? task.completed.toLowerCase()
            : task.completed
        )
      )
      .sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b.createdAt) - new Date(a.createdAt);
          case "oldest":
            return new Date(a.createdAt) - new Date(b.createdAt);
          case "priority": {
            const order = {
              high: 3,
              medium: 2,
              low: 1,
            };
            return (
              order[b.priority?.toLowerCase()] -
              order[a.priority?.toLowerCase()]
            );
          }
          default:
            return 0;
        }
      });
  }, [tasks, sortBy]);

  return (
    <div className={`${CT_CLASSES.page}`}>
      {/* header */}
      <div className={`${CT_CLASSES.header}`}>
        <div className={`${CT_CLASSES.titleWrapper}`}>
          <h1 className={`${CT_CLASSES.title}`}>
            <CheckCircle className="w-6 h-6 text-purple-500 md:w-6 md:h-6" />
            <span className="truncate">Complete Task</span>
          </h1>
          <p className={`${CT_CLASSES.subtitle}`}>
            {sortedCompletedTasks.length} task
            {sortedCompletedTasks.length !== 1 && "s"} marked as completed
          </p>
        </div>
        {/* Sort Control */}
        <div className={`${CT_CLASSES.sortContainer}`}>
          <div className={`${CT_CLASSES.sortBox}`}>
            <div className={`${CT_CLASSES.filterLabel}`}>
              <Filter className="w-4 h-4 text-purple-500" />
              <span className="text-xs md:text-sm">Sort by :</span>
            </div>
            {/* MOBILE DROPDOWN */}
            <select
              name=""
              id=""
              value={sortBy}
              className={`${CT_CLASSES.select}`}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                  {option.id === "newest" ? "First" : ""}
                </option>
              ))}
            </select>
            {/* DESKTOP DROPDOWN */}
            <div className={`${CT_CLASSES.btnGroup}`}>
              {SORT_OPTIONS.map((option) => (
                <button
                  onClick={() => setSortBy(option.id)}
                  key={option.id}
                  className={[
                    CT_CLASSES.btnBase,
                    sortBy === option.id
                      ? CT_CLASSES.btnActive
                      : CT_CLASSES.btnInactive,
                  ].join(" ")}
                >
                  {option.icon}
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/*Task List */}
      <div className={`${CT_CLASSES.list}`}>
        {sortedCompletedTasks.length === 0 ? (
          <div className={`${CT_CLASSES.emptyState}`}>
            <div className={CT_CLASSES.emptyIconWrapper}>
              <CalendarCheck className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />
            </div>
            <h3 className={`${CT_CLASSES.emptyTitle}`}>
              No completed tasks found
            </h3>
            <p className={`${CT_CLASSES.emptyText}`}>
              You haven't completed any tasks yet.
            </p>
          </div>
        ) : (
          sortedCompletedTasks.map((task) => (
            <TaskItem
              key={task.id || task._id}
              task={task}
              onRefresh={refetchTasks}
              showCompleteCheckbox={false}
              className="opacity-90 hover:opacity-100 transition-opacity text-sm md:text-base"
            />
          ))
        )}
      </div>
    </div>
  );
}
