import React, { useState } from 'react';
import { useCart, useOrders, useToast, useAuth } from '../context/AppProviders';
import { validateEmail } from '../lib/validation';
import { FormError } from '../components/Common';
import { CreditCard } from 'lucide-react';

export const CheckoutPage = ({ setPage }) => {
  const { cart, cartTotal, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', address: '', card: '1234 5678 9012 3456', expiry: '12/28', cvc: '123' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };
  
  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required.";
    if (!validateEmail(form.email)) newErrors.email = "Valid email is required.";
    if (!form.address) newErrors.address = "Address is required.";
    if (form.card.length < 19) newErrors.card = "Invalid card number."; // 19 w/ spaces
    if (!form.expiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)) newErrors.expiry = "Invalid expiry (MM/YY).";
    if (form.cvc.length < 3) newErrors.cvc = "Invalid CVC.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix the errors in the form.', 'error');
      return;
    }
    
    addOrder(cart, cartTotal);
    clearCart();
    showToast('Order placed successfully!');
    setPage('orderConfirmation');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
      <h1 className="text-4xl font-extrabold text-white text-center mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handlePlaceOrder} id="checkout-form" className="lg:col-span-2 bg-gray-800 p-8 rounded-lg shadow-xl space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">Shipping Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="name">Full Name</label>
              <input type="text" id="name" value={form.name} onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <FormError message={errors.name} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">Email</label>
              <input type="email" id="email" value={form.email} onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <FormError message={errors.email} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="address">Address</label>
            <input type="text" id="address" value={form.address} onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <FormError message={errors.address} />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4 pt-6 border-t border-gray-700">Payment Details</h2>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="card">Card Number (Mock)</label>
            <input type="text" id="card" value={form.card} onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <FormError message={errors.card} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="expiry">Expiry (MM/YY)</label>
              <input type="text" id="expiry" value={form.expiry} onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <FormError message={errors.expiry} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="cvc">CVC</label>
              <input type="text" id="cvc" value={form.cvc} onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <FormError message={errors.cvc} />
            </div>
          </div>
        </form>

        <div className="lg:col-span-1">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl sticky top-24">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Your Order</h2>
            <div className="space-y-2 max-h-60 overflow-y-auto mb-4 pr-2">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center text-gray-300">
                  <div className="flex items-center">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-md object-cover mr-3" />
                    <div>
                      <p className="font-medium text-white">{item.name}</p>
                      <p className="text-sm">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-medium text-white">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-700 pt-4 space-y-4">
              <div className="flex justify-between text-white text-xl font-bold">
                <span>Total</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <button
                type="submit"
                form="checkout-form"
                className="w-full px-6 py-3 bg-yellow-400 text-gray-900 font-bold text-lg rounded-md shadow-lg hover:bg-yellow-300 flex items-center justify-center gap-2 transform hover:scale-105"
              >
                <CreditCard className="h-5 w-5" />
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};