import React from 'react';
import { AlertCircle, Star } from 'lucide-react';

export const FormError = ({ message }) => {
  if (!message) return null;
  return (
    <div className="flex items-center text-red-400 text-sm mt-1">
      <AlertCircle className="h-4 w-4 mr-1" />
      <span>{message}</span>
    </div>
  );
};

export const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} />
      ))}
    </div>
  );
};

export const Input = ({ className = "", ...props }) => {
  return (
    <input className={`w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`} {...props} />
  );
};

export const Button = ({ children, className = "", ...props }) => {
  return (
    <button className={`px-6 py-3 rounded-md font-bold shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${className}`} {...props}>
      {children}
    </button>
  );
};