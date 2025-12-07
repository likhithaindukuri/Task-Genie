import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import loginIllustration from "../assets/loginIllustartion.svg";
import aiRobot from "../assets/ai-robot.png";
import securityIcon from "../assets/security.png";
import analyticsIcon from "../assets/analytics.png";
import fastIcon from "../assets/fast.png";
import logo from "../assets/logo.svg";

export default function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await API.post("/users/login", data);
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        alert("Login Successful!");
        navigate("/");
      } else {
        alert("Login failed: No token received");
      }
    } catch (err) {
      alert("Invalid Credentials: " + (err.response?.data?.message || err.message || "Login failed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Left Side - Illustration/Design */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-12 items-start justify-center pt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/50 via-purple-600/50 to-indigo-700/50"></div>
        <div className="relative z-10 text-center text-white max-w-lg">
          <div className="mb-6">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
              <img
                src={loginIllustration}
                alt="Login"
                className="w-16 h-16"
              />
            </div>
            <h1 className="text-6xl font-extrabold mb-3">Welcome Back!</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Organize your life with AI-powered task management
            </p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-white/20 backdrop-blur-md p-5 rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3 mx-auto">
                <img src={aiRobot} alt="AI" className="w-7 h-7 brightness-0 invert" />
              </div>
              <p className="text-sm font-semibold">AI-Powered</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md p-5 rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3 mx-auto">
                <img src={securityIcon} alt="Secure" className="w-7 h-7 brightness-0 invert" />
              </div>
              <p className="text-sm font-semibold">Secure</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md p-5 rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3 mx-auto">
                <img src={analyticsIcon} alt="Analytics" className="w-7 h-7 brightness-0 invert" />
              </div>
              <p className="text-sm font-semibold">Analytics</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md p-5 rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3 mx-auto">
                <img src={fastIcon} alt="Fast" className="w-7 h-7 brightness-0 invert" />
              </div>
              <p className="text-sm font-semibold">Fast</p>
            </div>
          </div>
        </div>
        {/* Decorative shapes */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <img src={logo} alt="Task Genie Logo" className="h-8 w-8 brightness-0 invert" />
              </div>
              <button
                onClick={() => navigate("/")}
                className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
              >
                Task Genie
              </button>
            </div>
            <h2 className="text-5xl font-extrabold text-gray-900 mb-3">Sign In</h2>
            <p className="text-gray-600 text-lg">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-gray-200/50">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-lg"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white pr-14 text-lg"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                <span className="ml-3 text-sm font-medium text-gray-700">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-lg">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
                Sign up for free
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-8 border-t-2 border-gray-200">
            <p className="text-center text-sm text-gray-500">
              By signing in, you agree to our{" "}
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
