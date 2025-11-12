import React, { useState, useMemo } from 'react';
import { mockProducts } from '../data/mockProducts.js';
import { ProductCard } from '../components/ProductCard';
import { ChevronDown } from 'lucide-react';

export const ProductListPage = ({ setPage, setSelectedProductId, searchTerm }) => {
  const [filter, setFilter] = useState('All');
  const [sortOption, setSortOption] = useState('featured');
  
  const categories = ['All', ...new Set(mockProducts.map(p => p.category))];
  
  const sortedAndFilteredProducts = useMemo(() => {
    let products = mockProducts
      .filter(p => filter === 'All' || p.category === filter)
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
    switch (sortOption) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        products.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default: // 'featured'
        break;
    }
    return products;
  }, [filter, searchTerm, sortOption]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
      <h1 className="text-4xl font-extrabold text-white text-center mb-4">All Supplies</h1>
      <p className="text-lg text-gray-300 text-center mb-8">Find exactly what you need for the next match.</p>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-4 md:mb-0">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                filter === category ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="appearance-none w-48 px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Sort: Price Low to High</option>
            <option value="price-desc">Sort: Price High to Low</option>
            <option value="name-asc">Sort: Name A-Z</option>
            <option value="name-desc">Sort: Name Z-A</option>
          </select>
          <ChevronDown className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Products Grid */}
      {sortedAndFilteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {sortedAndFilteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              setPage={setPage} 
              setSelectedProductId={setSelectedProductId} 
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 text-xl py-16">No products found matching your criteria.</p>
      )}
    </div>
  );
};