// src/pages/OrderDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../lib/axios";

const OrderDetailPage = () => {
  const { id } = useParams(); // order id
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      setError("Failed to load order details");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loading)
    return (
      <div className="p-6 text-center text-gray-700">Loading order details...</div>
    );

  if (error)
    return (
      <div className="p-6 text-center text-red-600 text-lg">{error}</div>
    );

  if (!order)
    return (
      <div className="p-6 text-center">Order not found.</div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Order Details</h1>

      {/* Order Info Card */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-3">
          Order #{order._id.slice(-6)}
        </h2>
        <p className="text-gray-700">
          Placed on:{" "}
          <span className="font-semibold">
            {new Date(order.createdAt).toLocaleString()}
          </span>
        </p>

        <p className="mt-2">
          Status:{" "}
          <span
            className={`font-semibold ${
              order.isDelivered ? "text-green-600" : "text-yellow-600"
            }`}
          >
            {order.isDelivered ? "Delivered" : "Pending"}
          </span>
        </p>
      </div>

      {/* Shipping Details */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-3">Shipping Address</h2>
        <p className="text-gray-700">{order.shippingAddress.address}</p>
        <p className="text-gray-700">{order.shippingAddress.city}</p>
        <p className="text-gray-700">{order.shippingAddress.postalCode}</p>
        <p className="text-gray-700">{order.shippingAddress.country}</p>
      </div>

      {/* Items */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Items</h2>

        <div className="space-y-4">
          {order.orderItems.map((item) => (
            <div
              key={item.product}
              className="flex justify-between items-center border-b pb-3"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <Link
                    to={`/product/${item.product}`}
                    className="font-semibold hover:underline"
                  >
                    {item.name}
                  </Link>
                  <p className="text-gray-600">Qty: {item.qty}</p>
                </div>
              </div>

              <p className="text-lg font-semibold">₹{item.price * item.qty}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

        <div className="flex justify-between mb-2 text-lg">
          <span>Total Price:</span>
          <span>₹{order.totalPrice}</span>
        </div>

        <Link
          to="/orders"
          className="mt-5 block w-full text-center bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          Back to Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderDetailPage;
