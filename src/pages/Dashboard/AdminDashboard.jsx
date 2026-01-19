import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]); // New state for upgrade requests
  const [loading, setLoading] = useState(true);
  const [reqLoading, setReqLoading] = useState(true); // separate loading for requests

  // Fetch campaigns and users (unchanged)
  const fetchAdminData = async () => {
    try {
      const [campaignRes, userRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND}/admin/campaigns`, {
          withCredentials: true,
        }),
        axios.get(`${import.meta.env.VITE_BACKEND}/admin/users`, {
          withCredentials: true,
        }),
      ]);

      const sortedCampaigns = Array.isArray(campaignRes.data)
        ? campaignRes.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        : [];

      const sortedUsers = Array.isArray(userRes.data)
        ? userRes.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        : [];

      setCampaigns(sortedCampaigns);
      setUsers(sortedUsers);
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch upgrade requests only
  const fetchUpgradeRequests = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND}/admin/upgrade-requests`,
        { withCredentials: true }
      );
      setRequests(res.data || []);
    } catch (err) {
      console.error("Upgrade request fetch failed:", err);
    } finally {
      setReqLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
    fetchUpgradeRequests();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND}/admin/users/${userId}`,
        {
          withCredentials: true,
        }
      );
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      console.error("User delete failed:", err);
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    if (!window.confirm("Are you sure you want to delete this campaign?"))
      return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND}/admin/campaigns/${campaignId}`,
        {
          withCredentials: true,
        }
      );
      setCampaigns((prev) => prev.filter((c) => c._id !== campaignId));
    } catch (err) {
      console.error("Campaign delete failed:", err);
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      await axios.post(
        `${
          import.meta.env.VITE_BACKEND
        }/admin/upgrade-requests/${requestId}/approve`,
        {},
        { withCredentials: true }
      );
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
    } catch (err) {
      console.error("Approval failed:", err);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND}/admin/upgrade-requests/${requestId}`,
        { withCredentials: true }
      );
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
    } catch (err) {
      console.error("Rejection failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-600 text-lg">Loading...</div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-green-700 mb-10">
        👨‍💼 Admin Dashboard
      </h1>

      {/* 🔁 Upgrade Requests Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          📩 Role Upgrade Requests ({requests.length})
        </h2>
        {reqLoading ? (
          <p className="text-gray-500">Loading requests...</p>
        ) : requests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((req) => (
              <div
                key={req._id}
                className="bg-white p-6 rounded-xl shadow border border-green-100 hover:shadow-green-200 transition"
              >
                <h3 className="text-lg font-bold text-green-700">
                  {req.user?.username || "Unknown"}
                </h3>
                <p className="text-gray-600 mb-2">📧 {req.user?.email}</p>
                <p className="text-gray-500 text-sm mb-4">
                  🕒 Requested:{" "}
                  {new Date(req.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleApproveRequest(req._id)}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm"
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => handleRejectRequest(req._id)}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm"
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No pending upgrade requests.</p>
        )}
      </section>

      {/* 📢 Campaigns Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          📢 All Campaigns ({campaigns.length})
        </h2>
        {campaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign._id}
                className="bg-white p-6 rounded-xl shadow border border-green-100 hover:shadow-green-200 transition"
              >
                <h3 className="text-xl font-bold text-green-700">
                  {campaign.title}
                </h3>
                <p className="text-gray-600 mb-1">
                  👤 Creator: {campaign.owner?.username || "Unknown"}
                </p>
                <p className="text-gray-600 mb-1">
                  💰 ₹{campaign.raisedAmount} / ₹{campaign.goalAmount}
                </p>
                <p className="text-gray-400 text-sm mb-3">
                  📅 Created:{" "}
                  {new Date(campaign.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <button
                  onClick={() => handleDeleteCampaign(campaign._id)}
                  className="mt-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm"
                >
                  Delete Campaign
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No campaigns available.</p>
        )}
      </section>

      {/* 👥 Users Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          👥 Registered Users ({users.length})
        </h2>
        {users.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-white p-6 rounded-xl shadow border border-green-100 hover:shadow-green-200 transition"
              >
                <h3 className="text-lg font-bold text-green-700">
                  {user.username}
                </h3>
                <p className="text-gray-600">📧 {user.email}</p>
                <p className="text-gray-600 flex items-center gap-2">
                  🔖 Role:{" "}
                  <span
                    className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                      user.role === "admin"
                        ? "bg-red-100 text-red-600"
                        : user.role === "campaignOwner"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {user.role}
                  </span>
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  📅 Joined:{" "}
                  {new Date(user.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="mt-3 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm"
                >
                  Delete User
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No users found.</p>
        )}
      </section>
    </div>
  );
}
