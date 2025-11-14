// src/pages/ProfilePage.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Phone, MapPin, Edit2, Save, ShoppingBag, Heart, Award } from "lucide-react";

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const stats = [
    { icon: <ShoppingBag size={24} />, value: "12", label: "Orders", color: "text-gaming-orange" },
    { icon: <Heart size={24} />, value: "8", label: "Wishlist", color: "text-out-red" },
    { icon: <Award size={24} />, value: "Champion", label: "Status", color: "text-gaming-gold" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await updateProfile(formData);
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-gaming-darker py-12">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-black text-white uppercase mb-2">
            My <span className="text-gaming-gold">Profile</span>
          </h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-1">
            <div className="bg-surface-dark border border-gray-800 rounded-2xl p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-gaming-gold to-gaming-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={48} className="text-black" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white mb-1">{user?.name || "Gamer"}</h2>
              <p className="text-gray-400 text-sm mb-4">{user?.email || "email@example.com"}</p>
              <div className="inline-flex items-center gap-2 bg-gaming-gold/10 border border-gaming-gold px-4 py-2 rounded-full">
                <Award className="text-gaming-gold" size={16} />
                <span className="text-gaming-gold font-bold text-sm">CHAMPION</span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-surface-dark border border-gray-800 rounded-xl p-4 flex items-center gap-4 hover:border-gaming-gold transition-all">
                  <div className={`w-12 h-12 bg-gaming-darker rounded-lg flex items-center justify-center ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-display text-2xl font-black text-white">{stat.value}</div>
                    <div className="text-gray-400 text-sm font-semibold">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-surface-dark border border-gray-800 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-2xl font-bold text-white uppercase">Account Details</h3>
                {!editing ? (
                  <button onClick={() => setEditing(true)} className="flex items-center gap-2 bg-gaming-orange hover:bg-gaming-gold text-black px-4 py-2 rounded-lg font-bold transition-all">
                    <Edit2 size={18} />Edit
                  </button>
                ) : (
                  <button onClick={handleSave} className="flex items-center gap-2 bg-stock-green hover:bg-green-500 text-black px-4 py-2 rounded-lg font-bold transition-all">
                    <Save size={18} />Save
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-400 font-semibold mb-2 text-sm flex items-center gap-2">
                    <User size={16} />Full Name
                  </label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={!editing}
                    className="w-full bg-gaming-darker border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-gaming-gold transition disabled:opacity-50" />
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold mb-2 text-sm flex items-center gap-2">
                    <Mail size={16} />Email Address
                  </label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={!editing}
                    className="w-full bg-gaming-darker border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-gaming-gold transition disabled:opacity-50" />
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold mb-2 text-sm flex items-center gap-2">
                    <Phone size={16} />Phone Number
                  </label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} disabled={!editing} placeholder="Enter phone number"
                    className="w-full bg-gaming-darker border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-gaming-gold transition disabled:opacity-50" />
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold mb-2 text-sm flex items-center gap-2">
                    <MapPin size={16} />Address
                  </label>
                  <textarea name="address" value={formData.address} onChange={handleChange} disabled={!editing} rows="3" placeholder="Enter your address"
                    className="w-full bg-gaming-darker border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-gaming-gold transition disabled:opacity-50 resize-none" />
                </div>
              </div>
            </div>

            <div className="mt-6 bg-surface-dark border border-gray-800 rounded-2xl p-8">
              <h3 className="font-display text-2xl font-bold text-white uppercase mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className="bg-gaming-darker border border-gray-700 hover:border-gaming-gold text-white px-6 py-4 rounded-xl font-bold uppercase transition-all text-left">
                  View Orders
                </button>
                <button className="bg-gaming-darker border border-gray-700 hover:border-gaming-gold text-white px-6 py-4 rounded-xl font-bold uppercase transition-all text-left">
                  My Wishlist
                </button>
                <button className="bg-gaming-darker border border-gray-700 hover:border-gaming-gold text-white px-6 py-4 rounded-xl font-bold uppercase transition-all text-left">
                  Change Password
                </button>
                <button className="bg-gaming-darker border border-out-red hover:border-out-red text-out-red px-6 py-4 rounded-xl font-bold uppercase transition-all text-left">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
