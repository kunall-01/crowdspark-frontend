import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./redux/slices/authSlice";
import axios from "./utils/axiosInstance"; // ✅ Use central axios instance

import socket from "./components/Socket";

import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import CampaignDetails from "./pages/CampaignDetails";
import Explore from "./pages/Explore";
import CreateCampaign from "./pages/CreateCampaign";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SupportPage from "./pages/SupportPage";
import UserDashboard from "./pages/Dashboard/UserDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";

export default function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const isAdmin = user?.role === "admin";
  const isCampaignOwner = user?.role === "campaignOwner";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/me");
        dispatch(setUser(res.data));
      } catch (err) {
        console.log("Not logged in or token invalid");
      } finally {
        setIsAuthChecked(true);
      }
    };

    fetchUser();
  }, [dispatch]);

  useEffect(() => {
    if (user?._id) {
      socket.emit("join", user._id);
      // console.log("🧩 Joined socket room:", user._id);
    }
  }, [user]);

  if (!isAuthChecked) return null;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/campaign/:id" element={<CampaignDetails />} />
          <Route
            path="/campaigns/:id"
            element={<Navigate to="/campaign/:id" />}
          />
          <Route path="/explore" element={<Explore />} />
          <Route path="/support/:id" element={<SupportPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={user ? <UserDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin"
            element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />}
          />
          <Route
            path="/create"
            element={
              isCampaignOwner || isAdmin ? (
                <CreateCampaign />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
