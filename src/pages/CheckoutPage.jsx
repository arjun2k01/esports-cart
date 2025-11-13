// src/pages/CheckoutPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../lib/axios";
import { useCart } from "../context/AppProviders";
import { useAuth } from "../context/AuthContext";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart, cartTotal } = useCart();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [shipping, setShipping] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "India",
  });

  // Redirect if cart empty
  if (cart.length === 0) {
    return (
      <div className="p-6 text-center min-h-[60vh] flex flex-col justify-center items-center">
        <h2 className="text-2xl font-semibold mb-3">Your cart is empty.</h2>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-6 py-3 rounded mt-3 hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const orderData = {
        orderItems: cart.map((item) => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item._id,
        })),
        shippingAddress: shipping,
        paymentMethod: "COD",
      };

      const res = await axios.post("/orders", orderData);

      clearCart(); // clear cart after successful order

      navigate(`/order-confirmation/${res.data._id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    }

    setLoading(false);
  };

  return (
    <div className="p-6 grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
      {/* Shipping Form */}
      <div className="md:col-span-2 bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Shipping Address</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="space-y-6">
          <div>
            <label className="block">Address</label>
            <input
              type="text"
              className="w-full p-3 border rounded"
              required
              value={shipping.address}
              onChange={(e) =>
                setShipping({ ...shipping, address: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block">City</label>
            <input
              type="text"
              className="w-full p-3 border rounded"
              required
              value={shipping.city}
              onChange={(e) =>
                setShipping({ ...shipping, city: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block">Postal Code</label>
            <input
              type="text"
              className="w-full p-3 border rounded"
              required
              value={shipping.postalCode}
              onChange={(e) =>
                setShipping({ ...shipping, postalCode: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block">Country</label>
            <input
              type="text"
              className="w-full p-3 border rounded"
              value={shipping.country}
              disabled
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white w-full py-3 rounded text-lg hover:bg-green-700 transition"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>
      </div>

      {/* Order Summary */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>

        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center border-b pb-2"
            >
              <span>
                {item.name} ({item.qty})
              </span>
              <span>₹{item.price * item.qty}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6 text-xl font-bold">
          <span>Total:</span>
          <span>₹{cartTotal}</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
