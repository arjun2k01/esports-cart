// src/pages/ProfilePage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, Save, Loader2, Package, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    wishlistItems: 0,
    cartItems: 0,
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        postalCode: user.postalCode || '',
        country: user.country || 'India',
      });
    }
  }, [user]);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    setStats({
      totalOrders: 0,
      wishlistItems: wishlist.length,
      cartItems: cart.reduce((total, item) => total + item.quantity, 0),
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to update profile');
        navigate('/login');
        return;
      }

      const response = await fetch('https://esports-cart.onrender.com/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      toast.success('Profile updated successfully!');
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const formatJoinDate = () => {
    if (!user?.createdAt) return 'Recently';
    return new Date(user.createdAt).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <div className="min-h-screen bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            MY <span className="text-orange-500">PROFILE</span>
          </h1>
          <p className="text-neutral-400">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white mb-1">{user?.name || 'User'}</h2>
                <p className="text-neutral-400 text-sm">{user?.email}</p>
              </div>

              {/* Stats */}
              <div className="space-y-3 mb-6">
                <div className="bg-neutral-900/50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-neutral-400 text-sm">Total Orders</p>
                      <p className="text-white font-bold text-lg">{stats.totalOrders}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-900/50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-neutral-400 text-sm">Wishlist</p>
                      <p className="text-white font-bold text-lg">{stats.wishlistItems}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-900/50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-neutral-400 text-sm">Member Since</p>
                      <p className="text-white font-semibold">{formatJoinDate()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/orders')}
                  className="w-full bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300"
                >
                  View Orders
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-500 px-4 py-3 rounded-lg font-semibold transition-all duration-300 border border-red-500/30"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Profile Information Form */}
          <div className="lg:col-span-2">
            <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-orange-500" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-400 text-sm mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!editMode}
                        className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                        placeholder="Enter your name"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-400 text-sm mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={true}
                          className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                          placeholder="your@email.com"
                        />
                      </div>
                      <p className="text-neutral-500 text-xs mt-1">Email cannot be changed</p>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-neutral-400 text-sm mb-2">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={!editMode}
                          className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    Address Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-neutral-400 text-sm mb-2">Street Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!editMode}
                        className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                        placeholder="Enter your address"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-neutral-400 text-sm mb-2">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          disabled={!editMode}
                          className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                          placeholder="City"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-400 text-sm mb-2">State</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          disabled={!editMode}
                          className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                          placeholder="State"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-neutral-400 text-sm mb-2">Postal Code</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          disabled={!editMode}
                          className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                          placeholder="Postal Code"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-400 text-sm mb-2">Country</label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          disabled={!editMode}
                          className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 disabled:opacity-50
                          cursor-not-allowed transition-colors duration-300"
                          placeholder="Country"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                {editMode && (
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      disabled={loading}
                      className="px-6 py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
