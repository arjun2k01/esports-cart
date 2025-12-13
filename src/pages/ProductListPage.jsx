// src/pages/ProductListPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCart, useWishlist } from '../context/AppProviders';
import { Search, SlidersHorizontal, X, ShoppingCart, Heart, AlertCircle } from 'lucide-react';
import axiosInstance from '../lib/axios';
import { toast } from 'react-hot-toast';
import Pagination from '../components/Pagination';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/products');
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))];
    return ['all', ...cats];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    if (stockFilter === 'inStock') {
      filtered = filtered.filter(p => p.countInStock > 0);
    } else if (stockFilter === 'outOfStock') {
      filtered = filtered.filter(p => p.countInStock === 0);
    }
    switch (sortBy) {
      case 'priceLowHigh':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'priceHighLow':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }
    return filtered;
  }, [products, searchQuery, selectedCategory, stockFilter, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setStockFilter('all');
    setSortBy('newest');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-neutral-800 rounded-2xl h-80"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button onClick={fetchProducts} className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            ALL <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">PRODUCTS</span>
          </h1>
          <p className="text-gray-400">Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-neutral-900/50 border border-neutral-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="flex-1 px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50">
              {categories.map(cat => (<option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>))}
            </select>
            <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className="flex-1 px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50">
              <option value="all">All Stock</option>
              <option value="inStock">In Stock</option>
              <option value="outOfStock">Out of Stock</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="flex-1 px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50">
              <option value="newest">Newest First</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
            </select>
            {(searchQuery || selectedCategory !== 'all' || stockFilter !== 'all' || sortBy !== 'newest') && (
              <button onClick={clearFilters} className="px-6 py-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl hover:bg-red-500/20 transition-all whitespace-nowrap">Clear Filters</button>
            )}
          </div>
        </div>
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No products found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all">Clear All Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all duration-300 group">
                <Link to={`/product/${product._id}`} className="block relative overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300" />
                  {product.countInStock === 0 ? (
                    <div className="absolute top-4 right-4 px-4 py-2 bg-red-500 rounded-full"><span className="text-xs font-bold text-white">SOLD OUT</span></div>
                  ) : product.countInStock < 5 ? (
                    <div className="absolute top-4 right-4 px-4 py-2 bg-orange-500 rounded-full"><span className="text-xs font-bold text-white">LOW STOCK</span></div>
                  ) : null}
                </Link>
                <div className="p-6">
                  <Link to={`/product/${product._id}`} className="text-xl font-bold text-white hover:text-orange-500 transition-colors line-clamp-2 mb-2 block">{product.name}</Link>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-3xl font-bold text-orange-500">₹{product.price.toLocaleString('en-IN')}</span>
                  </div>
                  {product.category && (<span className="inline-block px-3 py-1 bg-neutral-800 text-gray-400 text-xs rounded-full mb-4">{product.category}</span>)}
                  <div className="flex items-center gap-2 mb-4">
                    {product.countInStock > 0 ? (
                      <span className="text-sm text-green-500 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span>In Stock ({product.countInStock})</span>
                    ) : (
                      <span className="text-sm text-red-500 flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full"></span>Out of Stock</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {product.countInStock > 0 ? (
                      <button onClick={() => addToCart(product)} className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2">
                        <ShoppingCart className="w-4 h-4" />ADD
                      </button>
                    ) : (
                      <button disabled className="flex-1 px-4 py-3 bg-neutral-800 text-gray-500 font-semibold rounded-xl cursor-not-allowed flex items-center justify-center gap-2"><AlertCircle className="w-4 h-4" />SOLD OUT</button>
                    )}
                    <button onClick={() => addToWishlist(product)} className={`px-4 py-3 rounded-xl transition-all duration-200 ${isInWishlist(product._id) ? 'bg-orange-500 text-white' : 'bg-neutral-800 border border-neutral-700 text-gray-400 hover:text-orange-500'}`}>
                      <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
                              <Pagination
                    items={filteredProducts}
                    itemsPerPage={6}
                    onPageChange={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;
