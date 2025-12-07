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
import tasksIconFeature from "../assets/tasks.png";
import progressIconFeature from "../assets/progress.png";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Navigation Bar */}
      <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b-2 border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <img src={logo} alt="Task Genie Logo" className="h-8 w-8 brightness-0 invert" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
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
                  <button className="flex items-center gap-2 p-2 rounded-2xl hover:bg-gray-100 transition-all duration-200">
                    <img
                      src={profileIcon}
                      alt="Profile"
                      className="w-12 h-12 rounded-full shadow-md"
                    />
                  </button>
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-gray-200/50 py-3 z-50">
                      <button
                        onClick={() => {
                          navigate("/dashboard");
                          setShowProfileDropdown(false);
                        }}
                        className="w-full text-left px-5 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 text-gray-700 flex items-center gap-3 transition-all duration-200 font-medium"
                      >
                        <img src={dashboardIcon} alt="Dashboard" className="w-5 h-5" />
                        <span>Your Dashboard</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate("/tasks");
                          setShowProfileDropdown(false);
                        }}
                        className="w-full text-left px-5 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 text-gray-700 flex items-center gap-3 transition-all duration-200 font-medium"
                      >
                        <img src={tasksIcon} alt="Tasks" className="w-5 h-5" />
                        <span>Your Tasks</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setShowProfileDropdown(false);
                        }}
                        className="w-full text-left px-5 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 text-gray-700 flex items-center gap-3 transition-all duration-200 font-medium"
                      >
                        <img src={editIcon} alt="Edit Profile" className="w-5 h-5" />
                        <span>Edit Profile</span>
                      </button>
                      <hr className="my-2 border-gray-200" />
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-5 py-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 text-red-600 flex items-center gap-3 transition-all duration-200 font-medium"
                      >
                        <img src={signoutIcon} alt="Sign Out" className="w-5 h-5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-6 py-3 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-200 rounded-xl hover:bg-gray-100"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-8 leading-tight">
            Organize Your Life with
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mt-2">
              AI-Powered Task Management
            </span>
          </h1>
          <p className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform your productivity with intelligent task organization. Let AI help you
            create detailed task descriptions and stay on top of your goals effortlessly.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-20">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => navigate("/tasks")}
                  className="px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl text-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  Get Started
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-10 py-5 bg-white/90 backdrop-blur-sm text-blue-600 border-2 border-blue-600 rounded-2xl text-xl font-bold hover:bg-blue-50 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  View Dashboard
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/register")}
                  className="px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl text-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  Get Started Free
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="px-10 py-5 bg-white/90 backdrop-blur-sm text-blue-600 border-2 border-blue-600 rounded-2xl text-xl font-bold hover:bg-blue-50 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Sign In
                </button>
              </>
            )}
          </div>

          {/* Feature Cards Carousel */}
          <div className="mt-24 relative overflow-hidden bg-transparent py-8">
            <div className="flex gap-8 animate-scroll" style={{ animation: "scroll 30s linear infinite" }}>
              {/* Card 1 - AI-Powered */}
              <div className="flex-shrink-0 w-96 bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border-2 border-blue-200/50 hover:shadow-3xl hover:border-blue-300 transform hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                  <img src={aiRobot} alt="AI" className="w-12 h-12 brightness-0 invert" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">AI-Powered Descriptions</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Get intelligent task descriptions generated automatically. Just enter a title and let AI create detailed action points for you.
                </p>
              </div>

              {/* Card 2 - Smart Dashboard */}
              <div className="flex-shrink-0 w-96 bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border-2 border-purple-200/50 hover:shadow-3xl hover:border-purple-300 transform hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                  <img src={analyticsIcon} alt="Dashboard" className="w-12 h-12 brightness-0 invert" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Smart Dashboard</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Track your progress with real-time statistics. See completed tasks, pending items, and stay motivated with visual insights.
                </p>
              </div>

              {/* Card 3 - Secure & Private */}
              <div className="flex-shrink-0 w-96 bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border-2 border-green-200/50 hover:shadow-3xl hover:border-green-300 transform hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                  <img src={securityIcon} alt="Secure" className="w-12 h-12 brightness-0 invert" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Secure & Private</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Your tasks are encrypted and private. Each user can only access their own tasks with JWT authentication.
                </p>
              </div>

              {/* Card 4 - Fast Performance */}
              <div className="flex-shrink-0 w-96 bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border-2 border-orange-200/50 hover:shadow-3xl hover:border-orange-300 transform hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                  <img src={fastIcon} alt="Fast" className="w-12 h-12 brightness-0 invert" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Lightning Fast</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Experience blazing-fast performance. Create, update, and manage tasks instantly with our optimized platform.
                </p>
              </div>

              {/* Card 5 - Task Tracking */}
              <div className="flex-shrink-0 w-96 bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border-2 border-cyan-200/50 hover:shadow-3xl hover:border-cyan-300 transform hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                  <img src={completedIcon} alt="Tracking" className="w-12 h-12 brightness-0 invert" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Progress Tracking</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Monitor your productivity with detailed progress tracking. See what's completed and what's pending at a glance.
                </p>
              </div>

              {/* Card 6 - Priority Management */}
              <div className="flex-shrink-0 w-96 bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border-2 border-rose-200/50 hover:shadow-3xl hover:border-rose-300 transform hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                  <img src={pendingIcon} alt="Priority" className="w-12 h-12 brightness-0 invert" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Priority Management</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Organize tasks by priority levels. Focus on what matters most with High, Medium, and Low priority settings.
                </p>
              </div>

              {/* Duplicate all cards for seamless infinite loop */}
              <div className="flex-shrink-0 w-96 bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border-2 border-blue-200/50 hover:shadow-3xl hover:border-blue-300 transform hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                  <img src={aiRobot} alt="AI" className="w-12 h-12 brightness-0 invert" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">AI-Powered Descriptions</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Get intelligent task descriptions generated automatically. Just enter a title and let AI create detailed action points for you.
                </p>
              </div>

              <div className="flex-shrink-0 w-96 bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border-2 border-purple-200/50 hover:shadow-3xl hover:border-purple-300 transform hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                  <img src={analyticsIcon} alt="Dashboard" className="w-12 h-12 brightness-0 invert" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Smart Dashboard</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Track your progress with real-time statistics. See completed tasks, pending items, and stay motivated with visual insights.
                </p>
              </div>

              <div className="flex-shrink-0 w-96 bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border-2 border-green-200/50 hover:shadow-3xl hover:border-green-300 transform hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                  <img src={securityIcon} alt="Secure" className="w-12 h-12 brightness-0 invert" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Secure & Private</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Your tasks are encrypted and private. Each user can only access their own tasks with JWT authentication.
                </p>
              </div>

              <div className="flex-shrink-0 w-96 bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border-2 border-orange-200/50 hover:shadow-3xl hover:border-orange-300 transform hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                  <img src={fastIcon} alt="Fast" className="w-12 h-12 brightness-0 invert" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Lightning Fast</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Experience blazing-fast performance. Create, update, and manage tasks instantly with our optimized platform.
                </p>
              </div>

              <div className="flex-shrink-0 w-96 bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border-2 border-cyan-200/50 hover:shadow-3xl hover:border-cyan-300 transform hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                  <img src={completedIcon} alt="Tracking" className="w-12 h-12 brightness-0 invert" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Progress Tracking</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Monitor your productivity with detailed progress tracking. See what's completed and what's pending at a glance.
                </p>
              </div>

              <div className="flex-shrink-0 w-96 bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border-2 border-rose-200/50 hover:shadow-3xl hover:border-rose-300 transform hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                  <img src={pendingIcon} alt="Priority" className="w-12 h-12 brightness-0 invert" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Priority Management</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Organize tasks by priority levels. Focus on what matters most with High, Medium, and Low priority settings.
                </p>
              </div>
            </div>
          </div>

          {/* Why Choose Task Genie Section */}
          <div className="mt-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Why Choose Task Genie?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
                With so many AI task managers available, here's what makes Task Genie different and better
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {/* Reason 1 - Natural Language */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-blue-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Natural Language Task Creation</h3>
                <p className="text-gray-600 leading-relaxed">
                  Simply describe your task in plain English like "Call Sarah tomorrow at 3pm about the project" and our AI automatically fills all the fields. No more tedious form filling!
                </p>
              </div>

              {/* Reason 2 - Completely Free */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-green-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">100% Free Forever</h3>
                <p className="text-gray-600 leading-relaxed">
                  Unlike other task managers with hidden fees or premium tiers, Task Genie is completely free. All features, including AI-powered descriptions and natural language parsing, are available to everyone.
                </p>
              </div>

              {/* Reason 3 - Privacy First */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-purple-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Your Data, Your Privacy</h3>
                <p className="text-gray-600 leading-relaxed">
                  We use JWT authentication to ensure your tasks are completely private. Each user can only access their own tasks. No data sharing, no tracking, no ads.
                </p>
              </div>

              {/* Reason 4 - Simple & Intuitive */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-orange-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Simple & Intuitive</h3>
                <p className="text-gray-600 leading-relaxed">
                  No complex setup, no learning curve. Task Genie is designed to be immediately usable. Create your first task in seconds, not minutes.
                </p>
              </div>

              {/* Reason 5 - Fast & Efficient */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-cyan-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
                <p className="text-gray-600 leading-relaxed">
                  Built for speed. Create, update, and manage tasks instantly. AI descriptions generate in seconds, not minutes. No waiting, no lag.
                </p>
              </div>

              {/* Reason 6 - No Hidden Costs */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-rose-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Hidden Costs</h3>
                <p className="text-gray-600 leading-relaxed">
                  What you see is what you get. No surprise charges, no premium upsells, no feature limitations. Everything is included, always free.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Features */}
          <div className="mt-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Everything You Need to Stay Organized
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Powerful features designed to help you manage your tasks efficiently and achieve your goals
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              {/* Feature 1 - Task Management */}
              <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-gray-200/50 hover:shadow-2xl hover:scale-105 hover:border-blue-300 transform transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <img src={tasksIconFeature} alt="Tasks" className="w-10 h-10 brightness-0 invert" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Task Management</h3>
                <p className="text-gray-600 leading-relaxed">
                  Create, update, and organize tasks with ease. Full control at your fingertips.
                </p>
              </div>

              {/* Feature 2 - Due Dates & Priorities */}
              <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-gray-200/50 hover:shadow-2xl hover:scale-105 hover:border-purple-300 transform transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Due Dates & Priorities</h3>
                <p className="text-gray-600 leading-relaxed">
                  Set deadlines and prioritize what matters most. Never miss an important task.
                </p>
              </div>

              {/* Feature 3 - Categories */}
              <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-gray-200/50 hover:shadow-2xl hover:scale-105 hover:border-green-300 transform transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Categories</h3>
                <p className="text-gray-600 leading-relaxed">
                  Organize tasks by Work, Personal, or Others. Keep everything neatly sorted.
                </p>
              </div>

              {/* Feature 4 - Progress Tracking */}
              <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-gray-200/50 hover:shadow-2xl hover:scale-105 hover:border-orange-300 transform transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <img src={progressIconFeature} alt="Progress" className="w-10 h-10 brightness-0 invert" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Progress Tracking</h3>
                <p className="text-gray-600 leading-relaxed">
                  Monitor your productivity and achievements. See how far you've come.
                </p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-16 md:p-20 text-center shadow-2xl border-4 border-white/20">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/50 via-purple-600/50 to-pink-600/50"></div>
              <div className="relative z-10">
                <div className="inline-block mb-8">
                  <div className="w-24 h-24 bg-white/30 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                  Ready to Transform Your Productivity?
                </h3>
                <p className="text-white/95 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                  Join thousands of users who are already organizing their lives with Task Genie. Start your journey today!
                </p>
                {!isLoggedIn ? (
                  <button
                    onClick={() => navigate("/register")}
                    className="px-10 py-5 bg-white text-blue-600 rounded-2xl text-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto"
                  >
                    Create Free Account
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/tasks")}
                    className="px-10 py-5 bg-white text-blue-600 rounded-2xl text-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto"
                  >
                    Start Managing Tasks
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur-md border-t-2 border-gray-200/50 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <img src={logo} alt="Task Genie Logo" className="h-8 w-8 brightness-0 invert" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Task Genie
              </h3>
            </div>
            <p className="text-gray-600 text-lg mb-2 font-medium">Your AI-Powered Task Management Solution</p>
            <p className="text-gray-500 text-sm mt-6">© 2024 Task Genie. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

