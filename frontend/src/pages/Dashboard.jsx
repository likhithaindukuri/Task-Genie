import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks } from "../services/taskService";
import dashboardIcon from "../assets/dashboard.png";
import tasksIcon from "../assets/tasks.png";
import totalTasksIcon from "../assets/totaltasks.png";
import completedIcon from "../assets/completed.png";
import pendingIcon from "../assets/pending.png";
import progressIcon from "../assets/progress.png";

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      loadTasks();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "Completed").length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Get upcoming tasks (not completed, sorted by due date)
  const upcomingTasks = tasks
    .filter((task) => task.status !== "Completed")
    .sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    })
    .slice(0, 5);

  // Get recent completed tasks
  const recentCompleted = tasks
    .filter((task) => task.status === "Completed")
    .slice(0, 3);

  // Get tasks by priority (COMPLETED only)
  const highPriorityTasks = tasks.filter((task) => task.priority === "High" && task.status === "Completed").length;
  const mediumPriorityTasks = tasks.filter((task) => task.priority === "Medium" && task.status === "Completed").length;
  const lowPriorityTasks = tasks.filter((task) => task.priority === "Low" && task.status === "Completed").length;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-600 bg-red-50";
      case "Medium":
        return "text-yellow-600 bg-yellow-50";
      case "Low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Task Genie Dashboard</h1>
          <p className="text-lg text-gray-600 mb-6">Please login to view your dashboard</p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between flex-wrap gap-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <img src={dashboardIcon} alt="Dashboard" className="w-10 h-10 brightness-0 invert" />
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Dashboard
                </h1>
                <p className="text-gray-600 text-lg">Welcome back! Here's your productivity overview</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Back to Home
              </button>
              <button
                onClick={() => navigate("/tasks")}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <img src={tasksIcon} alt="Tasks" className="w-6 h-6 brightness-0 invert" />
                View All Tasks
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-xl text-gray-600">Loading your dashboard...</div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border-2 border-gray-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <img src={totalTasksIcon} alt="Total Tasks" className="w-8 h-8 brightness-0 invert" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm font-semibold mb-2 uppercase tracking-wide">Total Tasks</p>
                <p className="text-5xl font-bold text-gray-900 mb-2">{totalTasks}</p>
                <p className="text-xs text-gray-500">All your tasks</p>
              </div>

              <div className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border-2 border-gray-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <img src={completedIcon} alt="Completed" className="w-8 h-8 brightness-0 invert" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm font-semibold mb-2 uppercase tracking-wide">Completed</p>
                <p className="text-5xl font-bold text-green-600 mb-2">{completedTasks}</p>
                <p className="text-xs text-gray-500">
                  {totalTasks > 0 ? `${completionRate}% completion rate` : "No tasks yet"}
                </p>
              </div>

              <div className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border-2 border-gray-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <img src={pendingIcon} alt="Pending" className="w-8 h-8 brightness-0 invert" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm font-semibold mb-2 uppercase tracking-wide">Pending</p>
                <p className="text-5xl font-bold text-orange-600 mb-2">{pendingTasks}</p>
                <p className="text-xs text-gray-500">Tasks in progress</p>
              </div>

              <div className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border-2 border-gray-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <img src={progressIcon} alt="Progress" className="w-8 h-8 brightness-0 invert" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm font-semibold mb-2 uppercase tracking-wide">Progress</p>
                <p className="text-5xl font-bold text-purple-600 mb-4">{completionRate}%</p>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 h-3 rounded-full transition-all duration-700 shadow-lg"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Upcoming Tasks */}
              <div className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border-2 border-gray-200/50">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Upcoming Tasks</h2>
                  </div>
                  <button
                    onClick={() => navigate("/tasks")}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-all duration-200 flex items-center gap-2"
                  >
                    View all
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                {upcomingTasks.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingTasks.map((task) => (
                      <div
                        key={task.id}
                        className="group p-6 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
                        onClick={() => navigate("/tasks")}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-bold text-lg text-gray-900 flex-1 group-hover:text-blue-600 transition-colors">{task.title}</h3>
                          <span
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 shadow-sm ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>
                        </div>
                        {task.description && (
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{task.description}</p>
                        )}
                        <div className="flex items-center justify-between text-sm">
                          <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg font-medium">{task.category || "Uncategorized"}</span>
                          <span className="font-semibold text-gray-700 flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(task.dueDate)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-600 mb-2 font-semibold text-lg">No upcoming tasks</p>
                    <p className="text-gray-500 mb-6">Start by creating your first task!</p>
                    <button
                      onClick={() => navigate("/tasks")}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      Create Your First Task
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Stats & Priority */}
              <div className="space-y-6">
                {/* Priority Breakdown */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border-2 border-gray-200/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Completed by Priority</h2>
                  </div>
                  <div className="space-y-5">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-100/50 rounded-2xl border-2 border-red-200/50">
                      <div className="flex items-center gap-4">
                        <div className="w-4 h-4 rounded-full bg-red-500 shadow-lg"></div>
                        <span className="text-base font-bold text-gray-900">High</span>
                      </div>
                      <span className="text-2xl font-bold text-red-600">{highPriorityTasks}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-amber-100/50 rounded-2xl border-2 border-yellow-200/50">
                      <div className="flex items-center gap-4">
                        <div className="w-4 h-4 rounded-full bg-yellow-500 shadow-lg"></div>
                        <span className="text-base font-bold text-gray-900">Medium</span>
                      </div>
                      <span className="text-2xl font-bold text-yellow-600">{mediumPriorityTasks}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-100/50 rounded-2xl border-2 border-green-200/50">
                      <div className="flex items-center gap-4">
                        <div className="w-4 h-4 rounded-full bg-green-500 shadow-lg"></div>
                        <span className="text-base font-bold text-gray-900">Low</span>
                      </div>
                      <span className="text-2xl font-bold text-green-600">{lowPriorityTasks}</span>
                    </div>
                  </div>
                </div>

                {/* Recent Completed */}
                {recentCompleted.length > 0 && (
                  <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border-2 border-gray-200/50">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Recently Completed</h2>
                    </div>
                    <div className="space-y-3">
                      {recentCompleted.map((task) => (
                        <div key={task.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200/50 hover:shadow-md transition-all duration-200">
                          <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg"></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 line-clamp-1">{task.title}</p>
                            <p className="text-xs text-gray-600 mt-1">{task.category || "Uncategorized"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Action */}
                <button
                  onClick={() => navigate("/tasks")}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
