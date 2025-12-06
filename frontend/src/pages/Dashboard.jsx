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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <img src={dashboardIcon} alt="Dashboard" className="w-10 h-10" />
              Dashboard
            </h1>
            <p className="text-gray-600">Welcome back! Here's your productivity overview</p>
          </div>
          <button
            onClick={() => navigate("/tasks")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition duration-300 flex items-center gap-2"
          >
            <img src={tasksIcon} alt="Tasks" className="w-5 h-5" />
            View All Tasks
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-xl text-gray-600">Loading your dashboard...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <img src={totalTasksIcon} alt="Total Tasks" className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Tasks</p>
                <p className="text-4xl font-bold text-gray-900">{totalTasks}</p>
                <p className="text-xs text-gray-500 mt-2">All your tasks</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <img src={completedIcon} alt="Completed" className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm font-medium mb-1">Completed</p>
                <p className="text-4xl font-bold text-green-600">{completedTasks}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {totalTasks > 0 ? `${completionRate}% completion rate` : "No tasks yet"}
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <img src={pendingIcon} alt="Pending" className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm font-medium mb-1">Pending</p>
                <p className="text-4xl font-bold text-orange-600">{pendingTasks}</p>
                <p className="text-xs text-gray-500 mt-2">Tasks in progress</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <img src={progressIcon} alt="Progress" className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm font-medium mb-1">Progress</p>
                <p className="text-4xl font-bold text-purple-600">{completionRate}%</p>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Upcoming Tasks */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Upcoming Tasks</h2>
                  <button
                    onClick={() => navigate("/tasks")}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View all →
                  </button>
                </div>
                {upcomingTasks.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all duration-200 cursor-pointer"
                        onClick={() => navigate("/tasks")}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 flex-1">{task.title}</h3>
                          <span
                            className={`px-2 py-1 rounded-lg text-xs font-medium ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>
                        </div>
                        {task.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                        )}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{task.category || "Uncategorized"}</span>
                          <span className="font-medium">{formatDate(task.dueDate)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No upcoming tasks</p>
                    <button
                      onClick={() => navigate("/tasks")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                    >
                      Create Your First Task
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Stats & Priority */}
              <div className="space-y-6">
                {/* Priority Breakdown */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Completed by Priority</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-sm font-medium text-gray-700">High</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">{highPriorityTasks}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span className="text-sm font-medium text-gray-700">Medium</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">{mediumPriorityTasks}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm font-medium text-gray-700">Low</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">{lowPriorityTasks}</span>
                    </div>
                  </div>
                </div>

                {/* Recent Completed */}
                {recentCompleted.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Recently Completed</h2>
                    <div className="space-y-3">
                      {recentCompleted.map((task) => (
                        <div key={task.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">{task.title}</p>
                            <p className="text-xs text-gray-500">{task.category || "Uncategorized"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Action */}
                <button
                  onClick={() => navigate("/tasks")}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition duration-300"
                >
                  + Add New Task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
