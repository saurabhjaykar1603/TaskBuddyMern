import React, { useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import {
  TrendingUp,
  CheckCircle,
  Clock,
  Percent,
  Circle,
  Zap,
} from "lucide-react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";

function Layout({ user = {}, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/tasks/get`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const arr = Array.isArray(data)
        ? data
        : Array.from(data.tasks)
          ? data.tasks
          : Array.isArray(data.data)
            ? data.data
            : [];
      setTasks(arr);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.message || "Failed to fetch tasks");
      if (error.response?.status === 401) {
        onLogout();
      }
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const stats = useMemo(() => {
    const completedTasks = tasks.filter(
      (t) =>
        t.completed === true ||
        t.completed === 1 ||
        (typeof t.completed === "string" && t.completed.toLowerCase() === "yes")
    ).length;

    const totalCount = tasks.length;
    const pendingTasks = totalCount - completedTasks;
    const completionPercentage =
      Math.round((completedTasks / totalCount) * 100) || 0;
    return {
      totalCount,
      completedTasks,
      pendingTasks,
      completionPercentage,
    };
  }, [tasks]);

  // loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center ">
        <div className="animate-spin rounded-full h-12 w-12  border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-red-500 text-center bg-red-50 p-4 rounded-xl border border-red-100 max-w-md">
          <p className="font-medium mb-2">Error Loading tasks</p>
          <p className="text-sm">Error: {error}</p>
          <button
            onClick={fetchTasks}
            className="mt-4 py-2 px-4 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon }) => (
    <div className="p-2 sm:p-3 rounded-xl bg-white shadow-sm border border-purple-100 hover:shadow-md transition-all duration-300 hover:border-purple-100 group">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-gradient-to-br from-fuchsia-500/10 to-purple-500/10 group-hover:from-fuchsia-500/20 group-hover:to-purple-500/20">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-fuchsia-500 to-purple-600 bg-clip-text text-transparent">
            {value}
          </p>
          <p className="text-xs text-gray-500 font-medium">{title}</p>
        </div>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />
      <Sidebar user={user} tasks={tasks} />

      <div className="ml-0 xs:ml-64 lg:ml-64 md:ml-16 p-3 sm:p-4 md:p-4  transition-all duration-300">
        <div className="grid grid-cols-1 xs:grid-cols-3 gap-4 sm:gap-6">
          <div className="xl:col-span-2 space-y-3 sm:space-y-4">
            <Outlet context={{ tasks, refetchTasks: fetchTasks }} />
          </div>
          <div className="xl:col-span-1 space-y-4 sm:space-y-6 ">
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-purple-100">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                Task Statistics
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:mb-6">
                <StatCard
                  title="Total Tasks"
                  value={stats.totalCount}
                  icon={
                    <Circle className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-purple-500" />
                  }
                />
                <StatCard
                  title="Completed Tasks"
                  value={stats.completedTasks}
                  icon={
                    <CheckCircle className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-green-500" />
                  }
                />
                <StatCard
                  title="Pending Tasks"
                  value={stats.pendingTasks}
                  icon={
                    <Clock className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-fuchsia-500" />
                  }
                />
                <StatCard
                  title="Completion Rate"
                  value={`${stats.completionPercentage}%`}
                  icon={
                    <Percent className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                  }
                />
              </div>
              <hr className="my-3 sm:my-4 border-purple-100" />
              <div className="flex items-center justify-between text-gray-700">
                <span className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
                  <Circle className="w-2.5 h-2.5 sm:w-5 sm:h-5 text-purple-500 fill-purple-500" />
                  Tasks Progress
                </span>
                <span className="text-xs  bg-purple-100 text-purple-700 px-1.5 py-0.5 sm:px-2  rounded-full">
                  {stats.completedTasks} / {stats.totalCount}
                </span>
              </div>
              <div className="relative pt-1 ">
                <div className=" flex gap-1.5 item-center">
                  <div className="flex-1 h-2 sm:h-3 bg-purple-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${stats.completionPercentage}%` }}
                      className=" h-full bg-gradient-to-r from-fuchsia-500 to-purple-600 transition-all duration-500"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-purple-100">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                Recent Tasks
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {tasks.slice(0, 3).map((task) => (
                  <div
                    key={task._id}
                    className="flex items-center justify-between p-2 sm:p-3 border-b hover:bg-purple-50/50 transition-colors duration-300 rounded-lg border border-transparent hover:border-purple-100 "
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm  font-medium text-gray-700 break-words whitespace-normal">
                        {task?.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {task?.createdAt
                          ? new Date(task.createdAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full shrink-0 ml-2 ${task?.completed
                          ? "bg-green-100 text-green-700"
                          : "bg-fuchsia-100 text-fuchsia-700"
                        }`}
                    >
                      {task?.completed ? "Done" : "Pending"}
                    </span>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto sm:mv-4 rounded-full bg-purple-100 flex items-center justify-center">
                      <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
                    </div>
                    <p className="text-sm text-gray-500">No recent tasks</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Tasks will appear here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
