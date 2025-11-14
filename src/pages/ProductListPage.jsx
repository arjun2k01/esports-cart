// src/pages/ProductListPage.jsx
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import ProductCard from "../components/ProductCard";
import { Search, SlidersHorizontal } from "lucide-react";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Skins", "Currency", "Gaming Gear", "Accessories"];

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/products");
      setProducts(res.data);
    } catch (err) {
      setError("Failed to load products");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gaming-darker">
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-96 bg-surface-dark animate-pulse rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gaming-darker flex items-center justify-center">
        <div className="text-center text-out-red text-xl font-bold">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-darker py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-black text-white uppercase mb-4">
            All <span className="text-gaming-gold">Products</span>
          </h1>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-surface-dark border border-gray-700 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-gaming-gold transition"
              />
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="text-gray-400" size={20} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-surface-dark border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-gaming-gold transition font-semibold"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-gray-400">Showing {filteredProducts.length} product(s)</p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎮</div>
            <div className="text-gray-400 text-xl">No products found</div>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;
