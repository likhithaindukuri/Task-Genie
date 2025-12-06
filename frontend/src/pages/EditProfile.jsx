import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import profileIcon from "../assets/profile.png";
import deleteIcon from "../assets/delete.png";

export default function EditProfile() {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(profileIcon);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    // Load user data - you can fetch from API later
    // For now, we'll use placeholder
    setName("User Name");
    setEmail("user@example.com");
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(profileIcon);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to update profile
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Error updating profile: " + (err.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement API call to delete account
      const confirmed = window.confirm(
        "Are you absolutely sure? This will permanently delete your account and all your tasks. This action cannot be undone."
      );
      if (confirmed) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
        localStorage.removeItem("token");
        alert("Account deleted successfully");
        navigate("/");
      }
    } catch (err) {
      alert("Error deleting account: " + (err.message || "Unknown error"));
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate("/")}
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              Task Genie
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Edit Profile
          </h1>
          <p className="text-gray-600 mb-8">Manage your account settings and preferences</p>

          {/* Profile Picture Section */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Profile Picture
            </label>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full shadow-lg object-cover"
                />
                <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-2 shadow-lg">
                  <span className="text-white text-xl">📷</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 flex-1">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <span className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition text-center">
                    Upload New Photo
                  </span>
                </label>
                <button
                  onClick={handleRemoveImage}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Remove Photo
                </button>
                <p className="text-sm text-gray-500">
                  JPG, PNG or GIF. Max size of 5MB. Recommended: 400x400px
                </p>
              </div>
            </div>
          </div>

          <hr className="my-8 border-gray-200" />

          {/* Personal Information */}
          <div className="space-y-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50"
                placeholder="Enter your email"
                disabled
              />
              <p className="text-sm text-gray-500 mt-1">
                Email cannot be changed. Contact support if you need to update it.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Change Password
              </label>
              <button
                onClick={() => alert("Password change feature coming soon!")}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Change Password
              </button>
            </div>
          </div>

          <hr className="my-8 border-gray-200" />

          {/* Account Actions */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Account Actions</h2>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>

            {/* Delete Account Section */}
            <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-4">
                <img
                  src={deleteIcon}
                  alt="Delete"
                  className="w-8 h-8 flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-red-900 mb-2">
                    Delete Account
                  </h3>
                  <p className="text-red-700 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                    All your tasks and data will be permanently deleted.
                  </p>
                  {showDeleteConfirm ? (
                    <div className="space-y-3">
                      <p className="text-red-800 font-semibold">
                        Are you absolutely sure? This action cannot be undone.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={handleDeleteAccount}
                          disabled={isLoading}
                          className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
                        >
                          {isLoading ? "Deleting..." : "Yes, Delete My Account"}
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleDeleteAccount}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                    >
                      Delete Account
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

