// src/pages/CartPage.jsx
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gaming-darker flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-600 mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Your cart is empty</h2>
          <p className="text-gray-400 mb-6">Add some awesome gaming gear!</p>
          <button
            onClick={() => navigate('/')}
            className="bg-gaming-orange hover:bg-gaming-gold text-black font-bold px-8 py-3 rounded-xl transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-darker py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-black text-white mb-8">
          SHOPPING <span className="text-gaming-gold">CART</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cart.map(item => (
              <div
                key={item._id}
                className="bg-surface-dark border border-gray-800 rounded-xl p-6 mb-4 flex gap-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                  <p className="text-gaming-gold text-xl font-bold">₹{item.price}</p>
                  
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="bg-gaming-dark hover:bg-gaming-gold/20 p-2 rounded-lg transition-all"
                    >
                      <Minus size={16} className="text-gaming-gold" />
                    </button>
                    
                    <span className="text-white font-bold w-12 text-center">
                      {item.quantity}
                    </span>
                    
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="bg-gaming-dark hover:bg-gaming-gold/20 p-2 rounded-lg transition-all"
                    >
                      <Plus size={16} className="text-gaming-gold" />
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-surface-dark border border-gray-800 rounded-xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{getCartTotal()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-gaming-gold">FREE</span>
                </div>
                <div className="border-t border-gray-700 pt-3 flex justify-between text-white text-xl font-bold">
                  <span>Total</span>
                  <span className="text-gaming-gold">₹{getCartTotal()}</span>
                </div>
              </div>
              
              <button
                onClick={() => user ? navigate('/checkout') : navigate('/login')}
                className="w-full bg-gaming-orange hover:bg-gaming-gold text-black font-bold py-4 rounded-xl transition-all hover:scale-105"
              >
                {user ? 'Proceed to Checkout' : 'Login to Checkout'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
