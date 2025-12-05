import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/users/login", data);
      // Store JWT token
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        alert("Login Successful!");
        navigate("/");
      } else {
        alert("Login failed: No token received");
      }
    } catch (err) {
      alert("Invalid Credentials: " + (err.response?.data?.message || err.message || "Login failed"));
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-80 space-y-5"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={data.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={data.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Login
        </button>
        <p className="text-center">
          Don't have an account?{" "}
          <a className="text-blue-600" href="/register">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
