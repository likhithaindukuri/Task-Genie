import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    name: "",
    password: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/users/register", data);
      alert("Registered Successfully! Please login to continue.");
      navigate("/login");
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message || "Registration failed"));
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-80 space-y-5"
      >
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={data.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
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
          Register
        </button>
        <p className="text-center">
          Already have an account?{" "}
          <a className="text-blue-600" href="/">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
