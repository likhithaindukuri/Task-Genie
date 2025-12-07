import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addTask, deleteTask, getTasks, updateTask } from "../services/taskService";
import { generateDescription, parseTaskFromNaturalLanguage } from "../services/aiService";
import { getUserIdFromToken } from "../utils/jwt";
import tasksIcon from "../assets/tasks.png";
import aiRobot from "../assets/ai-robot.png";

export default function Tasks() {
  const navigate = useNavigate();
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
  const [naturalLanguageInput, setNaturalLanguageInput] = useState("");
  const [isParsingTask, setIsParsingTask] = useState(false);
  const [showNaturalLanguageInput, setShowNaturalLanguageInput] = useState(false);

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

  const handleParseNaturalLanguage = async () => {
    if (!naturalLanguageInput.trim()) {
      alert("Please enter a task description in natural language");
      return;
    }
    if (!token) {
      alert("You must be logged in to use this feature.");
      return;
    }
    setIsParsingTask(true);
    try {
      // Verify token exists before making request
      const currentToken = localStorage.getItem("token");
      if (!currentToken) {
        alert("Session expired. Please login again.");
        navigate("/login");
        return;
      }
      const aiResponse = await parseTaskFromNaturalLanguage(naturalLanguageInput);

      // Try to parse JSON from AI response
      let parsedData;
      try {
        // Clean the response - remove markdown code blocks if present
        let cleanResponse = aiResponse.trim();
        cleanResponse = cleanResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

        // Extract JSON from response (might have extra text)
        const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedData = JSON.parse(jsonMatch[0]);
        } else {
          console.error("AI Response (no JSON found):", aiResponse);
          alert("AI response was not valid JSON. Please try again with a clearer description.\n\nResponse: " + aiResponse.substring(0, 200));
          return;
        }
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError);
        console.error("AI Response:", aiResponse);
        alert("AI response was not valid JSON. Please try again or refine your input.\n\nError: " + jsonError.message + "\n\nResponse: " + aiResponse.substring(0, 200));
        return;
      }

      // Validate required fields - if no title, try to create one from description or input
      if (!parsedData.title || !parsedData.title.trim()) {
        // Try to extract title from description or use first few words of input
        if (parsedData.description) {
          const firstLine = parsedData.description.split('\n')[0];
          parsedData.title = firstLine.replace(/^\d+\.\s*/, "").substring(0, 50).trim() || "New Task";
        } else {
          // Use first few words from original input as title
          const words = naturalLanguageInput.trim().split(/\s+/).slice(0, 5).join(" ");
          parsedData.title = words || "New Task";
        }
        console.warn("Title was missing, generated:", parsedData.title);
      }

      // Format and validate date if present
      let formattedDueDate = parsedData.dueDate;
      if (parsedData.dueDate && parsedData.dueDate !== "null" && parsedData.dueDate !== null) {
        try {
          const date = new Date(parsedData.dueDate);
          if (!isNaN(date.getTime())) {
            formattedDueDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
          } else {
            formattedDueDate = null; // Invalid date
          }
        } catch {
          formattedDueDate = null;
        }
      } else {
        formattedDueDate = null;
      }

      // Validate and normalize priority
      let priority = parsedData.priority || "Medium";
      const priorityUpper = priority.trim().charAt(0).toUpperCase() + priority.trim().slice(1).toLowerCase();
      if (priorityUpper === "High" || priorityUpper === "Medium" || priorityUpper === "Low") {
        priority = priorityUpper;
      } else {
        // Try to infer from title/description
        const textToCheck = (parsedData.title + " " + (parsedData.description || "")).toLowerCase();
        if (textToCheck.match(/\b(urgent|asap|important|critical|emergency|must do|high priority|top priority|immediately|now|today|rush|pressing)\b/)) {
          priority = "High";
        } else if (textToCheck.match(/\b(low priority|optional|whenever|later|not urgent|can wait|someday|no rush)\b/)) {
          priority = "Low";
        } else {
          priority = "Medium";
        }
      }

      // Validate and normalize category
      let category = parsedData.category || "Others";
      const categoryOptions = ["Work", "Personal", "Health", "Education", "Others"];
      if (!categoryOptions.includes(category)) {
        // Try to infer from title/description
        const textToCheck = (parsedData.title + " " + (parsedData.description || "")).toLowerCase();
        if (textToCheck.match(/\b(work|business|meeting|project|office|job|professional|client|team|deadline|presentation|conference)\b/)) {
          category = "Work";
        } else if (textToCheck.match(/\b(personal|family|friends|home|household|shopping|personal care|vacation|trip)\b/)) {
          category = "Personal";
        } else if (textToCheck.match(/\b(health|fitness|doctor|medical|exercise|gym|workout|appointment|checkup|hospital)\b/)) {
          category = "Health";
        } else if (textToCheck.match(/\b(study|learn|course|class|exam|homework|assignment|school|university|education|research)\b/)) {
          category = "Education";
        } else {
          category = "Others";
        }
      }

      // Prepare task data with validated values
      const taskData = {
        title: parsedData.title.trim(),
        description: parsedData.description || "No description provided",
        category: category,
        priority: priority,
        status: parsedData.status || "Pending",
        dueDate: formattedDueDate,
      };

      // Automatically create the task
      await addTask(taskData);
      alert("Task created successfully from your natural language input!");
      
      // Clear the input and hide the section
      setNaturalLanguageInput("");
      setShowNaturalLanguageInput(false);
      
      // Reload tasks to show the new one
      await loadTasks();
      
    } catch (err) {
      console.error("Error parsing task:", err);
      const errorMessage = err.response?.data?.message || err.message || "Unknown error";
      if (err.response?.status === 401) {
        const currentToken = localStorage.getItem("token");
        if (!currentToken) {
          alert("Please login to use this feature.");
          navigate("/login");
        } else {
          alert("Session expired. Please login again.");
          localStorage.removeItem("token");
          navigate("/login");
        }
      } else {
        alert("Error creating task: " + errorMessage);
      }
    } finally {
      setIsParsingTask(false);
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
        navigate("/login");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between flex-wrap gap-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <img src={tasksIcon} alt="Tasks" className="w-10 h-10 brightness-0 invert" />
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Your Tasks
                </h1>
                <p className="text-gray-600 text-lg">Organize your life, one task at a time</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </button>
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
                className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {showForm ? "Cancel" : "New Task"}
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Tasks</p>
                  <p className="text-3xl font-bold text-gray-900">{tasks.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-orange-600">{tasks.filter(t => t.status === "Pending").length}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{tasks.filter(t => t.status === "Completed").length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Natural Language Input */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border-2 border-gray-200/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <img src={aiRobot} alt="AI" className="w-6 h-6 brightness-0 invert" />
                </div>
                Create Task with Natural Language
              </h2>
              <button
                onClick={() => setShowNaturalLanguageInput(!showNaturalLanguageInput)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition text-sm"
              >
                {showNaturalLanguageInput ? "Hide" : "Show"}
              </button>
            </div>
            {showNaturalLanguageInput && (
              <>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded-r-lg">
                  <p className="text-sm text-gray-700">
                    <strong className="text-blue-700">How it works:</strong> Just describe your task in plain English, and our AI will automatically extract the title, deadline, priority, and category. The task will be created instantly!
                  </p>
                </div>
                <p className="text-gray-600 mb-2 font-medium">Examples:</p>
                <ul className="text-sm text-gray-600 mb-4 space-y-1 list-disc list-inside">
                  <li>"Call Sarah tomorrow at 3pm about the project - urgent"</li>
                  <li>"Doctor appointment next Monday, high priority"</li>
                  <li>"Study for math exam on Friday"</li>
                  <li>"Buy groceries this weekend, low priority"</li>
                </ul>
                <textarea
                  value={naturalLanguageInput}
                  onChange={(e) => setNaturalLanguageInput(e.target.value)}
                  placeholder="e.g., 'Plan a team meeting for next Tuesday, high priority, discuss Q3 strategy.'"
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white resize-none mb-4"
                ></textarea>
                <button
                  onClick={handleParseNaturalLanguage}
                  disabled={isParsingTask || !naturalLanguageInput.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                >
                  {isParsingTask ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Parsing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Create Task
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-3 flex-wrap">
            {["All", "Pending", "Completed"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  filterStatus === status
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                    : "bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-md"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Add/Edit Task Form */}
        {showForm && (
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 mb-10 border-2 border-gray-200/50">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {editingTask ? "Edit Task" : "Create New Task"}
              </h2>
            </div>
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
        <div className="space-y-5">
          {filteredTasks.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-16 text-center border-2 border-gray-200/50">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {filterStatus === "All" ? "No tasks yet" : `No ${filterStatus.toLowerCase()} tasks`}
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                {filterStatus === "All"
                  ? "Start organizing your life by creating your first task!"
                  : `Try switching to a different filter or create a new task.`}
              </p>
              {filterStatus === "All" && (
                <button
                  onClick={() => {
                    setShowForm(true);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  + Create Your First Task
                </button>
              )}
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`group bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-6 border-2 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
                  task.status === "Completed" 
                    ? "opacity-70 border-gray-200" 
                    : isOverdue(task.dueDate) 
                    ? "border-red-300 bg-gradient-to-br from-red-50/50 to-white" 
                    : "border-gray-200/50 hover:border-blue-300"
                }`}
              >
                <div className="flex items-start gap-5">
                  {/* Checkbox with custom styling */}
                  <div className="relative mt-1">
                    <input
                      type="checkbox"
                      checked={task.status === "Completed"}
                      onChange={() => handleToggleComplete(task)}
                      className="w-7 h-7 cursor-pointer rounded-lg border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                    />
                  </div>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="mb-4">
                      <h3
                        className={`text-2xl font-bold mb-3 transition-all ${
                          task.status === "Completed"
                            ? "line-through text-gray-400"
                            : "text-gray-900 group-hover:text-blue-600"
                        }`}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <div
                          className={`text-sm leading-relaxed whitespace-pre-wrap mb-4 ${
                            task.status === "Completed"
                              ? "line-through text-gray-400"
                              : "text-gray-600"
                          }`}
                        >
                          {task.description}
                        </div>
                      )}
                    </div>

                    {/* Tags and Metadata */}
                    <div className="flex flex-wrap items-center gap-3 mb-5">
                      <span
                        className={`px-4 py-2 rounded-xl text-sm font-bold border-2 shadow-sm ${getCategoryColor(
                          task.category
                        )}`}
                      >
                        {task.category || "Uncategorized"}
                      </span>
                      <span
                        className={`px-4 py-2 rounded-xl text-sm font-bold border-2 shadow-sm ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority || "Medium"}
                      </span>
                      <span
                        className={`px-4 py-2 rounded-xl text-sm font-bold border-2 shadow-sm ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {task.status || "Pending"}
                      </span>
                      {task.dueDate && (
                        <span
                          className={`px-4 py-2 rounded-xl text-sm font-bold border-2 shadow-sm ${
                            isOverdue(task.dueDate) && task.status !== "Completed"
                              ? "bg-red-100 text-red-700 border-red-300"
                              : "bg-gray-100 text-gray-700 border-gray-300"
                          }`}
                        >
                          <span className="mr-2">📅</span>
                          {formatDate(task.dueDate)}
                          {isOverdue(task.dueDate) && task.status !== "Completed" && (
                            <span className="ml-2 font-extrabold">⚠️ Overdue</span>
                          )}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(task)}
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-xl font-semibold hover:from-blue-100 hover:to-blue-200 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="px-6 py-2.5 bg-gradient-to-r from-red-50 to-red-100 text-red-700 rounded-xl font-semibold hover:from-red-100 hover:to-red-200 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
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
