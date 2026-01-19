import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import socket from "../../components/Socket";

export default function UserDashboard() {
  const user = useSelector((state) => state.auth.user);
  const [campaigns, setCampaigns] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState(null);
  const [requestLoading, setRequestLoading] = useState(false);
  const [hasRequestedUpgrade, setHasRequestedUpgrade] = useState(false); // NEW

  const sendUpgradeRequest = async () => {
    try {
      setRequestLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND}/request-campaign-owner`,
        {},
        { withCredentials: true }
      );
      setRequestStatus("Request sent successfully ✅");
      setHasRequestedUpgrade(true); // NEW
    } catch (err) {
      setRequestStatus(
        err.response?.data?.message || "Failed to send request ❌"
      );
    } finally {
      setRequestLoading(false);
    }
  };

  const checkUpgradeRequestStatus = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND}/check-upgrade-request`,
        { withCredentials: true }
      );
      setHasRequestedUpgrade(res.data?.requested || false);
    } catch (err) {
      console.error("Failed to check upgrade request:", err);
    }
  };

  const fallbackCampaigns = [
    {
      _id: "demo1",
      title: "Plant Trees for the Planet 🌳",
      image:
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1313&auto=format&fit=crop",
      raisedAmount: 4500,
      goalAmount: 10000,
      isDemo: true,
    },
    {
      _id: "demo2",
      title: "Clean Drinking Water Initiative 🚰",
      image:
        "https://images.unsplash.com/photo-1637905351378-67232a5f0c9b?q=80&w=1025&auto=format&fit=crop",
      raisedAmount: 8200,
      goalAmount: 15000,
      isDemo: true,
    },
  ];

  const fallbackContributions = [
    {
      id: "fake1",
      title: "Support Rural Education 🎓",
      amount: 1000,
      date: "2025-06-01",
      isDemo: true,
    },
    {
      id: "fake2",
      title: "Emergency Relief Fund 🆘",
      amount: 500,
      date: "2025-06-15",
      isDemo: true,
    },
  ];

  const fetchDashboardData = async () => {
    try {
      const [campaignRes, contributionRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND}/my-campaigns`, {
          withCredentials: true,
        }),
        axios.get(`${import.meta.env.VITE_BACKEND}/my-contributions`, {
          withCredentials: true,
        }),
      ]);

      const realCampaigns =
        Array.isArray(campaignRes.data) && campaignRes.data.length > 0
          ? campaignRes.data
          : fallbackCampaigns;

      let realContributions =
        Array.isArray(contributionRes.data) && contributionRes.data.length > 0
          ? contributionRes.data
          : fallbackContributions;

      realContributions.sort(
        (a, b) =>
          new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
      );

      setCampaigns(realCampaigns);
      setContributions(realContributions);
    } catch (err) {
      console.error("❌ Failed to fetch dashboard data:", err);
      setCampaigns(fallbackCampaigns);
      setContributions(fallbackContributions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    checkUpgradeRequestStatus(); // NEW

    if (user && user._id) {
      // console.log("📡 Joining personal socket room:", user._id);
      socket.emit("join", user._id);

      socket.on("new_backing", (data) => {
        // console.log("🔔 Real-time donation received via 'new_backing':", data);
        fetchDashboardData();
      });
    }

    return () => {
      if (user && user._id) {
        socket.emit("leave", user._id);
      }
      socket.off("new_backing");
    };
  }, [user]);

  if (loading)
    return (
      <div className="p-8 text-center text-green-700">Loading dashboard...</div>
    );

  const isCampaignOwner =
    user?.role === "campaignOwner" || user?.role === "admin";

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-green-50 to-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl p-6 hidden md:block rounded-tr-3xl">
        <h2 className="text-2xl font-extrabold text-green-600 mb-8 tracking-wide">
          Dashboard
        </h2>
        <nav className="space-y-4">
          {isCampaignOwner && (
            <a
              href="#campaigns"
              className="block text-gray-700 hover:text-green-600 font-medium transition"
            >
              📢 My Campaigns
            </a>
          )}
          <a
            href="#contributions"
            className="block text-gray-700 hover:text-green-600 font-medium transition"
          >
            💸 My Contributions
          </a>
          <a
            href="/"
            className="block text-gray-700 hover:text-green-600 font-medium transition"
          >
            🏠 Home
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-10 py-10">
        <h1 className="text-4xl font-extrabold text-green-800 mb-8">
          👋 Hello, {user?.username || "User"}!
        </h1>

        {/* Campaigns */}
        {isCampaignOwner && (
          <section id="campaigns" className="mb-16">
            <h2 className="text-2xl font-bold text-green-700 mb-4">
              Your Campaigns
            </h2>
            {campaigns.length === 0 ? (
              <p className="text-gray-500">You have no active campaigns.</p>
            ) : (
              <div className="grid gap-8 md:grid-cols-2">
                {campaigns.map((c) => (
                  <div
                    key={c._id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-green-200 transition"
                  >
                    <img
                      src={c.image}
                      alt={c.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-green-800 mb-2">
                        {c.title}
                        {c.isDemo && (
                          <span className="text-xs text-gray-400 ml-2">
                            (demo)
                          </span>
                        )}
                      </h3>
                      <div className="h-2 bg-green-100 rounded-full mb-2">
                        <div
                          className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                          style={{
                            width: `${Math.min(
                              (c.raisedAmount / c.goalAmount) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600">
                        ₹{c.raisedAmount} raised of ₹{c.goalAmount} (
                        {Math.round((c.raisedAmount / c.goalAmount) * 100)}%)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Backer Upgrade Request */}
        {user?.role === "backer" && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-green-700 mb-3">
              Want to start a campaign?
            </h2>
            <p className="text-gray-600 mb-4">
              Click below to request permission from the admin to create your
              own campaigns.
            </p>

            {hasRequestedUpgrade ? (
              <button
                disabled
                className="px-6 py-2 bg-yellow-100 text-yellow-700 rounded-full shadow cursor-not-allowed"
              >
                Request Pending ⏳
              </button>
            ) : (
              <button
                onClick={sendUpgradeRequest}
                disabled={requestLoading}
                className="px-6 py-2 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition"
              >
                {requestLoading
                  ? "Sending..."
                  : "Request Campaign Owner Access"}
              </button>
            )}

            {requestStatus && (
              <p className="mt-3 text-sm text-green-700 font-medium">
                {requestStatus}
              </p>
            )}
          </div>
        )}

        {/* Contributions */}
        <section id="contributions">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            Your Contributions
          </h2>
          {contributions.length === 0 ? (
            <p className="text-gray-500">
              You haven't contributed to any campaigns yet.
            </p>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <table className="w-full table-auto">
                <thead className="bg-green-100 text-green-700 text-left text-sm uppercase">
                  <tr>
                    <th className="px-6 py-4">Campaign</th>
                    <th className="px-6 py-4" style={{ textAlign: "center" }}>
                      Amount
                    </th>
                    <th className="px-6 py-4" style={{ textAlign: "end" }}>
                      Date / Invoice
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">
                  {contributions.map((c) => (
                    <tr key={c._id || c.id} className="border-t">
                      <td className="px-6 py-4">
                        {c.title || c.campaign?.title}
                        {c.isDemo && (
                          <span className="text-xs text-gray-400 ml-2">
                            (demo)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4" style={{ textAlign: "center" }}>
                        ₹{c.amount}
                      </td>
                      <td className="px-6 py-4" style={{ textAlign: "end" }}>
                        {c.date || c.createdAt
                          ? new Date(c.date || c.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )
                          : "N/A"}
                        {!c.isDemo && (
                          <a
                            href={`${import.meta.env.VITE_BACKEND}/invoice/${
                              c._id || c.id
                            }`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:underline ml-4 text-sm"
                          >
                            📄 Download Invoice
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
