// src/pages/WishListPage.jsx
import { Link } from "react-router-dom";
import { useCart, useWishlist } from "../context/AppProviders";

const WishListPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-semibold mb-2">Your Wishlist is Empty</h2>
        <p className="text-gray-600 mb-4">
          Save items you love and add them to cart anytime.
        </p>

        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">My Wishlist</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item) => (
          <div
            key={item._id}
            className="bg-white shadow rounded-xl p-4 flex flex-col"
          >
            <Link to={`/product/${item._id}`}>
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover rounded"
              />
            </Link>

            <div className="mt-4 flex-1">
              <Link
                to={`/product/${item._id}`}
                className="text-lg font-semibold hover:underline"
              >
                {item.name}
              </Link>

              <p className="text-gray-700 mt-1">₹{item.price}</p>

              {item.countInStock > 0 ? (
                <p className="text-green-600 font-medium mt-1">
                  In Stock ({item.countInStock})
                </p>
              ) : (
                <p className="text-red-600 font-medium mt-1">Out of Stock</p>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <button
                onClick={() => {
                  addToCart(item, 1);
                }}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                disabled={item.countInStock === 0}
              >
                Add to Cart
              </button>

              <button
                onClick={() => removeFromWishlist(item._id)}
                className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishListPage;
