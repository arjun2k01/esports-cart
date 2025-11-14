// src/pages/OrdersPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Calendar, CreditCard, Truck } from "lucide-react";
import { useOrders } from "../context/OrderContext";

const OrdersPage = () => {
  const { orders, fetchOrders } = useOrders();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      await fetchOrders();
      setLoading(false);
    };
    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gaming-darker flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gaming-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-semibold">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[70vh] bg-gaming-darker flex flex-col justify-center items-center px-6 py-20">
        <div className="text-center max-w-md">
          <div className="w-32 h-32 bg-surface-dark rounded-full flex items-center justify-center mx-auto mb-6">
            <Package size={64} className="text-gray-600" />
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-3 uppercase">No Orders Yet</h2>
          <p className="text-gray-400 mb-8">Start shopping for amazing gaming gear!</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-gaming-orange hover:bg-gaming-gold text-black px-8 py-4 rounded-xl font-bold uppercase transition-all hover:scale-105">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-darker py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-black text-white uppercase mb-2">
            Your <span className="text-gaming-gold">Orders</span>
          </h1>
          <p className="text-gray-400">{orders.length} order(s) found</p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-surface-dark border border-gray-800 rounded-xl p-6 hover:border-gaming-gold transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gaming-gold/10 rounded-lg flex items-center justify-center">
                      <Package className="text-gaming-gold" size={24} />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Order ID</p>
                      <p className="font-mono text-white font-bold">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-gray-400" size={18} />
                    <div>
                      <p className="text-gray-400 text-xs">Placed on</p>
                      <p className="text-white font-semibold text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="text-gray-400" size={18} />
                    <div>
                      <p className="text-gray-400 text-xs">Total Amount</p>
                      <p className="text-gaming-gold font-black text-lg">₹{order.totalPrice?.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="text-gray-400" size={18} />
                    <div>
                      <p className="text-gray-400 text-xs">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${order.isDelivered ? 'bg-stock-green/10 text-stock-green' : 'bg-gaming-orange/10 text-gaming-orange'}`}>
                        {order.isDelivered ? 'Delivered' : 'Processing'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <p className="text-gray-400 text-sm mb-3 font-semibold">Order Items:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {order.orderItems?.map((item, idx) => (
                    <div key={idx} className="flex gap-3 bg-gaming-darker rounded-lg p-3">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm line-clamp-1">{item.name}</p>
                        <p className="text-gray-400 text-xs">Qty: {item.qty}</p>
                        <p className="text-gaming-gold font-bold text-sm">₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
