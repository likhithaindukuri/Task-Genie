import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks } from "../services/taskService";

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      loadTasks();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const loadTasks = async () => {
    try {
      const data = await getTasks(userId);
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

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-6">Task Genie Dashboard ✨</h1>
        <p className="text-lg">Please login to view your dashboard</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Task Genie Dashboard ✨</h1>
      {loading ? (
        <p className="text-lg">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Tasks */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold">Total Tasks</h2>
              <p className="text-4xl font-bold mt-2">{totalTasks}</p>
            </div>
            {/* Completed */}
            <div className="bg-green-100 p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold">Completed</h2>
              <p className="text-4xl font-bold mt-2">{completedTasks}</p>
            </div>
            {/* Pending */}
            <div className="bg-red-100 p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold">Pending</h2>
              <p className="text-4xl font-bold mt-2">{pendingTasks}</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/tasks")}
            className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg"
          >
            View Tasks →
          </button>
        </>
      )}
    </div>
  );
}
