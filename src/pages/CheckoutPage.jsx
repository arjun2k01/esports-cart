// src/pages/CheckoutPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/AppProviders";
import { CreditCard, Loader2, Lock } from "lucide-react";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Must be 10 digits";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Must be 6 digits";
    if (!formData.cardNumber.trim()) newErrors.cardNumber = "Card number is required";
    if (!formData.cardExpiry.trim()) newErrors.cardExpiry = "Expiry is required";
    if (!formData.cardCVC.trim()) newErrors.cardCVC = "CVC is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Please fill all fields correctly");
      return;
    }
    setLoading(true);
    
    // Simulate order placement
    setTimeout(() => {
      clearCart();
      alert("Order placed successfully! 🎉");
      navigate("/");
      setLoading(false);
    }, 2000);
  };

  if (cart.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-gaming-darker py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-black text-white uppercase mb-2">
            Secure <span className="text-gaming-gold">Checkout</span>
          </h1>
          <p className="text-gray-400">Complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-surface-dark border border-gray-800 rounded-xl p-6">
                <h2 className="font-display text-2xl font-bold text-white uppercase mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gaming-gold text-black rounded-full flex items-center justify-center font-black text-sm">1</span>
                  Shipping Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 font-semibold mb-2 text-sm">Full Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange}
                      className={`w-full bg-gaming-darker border ${errors.name ? 'border-out-red' : 'border-gray-700'} text-white px-4 py-3 rounded-lg focus:outline-none focus:border-gaming-gold transition`}
                      placeholder="Enter your name" />
                    {errors.name && <p className="text-out-red text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-400 font-semibold mb-2 text-sm">Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                      className={`w-full bg-gaming-darker border ${errors.email ? 'border-out-red' : 'border-gray-700'} text-white px-4 py-3 rounded-lg focus:outline-none focus:border-gaming-gold transition`}
                      placeholder="your@email.com" />
                    {errors.email && <p className="text-out-red text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-400 font-semibold mb-2 text-sm">Phone *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                      className={`w-full bg-gaming-darker border ${errors.phone ? 'border-out-red' : 'border-gray-700'} text-white px-4 py-3 rounded-lg focus:outline-none focus:border-gaming-gold transition`}
                      placeholder="10-digit number" maxLength="10" />
                    {errors.phone && <p className="text-out-red text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-400 font-semibold mb-2 text-sm">City *</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange}
                      className={`w-full bg-gaming-darker border ${errors.city ? 'border-out-red' : 'border-gray-700'} text-white px-4 py-3 rounded-lg focus:outline-none focus:border-gaming-gold transition`}
                      placeholder="Your city" />
                    {errors.city && <p className="text-out-red text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-400 font-semibold mb-2 text-sm">Address *</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange}
                      className={`w-full bg-gaming-darker border ${errors.address ? 'border-out-red' : 'border-gray-700'} text-white px-4 py-3 rounded-lg focus:outline-none focus:border-gaming-gold transition`}
                      placeholder="Street address" />
                    {errors.address && <p className="text-out-red text-xs mt-1">{errors.address}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-400 font-semibold mb-2 text-sm">Pincode *</label>
                    <input type="text" name="pincode" value={formData.pincode} onChange={handleChange}
                      className={`w-full bg-gaming-darker border ${errors.pincode ? 'border-out-red' : 'border-gray-700'} text-white px-4 py-3 rounded-lg focus:outline-none focus:border-gaming-gold transition`}
                      placeholder="6-digit pincode" maxLength="6" />
                    {errors.pincode && <p className="text-out-red text-xs mt-1">{errors.pincode}</p>}
                  </div>
                </div>
              </div>

              <div className="bg-surface-dark border border-gray-800 rounded-xl p-6">
                <h2 className="font-display text-2xl font-bold text-white uppercase mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gaming-gold text-black rounded-full flex items-center justify-center font-black text-sm">2</span>
                  Payment Details
                </h2>
                <div className="flex items-center gap-2 bg-gaming-gold/10 border border-gaming-gold px-4 py-3 rounded-lg mb-6">
                  <Lock className="text-gaming-gold" size={20} />
                  <span className="text-gaming-gold font-semibold text-sm">Secure encrypted payment</span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-gray-400 font-semibold mb-2 text-sm">Card Number *</label>
                    <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleChange}
                      className={`w-full bg-gaming-darker border ${errors.cardNumber ? 'border-out-red' : 'border-gray-700'} text-white px-4 py-3 rounded-lg focus:outline-none focus:border-gaming-gold transition`}
                      placeholder="1234 5678 9012 3456" maxLength="19" />
                    {errors.cardNumber && <p className="text-out-red text-xs mt-1">{errors.cardNumber}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 font-semibold mb-2 text-sm">Expiry *</label>
                      <input type="text" name="cardExpiry" value={formData.cardExpiry} onChange={handleChange}
                        className={`w-full bg-gaming-darker border ${errors.cardExpiry ? 'border-out-red' : 'border-gray-700'} text-white px-4 py-3 rounded-lg focus:outline-none focus:border-gaming-gold transition`}
                        placeholder="MM/YY" maxLength="5" />
                      {errors.cardExpiry && <p className="text-out-red text-xs mt-1">{errors.cardExpiry}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-400 font-semibold mb-2 text-sm">CVC *</label>
                      <input type="text" name="cardCVC" value={formData.cardCVC} onChange={handleChange}
                        className={`w-full bg-gaming-darker border ${errors.cardCVC ? 'border-out-red' : 'border-gray-700'} text-white px-4 py-3 rounded-lg focus:outline-none focus:border-gaming-gold transition`}
                        placeholder="123" maxLength="3" />
                      {errors.cardCVC && <p className="text-out-red text-xs mt-1">{errors.cardCVC}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-gaming-orange hover:bg-gaming-gold text-black py-4 rounded-xl font-bold uppercase transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">
                {loading ? <><Loader2 className="animate-spin" size={20} />Processing...</> : <><CreditCard size={20} />Place Order</>}
              </button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-surface-dark border border-gray-800 rounded-xl p-6 sticky top-24">
              <h2 className="font-display text-2xl font-bold text-white uppercase mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div key={item._id} className="flex gap-3">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm line-clamp-1">{item.name}</p>
                      <p className="text-gray-400 text-sm">Qty: {item.qty}</p>
                    </div>
                    <p className="text-gaming-gold font-bold">₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-700 pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal:</span>
                  <span className="text-white font-bold">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping:</span>
                  <span className="text-stock-green font-bold">FREE</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-700">
                  <span className="font-display text-xl font-bold text-white">Total:</span>
                  <span className="font-display text-2xl font-black text-gaming-gold">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
