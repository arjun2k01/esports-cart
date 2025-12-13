// src/pages/OrderConfirmationPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, Package, MapPin, Calendar, ArrowRight, Home, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
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

        const response = await fetch(`https://esports-cart.onrender.com/api/orders/${orderId}`, {
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
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    } else {
      setLoading(false);
    }
  }, [orderId, navigate]);

  const getEstimatedDelivery = () => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5); // 5 days from now
    return deliveryDate.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-lg">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Icon and Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4 animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-neutral-400 text-lg">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-neutral-800 rounded-lg p-6 md:p-8 mb-6 border border-neutral-700">
          {/* Order Number */}
          <div className="mb-6 pb-6 border-b border-neutral-700">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-neutral-400 text-sm mb-1">Order Number</p>
                <p className="text-white text-xl font-bold">
                  #{order?.orderNumber || orderId?.slice(-8).toUpperCase() || 'N/A'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-neutral-400 text-sm mb-1">Order Date</p>
                <p className="text-white font-medium">
                  {order?.createdAt 
                    ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : new Date().toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Order Status</h3>
                <p className="text-neutral-400">
                  Your order is being processed and will be shipped soon.
                </p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-500">
                    Processing
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Estimated Delivery</h3>
                <p className="text-neutral-400">{getEstimatedDelivery()}</p>
                <p className="text-sm text-neutral-500 mt-1">
                  Estimated delivery time: 3-5 business days
                </p>
              </div>
            </div>

            {order?.shippingAddress && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Shipping Address</h3>
                  <p className="text-neutral-400">
                    {order.shippingAddress.address}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                    {order.shippingAddress.country}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Order Items */}
          {order?.items && order.items.length > 0 && (
            <div className="mb-6 pb-6 border-b border-neutral-700">
              <h3 className="text-white font-semibold mb-4">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 bg-neutral-900/50 rounded-lg p-3">
                    {item.product?.image && (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-white font-medium">{item.product?.name || 'Product'}</p>
                      <p className="text-neutral-400 text-sm">Quantity: {item.quantity}</p>
                    </div>
                    <p className="text-orange-500 font-semibold">
                      ₹{((item.product?.price || 0) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-neutral-400">
              <span>Subtotal</span>
              <span>₹{order?.subtotal?.toLocaleString() || '0'}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Shipping</span>
              <span className={order?.shipping === 0 ? 'text-green-500' : ''}>
                {order?.shipping === 0 ? 'FREE' : `₹${order?.shipping}`}
              </span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Tax (18%)</span>
              <span>₹{order?.tax?.toLocaleString() || '0'}</span>
            </div>
            <div className="pt-2 border-t border-neutral-700 flex justify-between text-white text-xl font-bold">
              <span>Total</span>
              <span className="text-orange-500">₹{order?.total?.toLocaleString() || '0'}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 border border-neutral-700"
          >
            <Home className="w-5 h-5" />
            Continue Shopping
          </button>
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-orange-500/30"
          >
            View All Orders
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-neutral-400 text-sm mb-2">
            A confirmation email has been sent to your registered email address.
          </p>
          <p className="text-neutral-500 text-xs">
            Need help? Contact our support team at support@esportscart.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
