// src/pages/CartPage.jsx

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

const CartPage = () => {
  const cartContext = typeof useCart === "function" ? useCart() || {} : {};
  const {
    cart = [],
    removeFromCart = () => {},
    updateQuantity = () => {},
    getCartTotal = () => 0,
  } = cartContext;

  const { user } = useAuth ? useAuth() : {};
  const navigate = useNavigate();

  return (
    <div className="pt-8 pb-40 px-8 min-h-screen bg-gray-950 text-white">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <ShoppingBag />
        My Cart
      </h2>
      {cart.length === 0 ? (
        <div className="flex flex-col items-center mt-20 space-y-6">
          <img src="/empty-cart.svg" alt="Empty cart" className="w-48" />
          <p className="text-xl font-semibold text-gray-400">Your cart is empty!</p>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold"
            onClick={() => navigate('/products')}
          >
            Shop Now
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <table className="w-full border-separate border-spacing-y-4">
            <thead>
              <tr>
                <th className="text-left">Item</th>
                <th className="text-left">Price</th>
                <th className="text-left">Quantity</th>
                <th className="text-left">Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item._id} className="bg-gray-800 rounded-lg shadow overflow-hidden">
                  <td className="flex items-center gap-4 py-4 pl-6">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-contain rounded-lg" />
                    <div>
                      <div className="font-bold text-lg">{item.name}</div>
                      <div className="text-gray-400 text-sm">{item.brand}</div>
                    </div>
                  </td>
                  <td className="font-bold text-lg">₹{item.price}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="bg-gray-900 hover:bg-gray-700 p-1 rounded-full disabled:opacity-50"
                      >
                        <Minus size={20} />
                      </button>
                      <span className="px-3 font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="bg-gray-900 hover:bg-gray-700 p-1 rounded-full"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </td>
                  <td className="font-bold text-lg">₹{item.price * item.quantity}</td>
                  <td>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="bg-red-600 hover:bg-red-800 text-white px-3 py-2 rounded-full"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end items-center gap-8 mr-10">
            <div className="text-lg font-semibold">Total: <span className="text-3xl font-bold text-blue-500">₹{getCartTotal()}</span></div>
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-xl font-bold text-lg"
              onClick={() => user ? navigate('/checkout') : navigate('/login')}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
