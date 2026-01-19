import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../redux/slices/authSlice";
import axios from "axios";
import socket from "./Socket";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const isCampaignOwner =
      user?.role === "campaignOwner" || user?.role === "admin";

    if (!user || !isCampaignOwner) return;

    // console.log("📡 Joining personal socket room:", user._id);
    socket.emit("join", user._id);

    const listener = (data) => {
      console.log("🔔 Received new backing:", data);

      setNotifications((prev) => [
        ...prev,
        {
          amount: data.amount,
          title: data.campaignId,
          backer: data.backer,
          message: data.message,
        },
      ]);
    };

    socket.on("new_backing", listener);

    return () => {
      socket.off("new_backing", listener);
    };
  }, [user]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND}/logout`,
        {},
        { withCredentials: true }
      );
      dispatch(clearUser());
      setNotifications([]);
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const isAdmin = user?.role === "admin";
  const isCampaignOwner = user?.role === "campaignOwner";

  return (
    <nav className="bg-white/90 backdrop-blur shadow-md sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-green-600">
          CrowdSpark
        </Link>

        {/* Hamburger Icon - Mobile Only */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6 items-center">
          {isAdmin && (
            <Link
              to="/admin"
              className="text-gray-700 hover:text-green-600 relative group"
            >
              <span>Admin</span>
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-green-500 transition-all group-hover:w-full" />
            </Link>
          )}

          {(isAdmin || isCampaignOwner) && (
            <Link
              to="/create"
              className="text-gray-700 hover:text-green-600 relative group"
            >
              <span>Create Campaign</span>
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-green-500 transition-all group-hover:w-full" />
            </Link>
          )}

          <Link
            to="/explore"
            className="text-gray-700 hover:text-green-600 relative group"
          >
            <span>Explore</span>
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-green-500 transition-all group-hover:w-full" />
          </Link>

          {user && (
            <>
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-green-600 relative group"
              >
                <span>Dashboard</span>
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-green-500 transition-all group-hover:w-full" />
              </Link>

              {/* Notification Bell */}
              <div className="relative cursor-pointer">
                <div onClick={() => setShowNotifications((prev) => !prev)}>
                  <svg
                    className="w-6 h-6 text-gray-700 hover:text-green-600 transition"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 animate-pulse">
                      {notifications.length}
                    </span>
                  )}
                </div>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-4 z-50">
                    {notifications.length === 0 ? (
                      <p className="text-sm text-gray-700">
                        🔔 No new notifications
                      </p>
                    ) : (
                      <ul className="text-sm text-gray-800 space-y-2 max-h-60 overflow-y-auto">
                        {notifications
                          .slice(-5)
                          .reverse()
                          .map((n, i) => (
                            <li key={i} className="border-b pb-2">
                              💰 <strong>₹{n.amount}</strong> donated by{" "}
                              <em>{n.backer}</em>
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {!user ? (
            <Link
              to="/login"
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2 rounded-full hover:from-green-600 hover:to-green-700 shadow-lg transition"
            >
              Login / Register
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600 shadow-lg transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3">
          {isAdmin && (
            <Link
              to="/admin"
              className="block text-gray-700 hover:text-green-600"
            >
              Admin
            </Link>
          )}
          {(isAdmin || isCampaignOwner) && (
            <Link
              to="/create"
              className="block text-gray-700 hover:text-green-600"
            >
              Create Campaign
            </Link>
          )}
          <Link
            to="/explore"
            className="block text-gray-700 hover:text-green-600"
          >
            Explore
          </Link>
          {user && (
            <Link
              to="/dashboard"
              className="block text-gray-700 hover:text-green-600"
            >
              Dashboard
            </Link>
          )}
          {!user ? (
            <Link
              to="/login"
              className="block bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2 rounded-full text-center hover:from-green-600 hover:to-green-700 shadow-lg transition"
            >
              Login / Register
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="block w-full bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600 shadow-lg transition"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
  
};

export default Navbar;
