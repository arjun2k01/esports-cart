import React, { useEffect } from 'react';
import { useOrders } from '../context/AppProviders';
import { Package, Loader2 } from 'lucide-react';

export const OrdersPage = () => {
  // Get orders, loading, and fetch function from context
  const { orders, loading, getMyOrders } = useOrders();

  // Refresh orders when the page loads
  useEffect(() => {
    getMyOrders();
  }, []);

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 text-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white text-center mb-8">My Orders</h1>
        {orders.length === 0 ? (
          <div className="bg-gray-800 p-8 md:p-12 rounded-lg shadow-xl text-center">
            <Package className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <p className="text-lg text-gray-300">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order._id} className="bg-gray-800 p-6 rounded-lg shadow-xl">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 pb-4 border-b border-gray-700">
                  <div>
                    <p className="text-xl font-bold text-white">Order ID: {order._id}</p>
                    <p className="text-sm text-gray-400">Date: {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-2xl font-bold text-yellow-300 mt-2 sm:mt-0">Total: ₹{order.totalPrice.toLocaleString('en-IN')}</p>
                     <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold text-green-900 bg-green-200 rounded">
                        {order.isPaid ? 'Paid' : 'Unpaid'}
                     </span>
                  </div>
                </div>
                <div className="space-y-4">
                  {order.orderItems.map(item => (
                    <div key={item._id || item.product} className="flex items-center">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover mr-4" />
                      <div>
                        <p className="font-medium text-white">{item.name}</p>
                        <p className="text-sm text-gray-400">Qty: {item.qty} | Price: ₹{item.price.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};