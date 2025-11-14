import React from 'react';
import { Link } from 'react-router-dom';
import { useCart, useWishlist } from '../context/AppProviders';
import { Heart, ShoppingCart, Trash2, AlertCircle } from 'lucide-react';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product._id);
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            {/* Empty State Icon */}
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-neutral-800/50 rounded-full flex items-center justify-center backdrop-blur-sm border border-neutral-700">
                <Heart className="w-16 h-16 text-neutral-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">0</span>
              </div>
            </div>

            {/* Empty State Message */}
            <h2 className="text-3xl font-bold text-white mb-3 text-center">
              YOUR WISHLIST IS <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">EMPTY</span>
            </h2>
            <p className="text-gray-400 text-center max-w-md mb-8">
              Save items you love and add them to cart anytime. Start building your ultimate gaming collection!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                START SHOPPING
              </Link>
              <Link
                to="/"
                className="px-8 py-3 bg-neutral-800 border border-neutral-700 text-white font-semibold rounded-xl hover:bg-neutral-700 transition-all duration-200 flex items-center justify-center"
              >
                BACK TO HOME
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-orange-500 fill-orange-500" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              MY <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">WISHLIST</span>
            </h1>
          </div>
          <p className="text-gray-400">
            You have <span className="text-orange-500 font-semibold">{wishlist.length}</span> item{wishlist.length !== 1 ? 's' : ''} in your wishlist
          </p>
        </div>

        {/* Wishlist Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div
              key={item._id}
              className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-2xl p-4 hover:border-orange-500/50 transition-all duration-300 group"
            >
              {/* Product Image */}
              <div className="relative mb-4 overflow-hidden rounded-xl bg-neutral-800/50">
                <img
                  src={item.image || '/placeholder-product.jpg'}
                  alt={item.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Stock Badge */}
                {item.stock > 0 ? (
                  <div className="absolute top-3 right-3 px-3 py-1 bg-green-500/90 backdrop-blur-sm rounded-full">
                    <span className="text-xs font-bold text-white">IN STOCK</span>
                  </div>
                ) : (
                  <div className="absolute top-3 right-3 px-3 py-1 bg-red-500/90 backdrop-blur-sm rounded-full">
                    <span className="text-xs font-bold text-white">OUT OF STOCK</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="mb-4">
                <Link
                  to={`/product/${item._id}`}
                  className="text-lg font-bold text-white hover:text-orange-500 transition-colors line-clamp-2 mb-2"
                >
                  {item.name}
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-orange-500">₹{item.price}</span>
                  {item.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                  )}
                </div>
                {item.category && (
                  <span className="inline-block mt-2 px-3 py-1 bg-neutral-800 text-gray-400 text-xs rounded-full">
                    {item.category}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {item.stock > 0 ? (
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    ADD TO CART
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex-1 px-4 py-2 bg-neutral-800 text-gray-500 font-semibold rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    OUT OF STOCK
                  </button>
                )}
                <button
                  onClick={() => removeFromWishlist(item._id)}
                  className="px-4 py-2 bg-red-500/10 border border-red-500/50 text-red-500 font-semibold rounded-xl hover:bg-red-500/20 transition-all duration-200 flex items-center justify-center"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center p-6 bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-2xl">
          <div className="text-center sm:text-left">
            <p className="text-white font-semibold mb-1">Ready to checkout?</p>
            <p className="text-gray-400 text-sm">Move items to cart and complete your purchase</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/products"
              className="px-6 py-3 bg-neutral-800 border border-neutral-700 text-white font-semibold rounded-xl hover:bg-neutral-700 transition-all duration-200"
            >
              CONTINUE SHOPPING
            </Link>
            <Link
              to="/cart"
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg shadow-orange-500/20"
            >
              VIEW CART
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
