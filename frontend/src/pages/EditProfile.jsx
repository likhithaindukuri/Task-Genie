import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import profileIcon from "../assets/profile.png";
import deleteIcon from "../assets/delete.png";
import logo from "../assets/logo.svg";
import editIcon from "../assets/edit.png";

export default function EditProfile() {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(profileIcon);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Navigation Bar */}
      <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b-2 border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
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
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-gray-200/50">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <img src={editIcon} alt="Edit Profile" className="w-10 h-10 brightness-0 invert" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Edit Profile
              </h1>
              <p className="text-gray-600 text-lg">Manage your account settings and preferences</p>
            </div>
          </div>

          {/* Profile Picture Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              Profile Picture
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-gradient-to-br from-gray-50 to-white rounded-3xl border-2 border-gray-200/50">
              <div className="relative group">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-40 h-40 rounded-full shadow-2xl object-cover border-4 border-white group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-3 shadow-xl">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col gap-4 flex-1 w-full md:w-auto">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <span className="inline-block w-full px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-center">
                    Upload New Photo
                  </span>
                </label>
                <button
                  onClick={handleRemoveImage}
                  className="px-8 py-4 bg-gray-200 text-gray-700 rounded-2xl font-bold text-lg hover:bg-gray-300 hover:shadow-lg transition-all duration-300"
                >
                  Remove Photo
                </button>
                <p className="text-sm text-gray-500 text-center md:text-left">
                  JPG, PNG or GIF. Max size of 5MB. Recommended: 400x400px
                </p>
              </div>
            </div>
          </div>

          <hr className="my-10 border-gray-200" />

          {/* Account Settings */}
          <div className="space-y-6 mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              Account Settings
            </h2>

            <div className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-200/50">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Change Password
              </label>
              <button
                onClick={() => alert("Password change feature coming soon!")}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Change Password
              </button>
            </div>
          </div>

          <hr className="my-10 border-gray-200" />

          {/* Account Actions */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-8 py-4 bg-gray-200 text-gray-700 rounded-2xl font-bold text-lg hover:bg-gray-300 hover:shadow-lg transition-all duration-300"
              >
                Cancel
              </button>
            </div>

            {/* Delete Account Section */}
            <div className="mt-10 p-8 bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200/50 rounded-3xl shadow-xl">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <img
                    src={deleteIcon}
                    alt="Delete"
                    className="w-10 h-10 brightness-0 invert"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-red-900 mb-3">
                    Delete Account
                  </h3>
                  <p className="text-red-700 mb-6 leading-relaxed">
                    Once you delete your account, there is no going back. Please be certain.
                    All your tasks and data will be permanently deleted.
                  </p>
                  {showDeleteConfirm ? (
                    <div className="space-y-4">
                      <p className="text-red-800 font-bold text-lg">
                        Are you absolutely sure? This action cannot be undone.
                      </p>
                      <div className="flex gap-4">
                        <button
                          onClick={handleDeleteAccount}
                          disabled={isLoading}
                          className="px-8 py-4 bg-red-600 text-white rounded-xl font-bold text-lg hover:bg-red-700 hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                        >
                          {isLoading ? (
                            <>
                              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Deleting...
                            </>
                          ) : (
                            "Yes, Delete My Account"
                          )}
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-300 hover:shadow-lg transition-all duration-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleDeleteAccount}
                      className="px-8 py-4 bg-red-600 text-white rounded-xl font-bold text-lg hover:bg-red-700 hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
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

