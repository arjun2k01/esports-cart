import React, { useState, useMemo } from 'react';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../context/AppProviders';
import { ChevronDown, Loader2 } from 'lucide-react';

export const ProductListPage = ({ setPage, setSelectedProductId, searchTerm }) => {
  const [filter, setFilter] = useState('All');
  const [sortOption, setSortOption] = useState('featured');
  const { products, loading, error } = useProducts();
  
  const categories = ['All', ...new Set(products.map(p => p.category))];
  
  const sortedAndFilteredProducts = useMemo(() => {
    let filtered = products
      .filter(p => filter === 'All' || p.category === filter)
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
    switch (sortOption) {
      case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
      case 'name-asc': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc': filtered.sort((a, b) => b.name.localeCompare(a.name)); break;
    }
    return filtered;
  }, [products, filter, searchTerm, sortOption]);

  const renderContent = () => {
    if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-12 w-12 text-blue-400 animate-spin" /></div>;
    if (error) return <p className="text-center text-red-400 text-xl py-16">{error}</p>;
    if (sortedAndFilteredProducts.length > 0) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {sortedAndFilteredProducts.map(product => (
            <ProductCard 
              key={product._id || product.id} 
              product={product} 
              setPage={setPage} 
              setSelectedProductId={setSelectedProductId} 
            />
          ))}
        </div>
      );
    }
    return <p className="text-center text-gray-400 text-xl py-16">No products found matching your criteria.</p>;
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
      <h1 className="text-4xl font-extrabold text-white text-center mb-4">All Supplies</h1>
      <p className="text-lg text-gray-300 text-center mb-8">Find exactly what you need for the next match.</p>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="flex flex-wrap justify-center gap-2 mb-4 md:mb-0">
          {categories.map(category => (
            <button key={category} onClick={() => setFilter(category)} className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${filter === category ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>{category}</button>
          ))}
        </div>
        <div className="relative">
          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="appearance-none w-48 px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Sort: Price Low to High</option>
            <option value="price-desc">Sort: Price High to Low</option>
            <option value="name-asc">Sort: Name A-Z</option>
            <option value="name-desc">Sort: Name Z-A</option>
          </select>
          <ChevronDown className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
      {renderContent()}
    </div>
  );
};