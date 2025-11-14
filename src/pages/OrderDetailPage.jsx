// src/pages/OrderDetailPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Truck, 
  CheckCircle,
  Loader2,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login to view order details');
          navigate('/login');
          return;
        }

        const response = await fetch(`https://esports-cart.onrender.com/api/orders/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }

        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Failed to load order details');
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id, navigate]);

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

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5" />;
      case 'shipped':
        return <Truck className="w-5 h-5" />;
      case 'processing':
        return <Clock className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-16 h-16 text-orange-500 animate-spin" />
          <p className="text-white text-lg">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Order not found</p>
          <button
            onClick={() => navigate('/orders')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Orders
        </button>

        {/* Header */}
        <div className="bg-neutral-800 rounded-lg p-6 mb-6 border border-neutral-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Order #{order.orderNumber || order._id?.slice(-8).toUpperCase()}
              </h1>
              <p className="text-neutral-400 text-sm">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(order.status)}
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                {order.status || 'Processing'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-500" />
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 bg-neutral-900/50 rounded-lg p-4"
                  >
                    {item.product?.image && (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-1">
                        {item.product?.name || 'Product'}
                      </h3>
                      <p className="text-neutral-400 text-sm mb-1">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-neutral-400 text-sm">
                        Price: ₹{item.product?.price?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-orange-500 font-bold text-lg">
                        ₹{((item.product?.price || 0) * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  Shipping Address
                </h2>
                <div className="space-y-2 text-neutral-400">
                  <p className="text-white font-semibold">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && (
                    <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
              <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Shipping</span>
                  <span className={order.shipping === 0 ? 'text-green-500' : ''}>
                    {order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Tax (18%)</span>
                  <span>₹{order.tax?.toLocaleString() || '0'}</span>
                </div>
                <div className="pt-3 border-t border-neutral-700 flex justify-between">
                  <span className="text-white font-bold text-lg">Total</span>
                  <span className="text-orange-500 font-bold text-xl">
                    ₹{order.total?.toLocaleString() || '0'}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-orange-500" />
                Payment
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between text-neutral-400">
                  <span>Method</span>
                  <span className="text-white font-semibold">
                    {order.paymentMethod || 'Cash on Delivery'}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Status</span>
                  <span className="text-yellow-500 font-semibold">
                    {order.paymentStatus || 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tracking Information */}
            {order.trackingNumber && (
              <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-orange-500" />
                  Tracking
                </h2>
                <div className="space-y-2">
                  <p className="text-neutral-400 text-sm">Tracking Number</p>
                  <p className="text-white font-mono bg-neutral-900 px-3 py-2 rounded">
                    {order.trackingNumber}
                  </p>
                </div>
              </div>
            )}

            {/* Estimated Delivery */}
            <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                Delivery
              </h2>
              <p className="text-neutral-400 text-sm mb-2">Estimated Delivery</p>
              <p className="text-white font-semibold">
                {order.estimatedDelivery 
                  ? formatDate(order.estimatedDelivery)
                  : '3-5 business days'}
              </p>
            </div>
          </div>
        </div>

        {/* Need Help Section */}
        <div className="mt-8 bg-neutral-800 rounded-lg p-6 border border-neutral-700 text-center">
          <h3 className="text-white font-semibold mb-2">Need Help with this order?</h3>
          <p className="text-neutral-400 text-sm mb-4">
            Contact our support team at support@esportscart.com or call 1800-XXX-XXXX
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
