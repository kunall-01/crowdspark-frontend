import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Explore() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    "All",
    "Health",
    "Education",
    "Environment",
    "Technology",
  ];

  useEffect(() => {
    let didCancel = false;

    const fetchCampaigns = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND}/campaigns`
        );
        if (!didCancel && Array.isArray(res.data)) {
          setCampaigns(res.data);
        }
      } catch (err) {
        if (!didCancel) {
          console.error("Error fetching campaigns:", err.message);
        }
      } finally {
        if (!didCancel) setLoading(false);
      }
    };

    fetchCampaigns();

    return () => {
      didCancel = true;
    };
  }, []);

  const filtered = campaigns.filter(
    (c) =>
      (activeCategory === "All" || c.category === activeCategory) &&
      c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-6 py-16 bg-gradient-to-br from-white to-green-50 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-3 tracking-tight">
          🌍 Explore Impactful Campaigns
        </h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto">
          Discover, support, and get inspired by change-makers across the world.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="max-w-4xl mx-auto mb-10 flex flex-col md:flex-row items-center gap-4">
        <input
          type="text"
          placeholder="Search campaigns..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:flex-1 px-5 py-3 rounded-xl border border-green-200 bg-white/80 text-black placeholder-black/60 shadow-inner focus:outline-none focus:ring-2 focus:ring-green-300 transition"
        />
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition border ${
                activeCategory === cat
                  ? "bg-green-600 text-white shadow-md border-green-600"
                  : "bg-white text-green-700 border-green-300 hover:bg-green-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Campaign Grid */}
      {loading ? (
        <p className="text-center text-gray-500">Loading campaigns...</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {filtered.map((camp) => (
            <div
              key={camp._id}
              className="bg-white/90 border border-green-100 backdrop-blur rounded-2xl overflow-hidden shadow-lg hover:shadow-green-200 transition-all group"
            >
              <img
                src={camp.image}
                alt={camp.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-5">
                <h3 className="text-lg font-semibold text-green-800 mb-1">
                  {camp.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {camp.description}
                </p>
                <div className="text-xs inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  {camp.category}
                </div>
                <div className="mt-3">
                  <div className="h-2 bg-green-100 rounded-full">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                      style={{
                        width: `${Math.min(
                          (camp.raisedAmount / camp.goalAmount) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    ₹{camp.raisedAmount} raised of ₹{camp.goalAmount}
                  </p>
                </div>
                <div className="flex gap-3 mt-4">
                  <Link
                    to={`/campaign/${camp._id}`}
                    className="flex-1 text-center px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white text-sm font-semibold rounded-full shadow-md hover:from-green-500 hover:to-green-600 transform hover:scale-105 transition"
                  >
                    View Details
                  </Link>

                  <Link
                    to={`/support/${camp._id}`}
                    className="flex-1 text-center px-4 py-2 bg-white border border-green-300 text-green-700 text-sm font-semibold rounded-full shadow-sm hover:bg-green-100 hover:text-green-700 transform hover:scale-105 transition"
                  >
                    Support
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && !loading && (
        <p className="text-center mt-10 text-gray-500">No campaigns found.</p>
      )}
    </div>
  );
}
