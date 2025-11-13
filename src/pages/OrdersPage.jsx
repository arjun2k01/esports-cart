// src/pages/OrdersPage.jsx
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Link } from "react-router-dom";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/orders/my-orders");
      setOrders(res.data);
    } catch (err) {
      setError("Failed to load your orders");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="p-6 text-center">Loading your orders...</div>
    );

  if (error)
    return <div className="p-6 text-center text-red-600">{error}</div>;

  if (orders.length === 0)
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-semibold mb-3">
          You have no orders yet.
        </h2>
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Shop Now
        </Link>
      </div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="p-5 bg-white shadow rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-lg">
                Order #{order._id.slice(-6)}
              </p>
              <p className="text-gray-600">
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <p className="text-gray-700 mt-1">
                Total: <span className="font-semibold">₹{order.totalPrice}</span>
              </p>
              <p
                className={`mt-1 font-semibold ${
                  order.isDelivered ? "text-green-600" : "text-yellow-600"
                }`}
              >
                {order.isDelivered ? "Delivered" : "Pending"}
              </p>
            </div>

            <Link
              to={`/order/${order._id}`}
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
