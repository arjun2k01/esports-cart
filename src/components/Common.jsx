import React from 'react';
import { AlertCircle, Star } from 'lucide-react';

/**
 * FormError Component
 * Displays a validation error message
 */
export const FormError = ({ message }) => {
  if (!message) return null;
  return (
    <div className="flex items-center text-red-400 text-sm mt-1">
      <AlertCircle className="h-4 w-4 mr-1" />
      <span>{message}</span>
    </div>
  );
};

/**
 * StarRating Component
 */
export const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
        />
      ))}
    </div>
  );
};