// src/components/ProductCard.jsx
import { Link } from "react-router-dom";
import { useCart, useWishlist } from "../context/AppProviders";
import { Heart, ShoppingCart, X } from "lucide-react";
import { useState } from "react";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  
  const inWishlist = wishlist.some((item) => item._id === product._id);
    const [imageError, setImageError] = useState(false);

  return (
    <div className="group relative bg-surface-dark rounded-2xl overflow-hidden border border-gray-800 hover:border-gaming-gold transition-all duration-300 hover:shadow-gaming-hover hover:scale-105">
      
      {/* Product Image Container */}
      <div className="relative overflow-hidden h-56 bg-gaming-darker">
        <Link to={`/product/${product._id}`}>
          <img 
            src={product.image}
                              onError={() => setImageError(true)}
            alt={product.name}
className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${imageError ? 'bg-gradient-to-br from-gaming-gold to-gaming-orange' : ''}`}          />
          {/* Dark Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-gaming-darker/95 via-gaming-darker/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-gaming-gold font-bold uppercase text-sm tracking-wider">
              View Details
            </span>
          </div>
        </Link>

        {/* Out of Stock Badge */}
        {product.countInStock === 0 && (
          <div className="absolute top-3 right-3 bg-out-red px-3 py-1 rounded-full">
            <span className="text-white text-xs font-bold uppercase">Sold Out</span>
          </div>
        )}
      </div>
      
      {/* Card Content */}
      <div className="p-5 bg-gradient-to-b from-surface-dark to-gaming-dark">
        
        {/* Product Name */}
        <Link to={`/product/${product._id}`}>
          <h3 className="font-display text-xl font-bold text-white mb-3 group-hover:text-gaming-gold transition line-clamp-2 min-h-[56px]">
            {product.name}
          </h3>
        </Link>
        
        {/* Price Display */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gaming-gold to-gaming-orange">
            ₹{product.price?.toLocaleString('en-IN')}
          </span>
        </div>
        
        {/* Stock Status */}
        {product.countInStock > 0 ? (
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-stock-green animate-pulse"></div>
            <span className="text-stock-green font-bold uppercase text-sm tracking-wide">
              In Stock ({product.countInStock})
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 mb-4">
            <X size={16} className="text-out-red" />
            <span className="text-out-red font-bold uppercase text-sm tracking-wide">
              Out of Stock
            </span>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          {/* Add to Cart Button */}
          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.countInStock === 0}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold uppercase text-sm tracking-wide transition-all duration-300 ${
              product.countInStock === 0
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gaming-orange hover:bg-gaming-gold text-black hover:scale-105 shadow-lg hover:shadow-gaming'
            }`}
          >
            <ShoppingCart size={18} />
            {product.countInStock === 0 ? 'Sold Out' : 'Add'}
          </button>
          
          {/* Wishlist Button */}
          <button
            onClick={() => inWishlist ? removeFromWishlist(product._id) : addToWishlist(product)}
            className="p-3 rounded-xl bg-gaming-darker border-2 border-gray-700 hover:border-gaming-gold transition-all duration-300 hover:scale-105"
          >
            <Heart 
              size={20} 
              className={inWishlist ? 'fill-out-red text-out-red' : 'text-gray-400 hover:text-gaming-gold'}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
