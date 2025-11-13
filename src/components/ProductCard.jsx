// src/components/ProductCard.jsx
import { Link } from "react-router-dom";
import { useCart, useWishlist } from "../context/AppProviders";
import { Heart, HeartOff, ShoppingCart } from "lucide-react";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const inWishlist = wishlist.some((item) => item._id === product._id);

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition flex flex-col">
      {/* Product Clickable Image */}
      <Link to={`/product/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="rounded-xl w-full h-48 object-cover mb-4"
        />
      </Link>

      {/* Product Info */}
      <div className="flex-1">
        <Link to={`/product/${product._id}`}>
          <h2 className="text-lg font-semibold hover:underline">{product.name}</h2>
        </Link>

        <p className="text-gray-700 text-base mt-1 font-medium">
          ₹{product.price}
        </p>

        {product.countInStock > 0 ? (
          <p className="mt-1 text-green-600 font-medium">
            In Stock ({product.countInStock})
          </p>
        ) : (
          <p className="mt-1 text-red-600 font-medium">Out of Stock</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex items-center justify-between gap-3">
        {/* Add to Cart Button */}
        <button
          onClick={() => addToCart(product, 1)}
          disabled={product.countInStock === 0}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition
            ${
              product.countInStock === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
        >
          <ShoppingCart size={18} />
          Add
        </button>

        {/* Wishlist Button */}
        <button
          onClick={() =>
            inWishlist
              ? removeFromWishlist(product._id)
              : addToWishlist(product)
          }
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
        >
          {inWishlist ? (
            <HeartOff size={20} className="text-red-500" />
          ) : (
            <Heart size={20} className="text-gray-600" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
