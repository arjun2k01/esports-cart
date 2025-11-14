// src/pages/OrdersPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, Eye, Loader2, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login to view orders');
          navigate('/login');
          return;
        }

        const response = await fetch('https://esports-cart.onrender.com/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'shipped':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      default:
        return 'bg-neutral-500/20 text-neutral-500 border-neutral-500/30';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-16 h-16 text-orange-500 animate-spin" />
          <p className="text-white text-lg">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            MY <span className="text-orange-500">ORDERS</span>
          </h1>
          <p className="text-neutral-400">
            Track and manage all your orders in one place
          </p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          // Empty State
          <div className="bg-neutral-800 rounded-lg p-12 text-center border border-neutral-700">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-neutral-700 rounded-full mb-4">
              <ShoppingBag className="w-10 h-10 text-neutral-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No Orders Yet</h2>
            <p className="text-neutral-400 mb-6">
              You haven't placed any orders yet. Start shopping to see your orders here!
            </p>
            <button
              onClick={() => navigate('/products')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-orange-500/30"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          // Orders Grid
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-neutral-800 rounded-lg p-6 border border-neutral-700 hover:border-orange-500/50 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1 space-y-3">
                    {/* Order Number and Date */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-orange-500" />
                        <span className="text-white font-semibold">
                          Order #{order.orderNumber || order._id?.slice(-8).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-400 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>

                    {/* Items Preview */}
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {order.items?.slice(0, 3).map((item, index) => (
                          item.product?.image && (
                            <img
                              key={index}
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-10 h-10 rounded-lg border-2 border-neutral-800 object-cover"
                            />
                          )
                        ))}
                        {order.items?.length > 3 && (
                          <div className="w-10 h-10 rounded-lg border-2 border-neutral-800 bg-neutral-700 flex items-center justify-center text-xs text-white">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                      <div className="text-neutral-400 text-sm">
                        {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
                      </div>
                    </div>

                    {/* Status and Payment */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                        {order.status || 'Processing'}
                      </span>
                      <span className="text-neutral-400 text-sm">
                        Payment: <span className="text-white">{order.paymentMethod || 'COD'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Order Total and Action */}
                  <div className="flex items-center gap-4 lg:flex-col lg:items-end">
                    <div className="flex-1 lg:flex-none">
                      <p className="text-neutral-400 text-sm mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-orange-500">
                        ₹{order.total?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/order/${order._id}`)}
                      className="flex items-center gap-2 bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>

                {/* Shipping Address Preview (optional) */}
                {order.shippingAddress && (
                  <div className="mt-4 pt-4 border-t border-neutral-700">
                    <p className="text-neutral-400 text-sm">
                      Shipping to: <span className="text-white">{order.shippingAddress.city}, {order.shippingAddress.state}</span>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
