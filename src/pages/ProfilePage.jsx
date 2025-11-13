// src/pages/ProfilePage.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "../lib/axios";

const ProfilePage = () => {
  const { user, setUser } = useAuth(); // we will update context
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.put("/users/profile", { name, email });
      setUser(res.data); // update context user
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }

    setLoading(false);
  };

  if (!user)
    return (
      <div className="p-6 text-center text-red-600">
        Unable to load profile.
      </div>
    );

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">My Profile</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}
      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-6 bg-white p-6 rounded-xl shadow">
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Full Name</label>
          <input
            type="text"
            className="w-full p-3 border rounded focus:outline-none"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1 font-medium">Email</label>
          <input
            type="email"
            className="w-full p-3 border rounded focus:outline-none"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
