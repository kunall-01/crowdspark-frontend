import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function CampaignDetails() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController(); // ✅ Add abort controller to cancel if needed

    const fetchCampaign = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND}/campaigns/${id}`,
          { signal: controller.signal } // ✅ Use signal for cancellation
        );
        if (res.data && res.data._id) {
          setCampaign(res.data);
        }
      } catch (err) {
        if (axios.isCancel(err)) {
          // console.log("❌ Request cancelled:", err.message);
        } else {
          console.error("Failed to fetch campaign:", err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();

    return () => controller.abort(); // ✅ Clean up request on unmount
  }, [id]);

  if (loading)
    return <div className="text-center py-20">Loading campaign...</div>;

  if (!campaign) {
    return (
      <div className="text-center py-20 text-red-500">
        Campaign not found.{" "}
        <Link to="/" className="text-blue-500 underline">
          Go back
        </Link>
      </div>
    );
  }

  const progress = Math.min(
    (campaign.raisedAmount / campaign.goalAmount) * 100,
    100
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-gray-800">
      {/* Image */}
      <div className="rounded-xl overflow-hidden shadow-lg mb-6 relative group">
        <img
          src={campaign.image}
          alt={campaign.title}
          className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
        />
        <div className="absolute top-4 left-4 bg-white text-green-600 text-sm font-semibold px-3 py-1 rounded-full shadow">
          Campaign #{id}
        </div>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-extrabold mb-4">{campaign.title}</h1>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          ₹{campaign.raisedAmount} raised of ₹{campaign.goalAmount} goal
        </p>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-sm text-gray-700">
        <p>
          <span className="font-medium">Category:</span> {campaign.category}
        </p>
        <p>
          <span className="font-medium">Goal:</span> ₹{campaign.goalAmount}
        </p>
        <p>
          <span className="font-medium">Raised:</span> ₹{campaign.raisedAmount}
        </p>
        <p>
          <span className="font-medium">Status:</span> {campaign.status}
        </p>
        <p>
          <span className="font-medium">Deadline:</span>{" "}
          {new Date(campaign.deadline).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Description */}
      <p className="text-lg leading-relaxed mb-6">{campaign.description}</p>

      {/* Creator */}
      <div className="text-sm text-gray-600 mb-10">
        <span className="font-medium">Created by:</span>{" "}
        {campaign.owner?.username || "Campaign Owner"}
      </div>

      {/* CTA Buttons */}
      <div className="text-center">
        <Link
          to={`/explore`}
          className="inline-block px-8 py-3 text-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105"
        >
          Back
        </Link>
        &nbsp;&nbsp;&nbsp;
        <Link
          to={`/support/${campaign._id}`}
          className="inline-block px-8 py-3 text-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105"
        >
          Support Now 🚀
        </Link>
      </div>
    </div>
  );
}
