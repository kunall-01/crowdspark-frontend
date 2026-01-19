import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateCampaign() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    goalAmount: "",
    image: "",
    deadline: "",
    category: "",
    imageFile: null,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useFileUpload, setUseFileUpload] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, imageFile: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      let imageUrl = form.image;

      if (useFileUpload && form.imageFile) {
        const imageData = new FormData();
        imageData.append("image", form.imageFile);

        const uploadRes = await axios.post(
          `${import.meta.env.VITE_BACKEND}/upload`,
          imageData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );

        imageUrl = uploadRes.data.imageUrl;
        // console.log("✅ Image uploaded to Cloudinary:", imageUrl);
      }

      const payload = {
        title: form.title,
        description: form.description,
        goalAmount: form.goalAmount,
        deadline: form.deadline,
        category: form.category,
        image: imageUrl,
      };

      await axios.post(`${import.meta.env.VITE_BACKEND}/campaigns`, payload, {
        withCredentials: true,
      });

      setSuccess("🎉 Campaign launched successfully!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      console.error("❌ Campaign launch error:", err);
      setError(err.response?.data?.message || "Failed to launch campaign");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative max-w-3xl mx-auto px-6 py-20 text-green-900">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-green-50 via-white to-green-100 blur-xl opacity-70" />

      <h1 className="text-4xl font-extrabold mb-12 text-center text-green-800 tracking-tight drop-shadow-md">
        ✍️ Start a New Campaign
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white/80 backdrop-blur-xl border border-green-200 rounded-3xl shadow-2xl p-10 transition hover:shadow-green-300"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-bold text-green-800 mb-2">
            Campaign Title
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="E.g., Fund Solar Lights in Rural Areas"
            className="w-full px-5 py-3 rounded-xl border border-green-200 shadow-md bg-white"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold text-green-800 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Describe the purpose and who it helps..."
            className="w-full px-5 py-3 rounded-xl border border-green-200 shadow-md resize-none bg-white"
          />
        </div>

        {/* Goal Amount */}
        <div>
          <label className="block text-sm font-bold text-green-800 mb-2">
            Goal Amount (₹)
          </label>
          <input
            type="number"
            name="goalAmount"
            value={form.goalAmount}
            onChange={handleChange}
            required
            placeholder="E.g., 10000"
            className="w-full px-5 py-3 rounded-xl border border-green-200 shadow-md bg-white"
          />
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-sm font-bold text-green-800 mb-2">
            Deadline
          </label>
          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            required
            className="w-full px-5 py-3 rounded-xl border border-green-200 shadow-md bg-white"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-bold text-green-800 mb-2">
            Category
          </label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            placeholder="E.g., Health, Education"
            className="w-full px-5 py-3 rounded-xl border border-green-200 shadow-md bg-white"
          />
        </div>

        {/* Image Input Toggle */}
        <div>
          <label className="block text-sm font-bold text-green-800 mb-2">
            Cover Image
          </label>

          <div className="mb-3">
            <label className="flex items-center gap-4 cursor-pointer">
              <span className="text-sm font-medium text-green-800">
                Use File Upload
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={useFileUpload}
                  onChange={() => setUseFileUpload(!useFileUpload)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-green-200 rounded-full peer peer-checked:bg-green-500 transition-all"></div>
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-full shadow-md"></div>
              </div>
            </label>
          </div>

          {useFileUpload ? (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-5 py-2 rounded-xl border border-green-200 shadow bg-white text-green-800 
                       file:bg-white file:text-green-800 file:border file:border-green-300 
                       file:px-4 file:py-2 file:rounded-md file:shadow-sm"
            />
          ) : (
            <input
              type="url"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="E.g., https://images.unsplash.com/..."
              className="w-full px-5 py-3 rounded-xl border border-green-200 shadow-md bg-white"
            />
          )}
        </div>

        {/* Error & Success */}
        {error && <p className="text-red-600 font-medium">{error}</p>}
        {success && <p className="text-green-600 font-medium">{success}</p>}

        {/* Submit */}
        <div className="text-center pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-10 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg rounded-full shadow-lg hover:from-green-600 hover:to-green-700 transition-transform transform hover:scale-105"
          >
            🚀 Launch Campaign
          </button>
        </div>
      </form>
    </div>
  );
}
