import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Add token to all requests
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
      // Debug: log token presence (don't log actual token for security)
      if (req.url.includes("parse-task")) {
        console.log("Sending request to parse-task with token:", token ? "Token present" : "No token");
      }
    } else {
      console.warn("No token found in localStorage for request:", req.url);
    }
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (unauthorized)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if not already on login/register page
      const currentPath = window.location.pathname;
      if (currentPath !== "/login" && currentPath !== "/register" && currentPath !== "/") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;

