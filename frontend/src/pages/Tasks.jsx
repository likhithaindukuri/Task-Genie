import { useEffect, useState } from "react";
import { addTask, deleteTask, getTasks, updateTask } from "../services/taskService";
import { generateDescription } from "../services/aiService";
import { getUserIdFromToken } from "../utils/jwt";
import tasksIcon from "../assets/tasks.png";
import aiRobot from "../assets/ai-robot.png";

export default function Tasks() {
  const [showForm, setShowForm] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    dueDate: "",
    priority: "",
    status: "Pending",
  });
  const [editingTask, setEditingTask] = useState(null);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      loadTasks();
    }
  }, [token]);

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      alert("Error loading tasks: " + (err.response?.data?.message || err.message));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerateDescription = async () => {
    if (!formData.title.trim()) {
      alert("Please enter a task title first");
      return;
    }
    setIsGeneratingDescription(true);
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        alert("Please login again");
        return;
      }
      const aiDescription = await generateDescription(userId, formData.title);
      let formattedDescription = aiDescription;
      
      formattedDescription = formattedDescription
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/__/g, "")
        .replace(/#{1,6}\s/g, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
      
      const lines = formattedDescription
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0 && !line.match(/^[^\d]*$/));
      
      const mainPoints = [];
      for (const line of lines) {
        const topLevelMatch = line.match(/^(\d+)\.\s*(.+)$/);
        if (topLevelMatch) {
          const pointNum = parseInt(topLevelMatch[1]);
          const pointText = topLevelMatch[2].trim();
          if (pointNum >= 1 && pointNum <= 6 && !line.match(/^\d+\.\d+/)) {
            mainPoints.push(`${pointNum}. ${pointText}`);
          }
        }
      }
      
      if (mainPoints.length > 0) {
        formattedDescription = mainPoints.join("\n");
      } else {
        const cleanLines = lines
          .filter((line) => {
            return !line.match(/^[A-Z][^.!?]*$/);
          })
          .slice(0, 6);
        
        formattedDescription = cleanLines
          .map((line, index) => {
            const cleanLine = line.replace(/^[\d.\-•*]\s*/, "").trim();
            return `${index + 1}. ${cleanLine}`;
          })
          .join("\n");
      }
      
      setFormData({ ...formData, description: formattedDescription });
    } catch (err) {
      alert("Error generating description: " + (err.response?.data?.message || err.message));
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      alert("Please enter a task title");
      return;
    }
    if (!formData.description.trim()) {
      alert("Please enter a task description");
      return;
    }
    if (!formData.category) {
      alert("Please select a category");
      return;
    }
    if (!formData.priority) {
      alert("Please select a priority");
      return;
    }
    if (!formData.dueDate) {
      alert("Please select a due date");
      return;
    }
    
    try {
      if (editingTask) {
        await updateTask(editingTask.id, formData);
        alert("Task updated successfully!");
      } else {
        await addTask(formData);
        alert("Task added successfully!");
      }
      setFormData({
        title: "",
        description: "",
        category: "",
        dueDate: "",
        priority: "",
        status: "Pending",
      });
      setShowForm(false);
      setEditingTask(null);
      loadTasks();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Unknown error";
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/";
      } else {
        alert("Error: " + errorMessage);
      }
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title || "",
      description: task.description || "",
      category: task.category || "",
      dueDate: task.dueDate || "",
      priority: task.priority || "",
      status: task.status || "Pending",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleComplete = async (task) => {
    try {
      const newStatus = task.status === "Completed" ? "Pending" : "Completed";
      await updateTask(task.id, {
        ...task,
        status: newStatus,
      });
      loadTasks();
    } catch (err) {
      alert("Error updating task: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);
        alert("Task deleted successfully!");
        loadTasks();
      } catch (err) {
        alert("Error deleting task: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTask(null);
    setFormData({
      title: "",
      description: "",
      category: "",
      dueDate: "",
      priority: "",
      status: "Pending",
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-orange-100 text-orange-700 border-orange-200";
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Work: "bg-blue-100 text-blue-700 border-blue-200",
      Personal: "bg-purple-100 text-purple-700 border-purple-200",
      Health: "bg-pink-100 text-pink-700 border-pink-200",
      Education: "bg-indigo-100 text-indigo-700 border-indigo-200",
      Others: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return colors[category] || colors.Others;
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
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  };

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === "All") return true;
    return task.status === filterStatus;
  });

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Please login to view tasks</h1>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
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
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <img src={tasksIcon} alt="Tasks" className="w-10 h-10" />
              Your Tasks
            </h1>
            <p className="text-gray-600">Manage and organize all your tasks in one place</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingTask(null);
              setFormData({
                title: "",
                description: "",
                category: "",
                dueDate: "",
                priority: "",
                status: "Pending",
              });
              if (!showForm) {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition duration-300"
          >
            {showForm ? "Cancel" : "+ Add New Task"}
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {["All", "Pending", "In Progress", "Completed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === status
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Add/Edit Task Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingTask ? "Edit Task" : "Create New Task"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter task title"
                    value={formData.title}
                    onChange={handleChange}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleGenerateDescription}
                    disabled={isGeneratingDescription || !formData.title.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center gap-2 whitespace-nowrap"
                  >
                    <img src={aiRobot} alt="AI" className="w-5 h-5" />
                    {isGeneratingDescription ? "Generating..." : "AI Generate"}
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  placeholder="Enter task description (or use AI to generate)"
                  value={formData.description}
                  onChange={handleChange}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white resize-none"
                  style={{ whiteSpace: "pre-wrap" }}
                  required
                />
              </div>

              {/* Category, Priority, Due Date Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Health">Health</option>
                    <option value="Education">Education</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                    required
                  >
                    <option value="">Select Priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                    required
                  />
                </div>
              </div>

              {/* Status (only when editing) */}
              {editingTask && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition duration-300"
                >
                  {editingTask ? "Update Task" : "Create Task"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-xl font-semibold text-gray-900 mb-2">
                {filterStatus === "All" ? "No tasks yet" : `No ${filterStatus.toLowerCase()} tasks`}
              </p>
              <p className="text-gray-600 mb-6">
                {filterStatus === "All"
                  ? "Create your first task to get started!"
                  : `Try switching to a different filter or create a new task.`}
              </p>
              {filterStatus === "All" && (
                <button
                  onClick={() => {
                    setShowForm(true);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
                >
                  + Create Your First Task
                </button>
              )}
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200 ${
                  task.status === "Completed" ? "opacity-75" : ""
                } ${isOverdue(task.dueDate) && task.status !== "Completed" ? "border-red-300 bg-red-50/30" : ""}`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={task.status === "Completed"}
                    onChange={() => handleToggleComplete(task)}
                    className="w-6 h-6 mt-1 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />

                  {/* Task Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3
                          className={`text-xl font-bold mb-2 ${
                            task.status === "Completed"
                              ? "line-through text-gray-500"
                              : "text-gray-900"
                          }`}
                        >
                          {task.title}
                        </h3>
                        {task.description && (
                          <div
                            className={`text-sm mb-4 whitespace-pre-wrap ${
                              task.status === "Completed"
                                ? "line-through text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            {task.description}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tags and Metadata */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getCategoryColor(
                          task.category
                        )}`}
                      >
                        {task.category || "Uncategorized"}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority || "Medium"}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {task.status || "Pending"}
                      </span>
                      {task.dueDate && (
                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                            isOverdue(task.dueDate) && task.status !== "Completed"
                              ? "bg-red-100 text-red-700 border border-red-200"
                              : "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}
                        >
                          📅 {formatDate(task.dueDate)}
                          {isOverdue(task.dueDate) && task.status !== "Completed" && " (Overdue)"}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(task)}
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
