// src/pages/CartPage.jsx
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/AppProviders";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateQty, removeFromCart, cartTotal } = useCart();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-gaming-darker flex flex-col justify-center items-center px-6 py-20">
        <div className="text-center max-w-md">
          <div className="w-32 h-32 bg-surface-dark rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={64} className="text-gray-600" />
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-3 uppercase">
            Your Cart is Empty
          </h2>
          <p className="text-gray-400 mb-8">
            Looks like you haven't added any gaming gear yet. Start shopping now!
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gaming-orange hover:bg-gaming-gold text-black px-8 py-4 rounded-xl font-bold uppercase transition-all hover:scale-105"
          >
            Start Shopping
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-darker py-12">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-black text-white uppercase mb-2">
            Your <span className="text-gaming-gold">Cart</span>
          </h1>
          <p className="text-gray-400">Review your items before checkout</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="bg-surface-dark border border-gray-800 rounded-xl p-6 hover:border-gaming-gold transition-all"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  
                  {/* Product Image */}
                  <Link to={`/product/${item._id}`} className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full sm:w-32 h-32 object-cover rounded-lg hover:scale-105 transition-transform"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1">
                    <Link
                      to={`/product/${item._id}`}
                      className="font-display text-xl font-bold text-white hover:text-gaming-gold transition block mb-2"
                    >
                      {item.name}
                    </Link>
                    <p className="text-2xl font-black text-gaming-gold mb-4">
                      ₹{item.price?.toLocaleString('en-IN')}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 bg-gaming-darker border border-gray-700 rounded-lg">
                        <button
                          onClick={() => item.qty > 1 && updateQty(item._id, item.qty - 1)}
                          disabled={item.qty <= 1}
                          className="p-2 hover:bg-surface-dark disabled:opacity-30 disabled:cursor-not-allowed transition"
                        >
                          <Minus size={18} className="text-white" />
                        </button>
                        <span className="font-bold text-white px-4">{item.qty}</span>
                        <button
                          onClick={() => item.qty < item.countInStock && updateQty(item._id, item.qty + 1)}
                          disabled={item.qty >= item.countInStock}
                          className="p-2 hover:bg-surface-dark disabled:opacity-30 disabled:cursor-not-allowed transition"
                        >
                          <Plus size={18} className="text-white" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="flex items-center gap-2 text-out-red hover:text-red-400 font-semibold transition"
                      >
                        <Trash2 size={18} />
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="text-sm text-gray-400 mb-1">Subtotal</p>
                    <p className="font-display text-2xl font-black text-gaming-gold">
                      ₹{(item.price * item.qty)?.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-surface-dark border border-gray-800 rounded-xl p-6 sticky top-24">
              <h2 className="font-display text-2xl font-bold text-white uppercase mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Total Items:</span>
                  <span className="font-bold text-white">{cart.length}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal:</span>
                  <span className="font-bold text-white">₹{cartTotal?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping:</span>
                  <span className="font-bold text-stock-green">FREE</span>
                </div>
                <div className="border-t border-gray-700 pt-4 flex justify-between">
                  <span className="font-display text-xl font-bold text-white uppercase">Total:</span>
                  <span className="font-display text-3xl font-black text-gaming-gold">
                    ₹{cartTotal?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-gaming-orange hover:bg-gaming-gold text-black py-4 rounded-xl font-bold uppercase transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
              >
                Proceed to Checkout
                <ArrowRight size={20} />
              </button>

              <Link
                to="/"
                className="block text-center text-gray-400 hover:text-gaming-gold mt-4 font-semibold transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
