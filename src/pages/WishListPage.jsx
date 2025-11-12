import React from 'react';
import { useWishlist } from '../context/AppProviders';
import { ProductCard } from '../components/ProductCard';
import { Heart } from 'lucide-react';

export const WishlistPage = ({ setPage, setSelectedProductId }) => {
  const { wishlist } = useWishlist();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
      <h1 className="text-4xl font-extrabold text-white text-center mb-8">My Wishlist</h1>
      {wishlist.length === 0 ? (
        <div className="text-center bg-gray-800 p-12 rounded-lg shadow-xl">
          <Heart className="h-16 w-16 text-blue-400 mx-auto mb-4" />
          <p className="text-xl text-gray-300 mb-6">Your wishlist is empty.</p>
          <button
            onClick={() => setPage('products')}
            className="px-6 py-3 bg-blue-500 text-white font-bold text-lg rounded-md shadow-lg hover:bg-blue-400"
          >
            Find Gear
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {wishlist.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              setPage={setPage} 
              setSelectedProductId={setSelectedProductId} 
            />
          ))}
        </div>
      )}
    </div>
  );
};