import React from 'react';
import { useCart, useAuth } from '../context/AppProviders';
import { Trash2, Plus, Minus, CreditCard } from 'lucide-react';

export const CartPage = ({ setPage }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  
  const handleCheckout = () => {
    if (isAuthenticated) {
      setPage('checkout');
    } else {
      setPage('login');
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
      <h1 className="text-4xl font-extrabold text-white text-center mb-8">Your Cart</h1>
      
      {cart.length === 0 ? (
        <div className="text-center">
          <p className="text-xl text-gray-300 mb-6">Your cart is empty.</p>
          <button onClick={() => setPage('products')} className="px-6 py-3 bg-blue-500 text-white font-bold text-lg rounded-md shadow-lg hover:bg-blue-400">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex flex-col sm:flex-row items-center bg-gray-800 p-4 rounded-lg shadow-lg">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md mb-4 sm:mb-0"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/128x128/2d3748/FFFFFF?text=Image+Error'; }}
                />
                <div className="flex-grow sm:ml-6 text-center sm:text-left">
                  <h3 className="text-xl font-bold text-white">{item.name}</h3>
                  <p className="text-lg font-medium text-blue-400">₹{item.price.toLocaleString('en-IN')}</p>
                </div>
                <div className="flex items-center gap-2 mt-4 sm:mt-0 sm:ml-auto">
                  <div className="flex items-center border border-gray-600 rounded-md">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-gray-300 hover:bg-gray-700 rounded-l-md">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-3 py-1 text-white font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-gray-300 hover:bg-gray-700 rounded-r-md">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-700">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span className="font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Tax</span>
                  <span className="font-medium">TBD</span>
                </div>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between text-white text-xl font-bold mb-6">
                  <span>Total</span>
                  <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full px-6 py-3 bg-yellow-400 text-gray-900 font-bold text-lg rounded-md shadow-lg hover:bg-yellow-300 flex items-center justify-center gap-2 transform hover:scale-105"
                >
                  <CreditCard className="h-5 w-5" />
                  {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};