import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import registerIllustration from "../assets/registerIllustartion.svg";
import freeIcon from "../assets/free.png";
import settingsIcon from "../assets/settings.png";
import aiRobot from "../assets/ai-robot.png";
import logo from "../assets/logo.svg";

export default function Register() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (data.password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = data;
      const res = await API.post("/users/register", registerData);
      alert("Registered Successfully! Please login to continue.");
      navigate("/login");
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message || "Registration failed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      {/* Left Side - Illustration/Design */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 p-12 items-start justify-center pt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/50 via-pink-600/50 to-red-500/50"></div>
        <div className="relative z-10 text-center text-white max-w-lg">
          <div className="mb-6">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
              <img
                src={registerIllustration}
                alt="Register"
                className="w-16 h-16"
              />
            </div>
            <h1 className="text-6xl font-extrabold mb-3">Get Started!</h1>
            <p className="text-xl text-purple-100 leading-relaxed">
              Join thousands of users organizing their lives with Task Genie
            </p>
          </div>
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-4 bg-white/20 backdrop-blur-md p-5 rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <img src={freeIcon} alt="Free" className="w-7 h-7 brightness-0 invert" />
              </div>
              <div className="text-left">
                <p className="font-bold text-lg">Free Forever</p>
                <p className="text-sm text-purple-100">No credit card required</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/20 backdrop-blur-md p-5 rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <img src={settingsIcon} alt="Setup" className="w-7 h-7 brightness-0 invert" />
              </div>
              <div className="text-left">
                <p className="font-bold text-lg">Setup in Seconds</p>
                <p className="text-sm text-purple-100">Start organizing immediately</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/20 backdrop-blur-md p-5 rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <img src={aiRobot} alt="AI-Powered" className="w-7 h-7 brightness-0 invert" />
              </div>
              <div className="text-left">
                <p className="font-bold text-lg">AI-Powered</p>
                <p className="text-sm text-purple-100">Smart task descriptions</p>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative shapes */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <img src={logo} alt="Task Genie Logo" className="h-8 w-8 brightness-0 invert" />
              </div>
              <button
                onClick={() => navigate("/")}
                className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent"
              >
                Task Genie
              </button>
            </div>
            <h2 className="text-5xl font-extrabold text-gray-900 mb-3">Create Account</h2>
            <p className="text-gray-600 text-lg">Start organizing your tasks today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-gray-200/50">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={handleChange}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white text-lg"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white text-lg"
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
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white pr-14 text-lg"
                  placeholder="At least 6 characters"
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

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={data.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white pr-14 text-lg"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showConfirmPassword ? (
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

            <div className="flex items-start">
              <input
                type="checkbox"
                className="mt-1 w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                required
              />
              <label className="ml-3 text-sm text-gray-700 cursor-pointer">
                I agree to the{" "}
                <a href="#" className="text-purple-600 hover:text-purple-700 font-semibold">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-purple-600 hover:text-purple-700 font-semibold">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-lg">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-600 hover:text-purple-700 font-bold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
