import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    let didCancel = false;

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND}/login`,
        { email: form.email, password: form.password },
        { withCredentials: true }
      );

      const res = await axios.get(`${import.meta.env.VITE_BACKEND}/me`, {
        withCredentials: true,
      });

      if (!didCancel) {
        dispatch(setUser(res.data));
        setSuccess("Login successful!");

        if (res.data?.role === "admin") {
          navigate("/admin");
        } else if (res.data?.role === "campaignOwner") {
          navigate("/create");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      if (!didCancel) {
        setError(err.response?.data?.message || "Login failed");
      }
    }

    return () => {
      didCancel = true;
    };
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-green-50 via-white to-green-100"
      style={{ color: "black" }}
    >
      <div className="absolute inset-0 -z-10 blur-2xl opacity-60 bg-gradient-to-br from-green-100 via-white to-green-200" />

      <div className="w-full max-w-md p-8 bg-white/70 backdrop-blur-xl border border-green-100 rounded-3xl shadow-xl">
        <h1 className="text-3xl font-extrabold text-center text-green-800 mb-8 drop-shadow">
          🔐 Login to CrowdSpark
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-green-800 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-green-200 bg-white/80"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-green-800 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-green-200 bg-white/80"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm font-medium -mt-2">
              {error}
            </div>
          )}
          {success && (
            <div className="text-green-600 text-sm font-medium -mt-2">
              {success}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 mt-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-full shadow-md hover:from-green-600 hover:to-green-700 transition-transform transform hover:scale-105"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          New to CrowdSpark?{" "}
          <a
            href="/register"
            className="text-green-600 font-semibold hover:underline"
          >
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}
