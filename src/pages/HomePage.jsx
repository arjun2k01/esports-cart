import React from 'react';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../context/AppProviders'; 
import { Loader2 } from 'lucide-react'; 

export const HomePage = ({ setPage, setSelectedProductId }) => {
  const { products, loading, error } = useProducts();
  const featuredProducts = products.slice(0, 3);

  const renderContent = () => {
    if (loading) return <div className="flex justify-center h-48 items-center"><Loader2 className="h-12 w-12 text-blue-400 animate-spin" /></div>;
    if (error) return <div className="text-red-400 text-center bg-red-900/30 p-4 rounded">{error}</div>;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {featuredProducts.map((product) => (
          <ProductCard 
            key={product._id || product.id} 
            product={product} 
            setPage={setPage} 
            setSelectedProductId={setSelectedProductId} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="animate-fadeIn">
      <div className="relative bg-gray-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://placehold.co/1920x1080/2d3748/5178c1?text=ESPORTS+HERO')" }}></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-48 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg">YOUR PRO GAMING ARSENAL</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-200 drop-shadow-md">Exclusive drops, pro-level gear, and everything you need to dominate the arena.</p>
          <button onClick={() => setPage('products')} className="mt-8 px-8 py-3 bg-blue-500 text-white font-bold text-lg rounded-md shadow-lg hover:bg-blue-400 transform hover:-translate-y-1 transition-all duration-300">Shop All Gear</button>
        </div>
      </div>
      <div className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white text-center mb-12">Featured Drops</h2>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};