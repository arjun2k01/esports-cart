// src/pages/CartPage.jsx
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/AppProviders";

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateQty, removeFromCart, cartTotal } = useCart();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="p-6 text-center min-h-[60vh] flex flex-col justify-center items-center">
        <h2 className="text-2xl font-semibold mb-3">Your Cart is Empty</h2>
        <Link
          to="/"
          className="mt-3 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-6">
        {cart.map((item) => (
          <div
            key={item._id}
            className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 border-b pb-6"
          >
            {/* Image */}
            <img
              src={item.image}
              alt={item.name}
              className="w-32 h-32 object-cover rounded shadow"
            />

            {/* Product Info */}
            <div className="flex-1">
              <Link
                to={`/product/${item._id}`}
                className="text-xl font-semibold hover:underline"
              >
                {item.name}
              </Link>

              <p className="text-gray-600 mt-1">₹{item.price}</p>

              {/* Quantity */}
              <div className="mt-3">
                <label className="mr-2 font-medium">Qty:</label>
                <select
                  value={item.qty}
                  onChange={(e) => updateQty(item._id, Number(e.target.value))}
                  className="p-2 border rounded"
                >
                  {[...Array(item.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => removeFromCart(item._id)}
              className="text-red-600 hover:underline font-semibold"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="mt-10 p-6 bg-white rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>

        <div className="flex justify-between text-lg mb-3">
          <span>Total Items:</span>
          <span>{cart.length}</span>
        </div>

        <div className="flex justify-between text-xl font-bold mb-6">
          <span>Total Price:</span>
          <span>₹{cartTotal}</span>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition text-lg"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
