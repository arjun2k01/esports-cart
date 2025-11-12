import React from 'react';
import { Heart } from 'lucide-react';
import { useCart, useToast, useWishlist } from '../context/AppProviders';

export const ProductCard = ({ product, setPage, setSelectedProductId }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const productId = product._id || product.id;
  const inWishlist = isInWishlist(productId);
  
  const handleViewDetails = () => {
    setSelectedProductId(productId);
    setPage('productDetail');
  };
  
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    showToast(`${product.name} added to cart!`);
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(productId);
      showToast(`${product.name} removed from wishlist!`, 'error');
    } else {
      addToWishlist(product);
      showToast(`${product.name} added to wishlist!`);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 transform hover:-translate-y-1">
      <div className="relative h-56 w-full cursor-pointer" onClick={handleViewDetails}>
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/2d3748/FFFFFF?text=Image+Error'; }} />
        <span className="absolute top-2 left-2 bg-gray-900 text-yellow-300 text-xs font-bold px-2 py-1 rounded-md">{product.category}</span>
        <button onClick={handleWishlistToggle} className="absolute top-2 right-2 p-2 rounded-full bg-gray-900/50 text-white hover:bg-gray-800 transition-colors">
          <Heart className={`h-5 w-5 ${inWishlist ? 'text-red-500 fill-current' : ''}`} />
        </button>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-white mb-2 cursor-pointer hover:text-blue-400" onClick={handleViewDetails}>{product.name}</h3>
        <p className="text-2xl font-extrabold text-yellow-300 mb-4">₹{product.price.toLocaleString('en-IN')}</p>
        <div className="mt-auto">
          <button onClick={handleAddToCart} className="w-full px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded-md shadow-md hover:bg-yellow-300 transform hover:scale-105 transition-all duration-300">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};