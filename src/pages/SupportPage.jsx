import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import RazorpayCheckout from "../components/RazorpayCheckout";
import socket from "../components/Socket";

export default function SupportPage() {
  const { id } = useParams();

  const [campaign, setCampaign] = useState(null);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loadingCampaign, setLoadingCampaign] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [hasAttempted, setHasAttempted] = useState(false);

  const fetchCampaign = useCallback(async () => {
    setLoadingCampaign(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND}/campaigns/${id}`
      );
      const data = await res.json();
      setCampaign(data && data._id ? data : null);
    } catch (err) {
      console.error("Error fetching campaign:", err);
      setCampaign(null);
    } finally {
      setLoadingCampaign(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCampaign();
  }, [fetchCampaign]);

  const progress = campaign
    ? Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100)
    : 0;

  if (loadingCampaign) {
    return (
      <div className="flex items-center justify-center min-h-screen text-green-600 text-xl font-semibold">
        <svg
          className="animate-spin mr-3 h-6 w-6 text-green-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        Loading campaign details...
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-center py-20 text-red-500">
        Campaign not found or still loading.
      </div>
    );
  }

  return (
    <div className="relative max-w-2xl mx-auto px-6 py-20 text-green-900">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-green-50 via-white to-green-100 blur-xl opacity-70" />

      <h1 className="text-4xl font-extrabold mb-10 text-center text-green-800 tracking-tight drop-shadow-md">
        🌱 Support This Campaign
      </h1>

      {/* Campaign Info */}
      <div className="bg-white/60 backdrop-blur-md border border-green-200 rounded-3xl shadow-2xl p-8 mb-12 transition hover:shadow-green-200">
        <h2 className="text-2xl font-semibold mb-2 text-green-800">
          {campaign.title}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Campaign ID: {campaign._id}
        </p>

        <div className="h-3 w-full bg-green-100 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-green-800 font-medium">
          ₹{campaign.raisedAmount} raised of ₹{campaign.goalAmount} goal
        </p>
      </div>

      {/* Donation Form */}
      <div className="space-y-6 bg-white/70 backdrop-blur-lg border border-green-100 rounded-3xl shadow-lg p-8">
        <div>
          <label className="block text-sm font-semibold text-green-800 mb-1">
            💸 Amount (₹)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setHasAttempted(true);
              setFeedback("");
            }}
            placeholder="Enter amount"
            className="w-full px-4 py-2 rounded-xl border border-green-200 bg-white/80 text-green-900 placeholder-green-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-green-300 transition"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-green-800 mb-1">
            📝 Message (optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Say something encouraging..."
            className="w-full px-4 py-2 rounded-xl border border-green-200 bg-white/80 text-green-900 placeholder-green-400 shadow-inner resize-none focus:outline-none focus:ring-2 focus:ring-green-300 transition"
            rows="3"
          />
        </div>

        {feedback && (
          <div
            className={`text-center text-sm font-medium ${
              feedback.includes("Thank you") ? "text-green-700" : "text-red-600"
            }`}
          >
            {feedback}
          </div>
        )}

        <div className="text-center pt-4">
          {amount && parseInt(amount) > 0 ? (
            <RazorpayCheckout
              amount={Number(amount)}
              campaignId={id}
              message={message}
              onSuccess={() => {
                socket.emit("donationMade", {
                  campaignId: id,
                  amount: Number(amount),
                  message,
                });

                setAmount("");
                setMessage("");
                setHasAttempted(false);
                setFeedback("🎉 Thank you for your support!");
                fetchCampaign();
              }}
            />
          ) : (
            hasAttempted && (
              <p className="text-sm text-red-600">
                Please enter a valid amount
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
}
