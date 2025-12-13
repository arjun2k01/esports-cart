// src/pages/CheckoutPage.jsx
import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/AppProviders';
import { CreditCard, Truck, MapPin, User, Phone, Mail, ArrowRight, ShoppingBag, Lock, Package } from 'lucide-react';
import axiosInstance from '../lib/axios';
import { toast } from 'react-hot-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { cart, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    if (cart.length === 0) {
      navigate('/cart');
      return;
    }
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
    }
  }, [isAuthenticated, cart, user, navigate, setValue]);

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      const orderData = {
        orderItems: cart.map(item => ({
          product: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          qty: item.qty,
        })),
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          state: formData.state,
          country: formData.country || 'India',
        },
        paymentMethod: paymentMethod,
        itemsPrice: cartTotal,
        shippingPrice: cartTotal >= 500 ? 0 : 50,
        taxPrice: Math.round(cartTotal * 0.18),
        totalPrice: cartTotal >= 500 ? Math.round(cartTotal * 1.18) : Math.round(cartTotal * 1.18) + 50,
      };
      const { data } = await axiosInstance.post('/orders', orderData);
      if (data._id) {
        clearCart();
        toast.success('Order placed successfully!');
        navigate(`/order-confirmation/${data._id}`);
      }
    } catch (error) {
      console.error('Order placement error:', error);
      const message = error.response?.data?.message || 'Failed to place order. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const shippingPrice = cartTotal >= 500 ? 0 : 50;
  const taxPrice = Math.round(cartTotal * 0.18);
  const totalPrice = cartTotal + shippingPrice + taxPrice;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">CHECKOUT</span>
          </h1>
          <p className="text-gray-400">Complete your order</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-orange-500" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Contact Information</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                    <input type="text" {...register('name', { required: 'Name is required' })} className="w-full px-4 py-3 bg-black/50 border border-neutral-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all" placeholder="John Doe" />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                    <input type="email" {...register('email', { required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' } })} className="w-full px-4 py-3 bg-black/50 border border-neutral-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all" placeholder="john@example.com" />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number *</label>
                    <input type="tel" {...register('phone', { required: 'Phone number is required', pattern: { value: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit phone number' } })} className="w-full px-4 py-3 bg-black/50 border border-neutral-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all" placeholder="9876543210" />
                    {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
                  </div>
                </div>
              </div>
              <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                    <Truck className="w-5 h-5 text-orange-500" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Shipping Address</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Address *</label>
                    <textarea {...register('address', { required: 'Address is required' })} rows="3" className="w-full px-4 py-3 bg-black/50 border border-neutral-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all resize-none" placeholder="House no., Street name, Area" />
                    {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">City *</label>
                      <input type="text" {...register('city', { required: 'City is required' })} className="w-full px-4 py-3 bg-black/50 border border-neutral-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all" placeholder="Mumbai" />
                      {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">State *</label>
                      <input type="text" {...register('state', { required: 'State is required' })} className="w-full px-4 py-3 bg-black/50 border border-neutral-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all" placeholder="Maharashtra" />
                      {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Postal Code *</label>
                      <input type="text" {...register('postalCode', { required: 'Postal code is required', pattern: { value: /^[0-9]{6}$/, message: 'Please enter a valid 6-digit postal code' } })} className="w-full px-4 py-3 bg-black/50 border border-neutral-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all" placeholder="400001" />
                      {errors.postalCode && <p className="mt-1 text-sm text-red-500">{errors.postalCode.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Country *</label>
                      <input type="text" {...register('country')} defaultValue="India" className="w-full px-4 py-3 bg-black/50 border border-neutral-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all" placeholder="India" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-orange-500" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Payment Method</h2>
                </div>
                <div className="space-y-3">
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-orange-500 bg-orange-500/5' : 'border-neutral-800 hover:border-neutral-700'}`}>
                    <input type="radio" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-orange-500" />
                    <div className="flex-1">
                      <p className="font-semibold text-white">Cash on Delivery</p>
                      <p className="text-sm text-gray-400">Pay when you receive</p>
                    </div>
                    <Package className="w-6 h-6 text-gray-400" />
                  </label>
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-orange-500 bg-orange-500/5' : 'border-neutral-800 hover:border-neutral-700'}`}>
                    <input type="radio" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-orange-500" />
                    <div className="flex-1">
                      <p className="font-semibold text-white">Card Payment</p>
                      <p className="text-sm text-gray-400">Credit / Debit / UPI</p>
                    </div>
                    <CreditCard className="w-6 h-6 text-gray-400" />
                  </label>
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6 sticky top-24">
                <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item._id} className="flex gap-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1">
                        <p className="text-white font-semibold text-sm line-clamp-1">{item.name}</p>
                        <p className="text-gray-400 text-sm">Qty: {item.qty}</p>
                        <p className="text-orange-500 font-bold">₹{item.price * item.qty}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 pt-4 border-t border-neutral-800">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-white font-semibold">₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                    <span className={shippingPrice === 0 ? 'text-green-500 font-semibold' : 'text-white font-semibold'}>
                      {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Tax (18%)</span>
                    <span className="text-white font-semibold">₹{taxPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-neutral-800">
                    <span className="text-xl font-bold text-white">Total</span>
                    <span className="text-2xl font-bold text-orange-500">₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      PLACING ORDER...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      PLACE ORDER
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 text-center mt-4">
                  Your payment information is secure and encrypted
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
