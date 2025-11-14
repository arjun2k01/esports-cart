// src/pages/OrdersPage.jsx  
import { Link } from "react-router-dom";
import { Package } from "lucide-react";

const OrdersPage = () => {
  // Mock empty orders - replace with actual API call when backend is ready
  const orders = [];

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
              <div className="text-center text-gray-400">Order details will appear here</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
