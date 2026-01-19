import { useEffect, useState } from "react";
import axios from "axios";
import CampaignCard from "../components/CampaignCard";

export default function Home() {
  const [campaigns, setCampaigns] = useState([]);

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
      }
    };

    fetchCampaigns();

    return () => {
      didCancel = true;
    };
  }, []);

  console.log(campaigns)

  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-28 bg-gradient-to-br from-green-50 to-white text-center">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-4xl mx-auto z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">
            Fuel Ideas. Fund Dreams. Change Lives.
          </h1>
          <p className="text-lg md:text-xl mb-6 text-gray-700 animate-fade-in-up animation-delay-300">
            CrowdSpark empowers dreamers to turn their ideas into reality. Back
            a cause or start your own today.
          </p>
          <a
            href="/create"
            className="relative inline-block px-8 py-3 text-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 overflow-hidden group"
          >
            <span className="relative z-10">Start a Campaign</span>
            <span className="absolute inset-0 w-full h-full bg-white opacity-10 group-hover:opacity-20 transition duration-700 blur-lg" />
            <span className="absolute left-0 top-0 w-full h-full transform -translate-x-full bg-white opacity-30 group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">Why Choose CrowdSpark?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg shadow hover:shadow-xl transition duration-300">
              <div className="text-green-600 text-4xl mb-4 animate-bounce">
                🚀
              </div>
              <h3 className="text-xl font-semibold mb-2">Launch Fast</h3>
              <p className="text-gray-600">
                Create and publish your campaign in minutes with our easy-to-use
                interface.
              </p>
            </div>
            <div className="p-6 rounded-lg shadow hover:shadow-xl transition duration-300">
              <div className="text-green-600 text-4xl mb-4 animate-bounce">
                🌍
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
              <p className="text-gray-600">
                Connect with backers from all around the world to support your
                cause.
              </p>
            </div>
            <div className="p-6 rounded-lg shadow hover:shadow-xl transition duration-300">
              <div className="text-green-600 text-4xl mb-4 animate-bounce">
                💡
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovative Ideas</h3>
              <p className="text-gray-600">
                Support creative projects that are solving real-world problems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-16 bg-green-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">Our Impact</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-white shadow-md hover:scale-105 transition">
              <p className="text-4xl font-bold text-green-600 mb-2">1.2M+</p>
              <p className="text-gray-700">Total Raised</p>
            </div>
            <div className="p-6 rounded-lg bg-white shadow-md hover:scale-105 transition">
              <p className="text-4xl font-bold text-green-600 mb-2">15K+</p>
              <p className="text-gray-700">Campaigns Created</p>
            </div>
            <div className="p-6 rounded-lg bg-white shadow-md hover:scale-105 transition">
              <p className="text-4xl font-bold text-green-600 mb-2">60K+</p>
              <p className="text-gray-700">Active Backers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Campaigns Section */}
      {/* Campaigns Section */}
      <section className="px-4 py-16 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">🔥 Trending Campaigns</h2>

        {campaigns.filter((c) => c.raisedAmount / c.goalAmount > 0.5).length >
        0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns
              .filter((c) => c.raisedAmount / c.goalAmount > 0.5)
              .map((campaign) => (
                <div
                  key={campaign._id}
                  className="relative bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden rounded-t-xl">
                    <img
                      src={campaign.image}
                      alt={campaign.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  </div>
                  <div className="relative z-10 p-5 -mt-6 mx-3 bg-white rounded-xl shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">
                      {campaign.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 mb-3">
                      {campaign.description}
                    </p>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            (campaign.raisedAmount / campaign.goalAmount) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-green-700">
                        ₹{campaign.raisedAmount.toLocaleString()}
                      </span>{" "}
                      raised of{" "}
                      <span className="text-gray-500">
                        ₹{campaign.goalAmount.toLocaleString()}
                      </span>
                    </p>
                    <div className="mt-4 flex gap-3">
                      <a
                        href={`/campaign/${campaign._id}`}
                        className="flex-1 text-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                      >
                        View Details
                      </a>
                      <a
                        href={`/support/${campaign._id}`}
                        className="flex-1 text-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                      >
                        Support Now
                      </a>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-600">
            No trending campaigns right now. Check back soon!
          </p>
        )}
      </section>

      {/* Testimonial Section */}
      <section className="px-4 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">What Our Backers Say</h2>
          <p className="text-gray-600 mb-10">
            People around the world trust CrowdSpark to support change-making
            ideas.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow text-left">
              <p className="mb-4">
                "Backing a project on CrowdSpark feels like investing in a
                better world."
              </p>
              <span className="font-semibold">– Ananya S., Mumbai</span>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-left">
              <p className="mb-4">
                "The campaign I supported exceeded its goal — and I got updates
                every step."
              </p>
              <span className="font-semibold">– Karan P., Delhi</span>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-left">
              <p className="mb-4">
                "We raised enough funds for our robotics lab in just two weeks!"
              </p>
              <span className="font-semibold">– Sneha M., Bengaluru</span>
            </div>
          </div>
        </div>
      </section>
      {/* Ripple of Impact Section */}
      <section className="relative py-24 bg-gradient-to-br from-green-50 to-white overflow-hidden">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            🌊 The Ripple of Impact
          </h2>
          <p className="text-gray-600 mb-10 text-lg">
            One small act of support creates waves across lives, communities,
            and the world.
          </p>

          <div className="relative flex items-center justify-center h-64">
            <div className="absolute w-24 h-24 bg-green-400 rounded-full opacity-20 animate-ripple" />
            <div className="absolute w-24 h-24 bg-green-400 rounded-full opacity-20 animate-ripple delay-300" />
            <div className="absolute w-24 h-24 bg-green-400 rounded-full opacity-20 animate-ripple delay-600" />
            <div className="relative w-16 h-16 bg-green-600 rounded-full shadow-lg flex items-center justify-center text-white text-xl font-bold z-10">
              You
            </div>
          </div>

          <p className="mt-10 text-gray-700">
            Your single click, your little support,{" "}
            <span className="text-green-700 font-semibold">
              changes everything.
            </span>
          </p>
        </div>
      </section>

      {/* CrowdSpark Galaxy Section */}
      <section className="relative px-4 py-32 bg-black text-white overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-60 animate-float-star"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `10s`,
              }}
            />
          ))}
        </div>
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <h2 className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-green-500">
            Welcome to the CrowdSpark Galaxy
          </h2>
          <p className="text-lg mb-8 text-gray-200">
            Each star represents an idea, a dream, a movement — floating until
            it finds its spark.
          </p>
          <a
            href="/create"
            className="inline-block px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-full shadow-lg hover:from-green-600 hover:to-green-700 transition duration-300"
          >
            Launch Your Spark 🚀
          </a>
        </div>
      </section>
    </div>
  );
}
