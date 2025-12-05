import { useState } from "react";
import { useNavigate } from "react-router-dom";
import profileIcon from "../assets/profile.png";

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
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ✨ Task Genie
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition"
                  >
                    <img
                      src={profileIcon}
                      alt="Profile"
                      className="w-10 h-10 rounded-full border-2 border-blue-500"
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
                        <span>📊</span> Your Dashboard
                      </button>
                      <button
                        onClick={() => {
                          navigate("/tasks");
                          setShowProfileDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2"
                      >
                        <span>📝</span> Your Tasks
                      </button>
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setShowProfileDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2"
                      >
                        <span>👤</span> Edit Profile
                      </button>
                      <hr className="my-2" />
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2"
                      >
                        <span>🚪</span> Sign Out
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

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Descriptions</h3>
              <p className="text-gray-600">
                Get intelligent task descriptions generated automatically. Just enter a title and
                let AI create detailed action points for you.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Dashboard</h3>
              <p className="text-gray-600">
                Track your progress with real-time statistics. See completed tasks, pending items,
                and stay motivated with visual insights.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Private</h3>
              <p className="text-gray-600">
                Your tasks are encrypted and private. Each user can only access their own tasks
                with JWT authentication.
              </p>
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
            <p className="font-semibold text-gray-900 mb-2">✨ Task Genie</p>
            <p>Your AI-Powered Task Management Solution</p>
            <p className="mt-4 text-sm">© 2024 Task Genie. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Close dropdown when clicking outside */}
      {showProfileDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowProfileDropdown(false)}
        ></div>
      )}
    </div>
  );
}

