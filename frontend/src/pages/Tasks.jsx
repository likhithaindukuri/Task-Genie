import { useEffect, useState } from "react";
import { addTask, deleteTask, getTasks, updateTask } from "../services/taskService";

export default function Tasks() {
  const [showForm, setShowForm] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Work",
    dueDate: "",
    priority: "Medium",
    status: "Pending",
  });
  const [editingTask, setEditingTask] = useState(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      loadTasks();
    }
  }, [userId]);

  const loadTasks = async () => {
    try {
      const data = await getTasks(userId);
      setTasks(data);
    } catch (err) {
      alert("Error loading tasks: " + (err.response?.data?.message || err.message));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await updateTask(editingTask.id, formData);
        alert("Task updated successfully!");
      } else {
        await addTask(userId, formData);
        alert("Task added successfully!");
      }
      setFormData({
        title: "",
        description: "",
        category: "Work",
        dueDate: "",
        priority: "Medium",
        status: "Pending",
      });
      setShowForm(false);
      setEditingTask(null);
      loadTasks();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title || "",
      description: task.description || "",
      category: task.category || "Work",
      dueDate: task.dueDate || "",
      priority: task.priority || "Medium",
      status: task.status || "Pending",
    });
    setShowForm(true);
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
      category: "Work",
      dueDate: "",
      priority: "Medium",
      status: "Pending",
    });
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-6">Please login to view tasks</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Your Tasks</h1>
      {/* Add Task Button */}
      <button
        onClick={() => {
          setShowForm(!showForm);
          setEditingTask(null);
          setFormData({
            title: "",
            description: "",
            category: "Work",
            dueDate: "",
            priority: "Medium",
            status: "Pending",
          });
        }}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        {showForm ? "Cancel" : "+ Add Task"}
      </button>
      {/* Add Task Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingTask ? "Edit Task" : "Add New Task"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              placeholder="Task Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            ></textarea>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option>Work</option>
              <option>Personal</option>
              <option>Others</option>
            </select>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {editingTask ? "Update Task" : "Save Task"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Task List */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="bg-white p-4 rounded-xl shadow text-center text-gray-500">
            No tasks yet. Add your first task!
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white p-4 rounded-xl shadow ${
                task.status === "Completed" ? "opacity-75" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.status === "Completed"}
                      onChange={() => handleToggleComplete(task)}
                      className="w-5 h-5 cursor-pointer"
                    />
                    <h2
                      className={`font-bold text-lg ${
                        task.status === "Completed"
                          ? "line-through text-gray-500"
                          : ""
                      }`}
                    >
                      {task.title}
                    </h2>
                  </div>
                  {task.description && (
                    <p
                      className={`text-sm mt-1 ${
                        task.status === "Completed"
                          ? "line-through text-gray-400"
                          : "text-gray-600"
                      }`}
                    >
                      {task.description}
                    </p>
                  )}
                  <div className="flex gap-4 mt-2 text-sm">
                    <span className="bg-blue-100 px-2 py-1 rounded">
                      {task.category || "Uncategorized"}
                    </span>
                    <span className="bg-yellow-100 px-2 py-1 rounded">
                      {task.priority || "Medium"}
                    </span>
                    <span
                      className={`px-2 py-1 rounded ${
                        task.status === "Completed"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      {task.status || "Pending"}
                    </span>
                    {task.dueDate && (
                      <span className="text-gray-500">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(task)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
