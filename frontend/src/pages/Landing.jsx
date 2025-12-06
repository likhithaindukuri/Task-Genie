import { useState } from "react";
import { useNavigate } from "react-router-dom";
import profileIcon from "../assets/profile.png";
import signoutIcon from "../assets/signout.png";
import dashboardIcon from "../assets/dashboard.png";
import editIcon from "../assets/edit.png";
import tasksIcon from "../assets/tasks.png";
import logo from "../assets/logo.svg";
import aiRobot from "../assets/ai-robot.png";
import analyticsIcon from "../assets/analytics.png";
import securityIcon from "../assets/security.png";
import fastIcon from "../assets/fast.png";
import completedIcon from "../assets/completed.png";
import pendingIcon from "../assets/pending.png";

export default function Landing() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("token");
  });
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setShowProfileDropdown(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Task Genie Logo" className="h-10 w-10" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Task Genie
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <div
                  className="relative"
                  onMouseEnter={() => setShowProfileDropdown(true)}
                  onMouseLeave={() => setShowProfileDropdown(false)}
                >
                  <button className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition">
                    <img
                      src={profileIcon}
                      alt="Profile"
                      className="w-10 h-10 rounded-full"
                    />
                  </button>
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <button
                        onClick={() => {
                          navigate("/dashboard");
                          setShowProfileDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2"
                      >
                        <img src={dashboardIcon} alt="Dashboard" className="w-4 h-4" />
                        <span>Your Dashboard</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate("/tasks");
                          setShowProfileDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2"
                      >
                        <img src={tasksIcon} alt="Tasks" className="w-4 h-4" />
                        <span>Your Tasks</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setShowProfileDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2"
                      >
                        <img src={editIcon} alt="Edit Profile" className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </button>
                      <hr className="my-2" />
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2"
                      >
                        <img src={signoutIcon} alt="Sign Out" className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition font-medium"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Organize Your Life with
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI-Powered Task Management
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Transform your productivity with intelligent task organization. Let AI help you
            create detailed task descriptions and stay on top of your goals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => navigate("/tasks")}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition duration-300"
                >
                  Get Started →
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-xl text-lg font-semibold hover:bg-blue-50 transform hover:scale-105 transition duration-300"
                >
                  View Dashboard
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/register")}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition duration-300"
                >
                  Get Started Free
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-xl text-lg font-semibold hover:bg-blue-50 transform hover:scale-105 transition duration-300"
                >
                  Sign In
                </button>
              </>
            )}
          </div>

          {/* Feature Cards Carousel */}
          <div className="mt-20 relative overflow-hidden bg-transparent">
            <div className="flex gap-6 animate-scroll" style={{ animation: "scroll 30s linear infinite" }}>
              {/* Card 1 - AI-Powered */}
              <div className="flex-shrink-0 w-80 bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl shadow-xl border border-blue-200 hover:shadow-2xl transform hover:scale-105 transition duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <img src={aiRobot} alt="AI" className="w-10 h-10 brightness-0 invert" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">AI-Powered Descriptions</h3>
                <p className="text-gray-700 leading-relaxed">
                  Get intelligent task descriptions generated automatically. Just enter a title and let AI create detailed action points for you.
                </p>
              </div>

              {/* Card 2 - Smart Dashboard */}
              <div className="flex-shrink-0 w-80 bg-gradient-to-br from-purple-50 to-pink-100 p-8 rounded-2xl shadow-xl border border-purple-200 hover:shadow-2xl transform hover:scale-105 transition duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <img src={analyticsIcon} alt="Dashboard" className="w-10 h-10 brightness-0 invert" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Smart Dashboard</h3>
                <p className="text-gray-700 leading-relaxed">
                  Track your progress with real-time statistics. See completed tasks, pending items, and stay motivated with visual insights.
                </p>
              </div>

              {/* Card 3 - Secure & Private */}
              <div className="flex-shrink-0 w-80 bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-2xl shadow-xl border border-green-200 hover:shadow-2xl transform hover:scale-105 transition duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <img src={securityIcon} alt="Secure" className="w-10 h-10 brightness-0 invert" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Secure & Private</h3>
                <p className="text-gray-700 leading-relaxed">
                  Your tasks are encrypted and private. Each user can only access their own tasks with JWT authentication.
                </p>
              </div>

              {/* Card 4 - Fast Performance */}
              <div className="flex-shrink-0 w-80 bg-gradient-to-br from-orange-50 to-amber-100 p-8 rounded-2xl shadow-xl border border-orange-200 hover:shadow-2xl transform hover:scale-105 transition duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <img src={fastIcon} alt="Fast" className="w-10 h-10 brightness-0 invert" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
                <p className="text-gray-700 leading-relaxed">
                  Experience blazing-fast performance. Create, update, and manage tasks instantly with our optimized platform.
                </p>
              </div>

              {/* Card 5 - Task Tracking */}
              <div className="flex-shrink-0 w-80 bg-gradient-to-br from-cyan-50 to-blue-100 p-8 rounded-2xl shadow-xl border border-cyan-200 hover:shadow-2xl transform hover:scale-105 transition duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <img src={completedIcon} alt="Tracking" className="w-10 h-10 brightness-0 invert" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Progress Tracking</h3>
                <p className="text-gray-700 leading-relaxed">
                  Monitor your productivity with detailed progress tracking. See what's completed and what's pending at a glance.
                </p>
              </div>

              {/* Card 6 - Priority Management */}
              <div className="flex-shrink-0 w-80 bg-gradient-to-br from-rose-50 to-pink-100 p-8 rounded-2xl shadow-xl border border-rose-200 hover:shadow-2xl transform hover:scale-105 transition duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <img src={pendingIcon} alt="Priority" className="w-10 h-10 brightness-0 invert" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Priority Management</h3>
                <p className="text-gray-700 leading-relaxed">
                  Organize tasks by priority levels. Focus on what matters most with High, Medium, and Low priority settings.
                </p>
              </div>

              {/* Duplicate all cards for seamless infinite loop */}
              <div className="flex-shrink-0 w-80 bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl shadow-xl border border-blue-200 hover:shadow-2xl transform hover:scale-105 transition duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <img src={aiRobot} alt="AI" className="w-10 h-10 brightness-0 invert" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">AI-Powered Descriptions</h3>
                <p className="text-gray-700 leading-relaxed">
                  Get intelligent task descriptions generated automatically. Just enter a title and let AI create detailed action points for you.
                </p>
              </div>

              <div className="flex-shrink-0 w-80 bg-gradient-to-br from-purple-50 to-pink-100 p-8 rounded-2xl shadow-xl border border-purple-200 hover:shadow-2xl transform hover:scale-105 transition duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <img src={analyticsIcon} alt="Dashboard" className="w-10 h-10 brightness-0 invert" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Smart Dashboard</h3>
                <p className="text-gray-700 leading-relaxed">
                  Track your progress with real-time statistics. See completed tasks, pending items, and stay motivated with visual insights.
                </p>
              </div>

              <div className="flex-shrink-0 w-80 bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-2xl shadow-xl border border-green-200 hover:shadow-2xl transform hover:scale-105 transition duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <img src={securityIcon} alt="Secure" className="w-10 h-10 brightness-0 invert" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Secure & Private</h3>
                <p className="text-gray-700 leading-relaxed">
                  Your tasks are encrypted and private. Each user can only access their own tasks with JWT authentication.
                </p>
              </div>

              <div className="flex-shrink-0 w-80 bg-gradient-to-br from-orange-50 to-amber-100 p-8 rounded-2xl shadow-xl border border-orange-200 hover:shadow-2xl transform hover:scale-105 transition duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <img src={fastIcon} alt="Fast" className="w-10 h-10 brightness-0 invert" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
                <p className="text-gray-700 leading-relaxed">
                  Experience blazing-fast performance. Create, update, and manage tasks instantly with our optimized platform.
                </p>
              </div>

              <div className="flex-shrink-0 w-80 bg-gradient-to-br from-cyan-50 to-blue-100 p-8 rounded-2xl shadow-xl border border-cyan-200 hover:shadow-2xl transform hover:scale-105 transition duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <img src={completedIcon} alt="Tracking" className="w-10 h-10 brightness-0 invert" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Progress Tracking</h3>
                <p className="text-gray-700 leading-relaxed">
                  Monitor your productivity with detailed progress tracking. See what's completed and what's pending at a glance.
                </p>
              </div>

              <div className="flex-shrink-0 w-80 bg-gradient-to-br from-rose-50 to-pink-100 p-8 rounded-2xl shadow-xl border border-rose-200 hover:shadow-2xl transform hover:scale-105 transition duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <img src={pendingIcon} alt="Priority" className="w-10 h-10 brightness-0 invert" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Priority Management</h3>
                <p className="text-gray-700 leading-relaxed">
                  Organize tasks by priority levels. Focus on what matters most with High, Medium, and Low priority settings.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Features */}
          <div className="mt-20 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Everything You Need to Stay Organized
              </h2>
              <ul className="space-y-4 text-left">
                <li className="flex items-start gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Task Management</h4>
                    <p className="text-gray-600">Create, update, and organize tasks with ease</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">📅</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Due Dates & Priorities</h4>
                    <p className="text-gray-600">Set deadlines and prioritize what matters</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🏷️</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Categories</h4>
                    <p className="text-gray-600">Organize tasks by Work, Personal, or Others</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">📈</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Progress Tracking</h4>
                    <p className="text-gray-600">Monitor your productivity and achievements</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-12 text-center">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
              <p className="text-gray-700 mb-6">
                Join thousands of users who are already organizing their lives with Task Genie
              </p>
              {!isLoggedIn && (
                <button
                  onClick={() => navigate("/register")}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-xl transform hover:scale-105 transition"
                >
                  Create Free Account
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="font-semibold text-gray-900 mb-2">Task Genie</p>
            <p>Your AI-Powered Task Management Solution</p>
            <p className="mt-4 text-sm">© 2024 Task Genie. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

