import React from 'react';
import { CheckCircle } from 'lucide-react';

export const OrderConfirmationPage = ({ setPage }) => {
  return (
    <div className="container mx-auto px-4 py-16 animate-fadeIn text-center">
      <div className="max-w-md mx-auto bg-gray-800 p-10 rounded-lg shadow-xl">
        <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
        <h1 className="text-4xl font-extrabold text-white mb-4">Order Confirmed!</h1>
        <p className="text-lg text-gray-300 mb-8">
          Thank you for your purchase. Your gear is on its way to the battleground.
        </p>
        <button
          onClick={() => setPage('home')}
          className="px-8 py-3 bg-blue-500 text-white font-bold text-lg rounded-md shadow-lg hover:bg-blue-400"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};