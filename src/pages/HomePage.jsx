// src/pages/HomePage.jsx
import { useEffect, useState, useRef, useMemo } from "react";
import axios from "../lib/axios";
import ProductCard from "../components/ProductCard";
import ProductFilter from "../components/ProductFilter";
import { ProductGridSkeleton } from "../components/LoadingSkeletons";
import { Zap, TrendingUp, Award, ChevronDown, Trophy, Users, Headphones } from "lucide-react";
import { toast } from 'react-hot-toast'; // ✅ ADDED

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // ✅ FIXED: Added active filters state
  const [activeFilters, setActiveFilters] = useState({
    query: '',
    categories: [],
    tags: [],
    platforms: [],
    modes: [],
    price: [0, 50000],
    minRating: 0
  });
  
  // ✅ FIXED: Added sort type state
  const [sortType, setSortType] = useState('relevance');
  
  // Filter metadata
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [modes, setModes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 50000]); // ✅ FIXED: Higher ceiling
  
  // ✅ FIXED: Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState('idle');
  
  // ✅ FIXED: Ref for smooth scroll
  const productsRef = useRef(null);
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("/products");
      const data = res.data;
      setProducts(data);
      setFilteredProducts(data);
      
      // Extract unique values for filters
      const uniqueCats = [...new Set(data.map(p => p.category).filter(Boolean))];
      const uniqueTags = [...new Set(data.flatMap(p => p.tags || []))];
      const uniquePlatforms = [...new Set(data.map(p => p.platform).filter(Boolean))];
      const uniqueModes = [...new Set(data.map(p => p.mode).filter(Boolean))];
      const prices = data.map(p => p.price || 0);
      
      setCategories(uniqueCats);
      setTags(uniqueTags);
      setPlatforms(uniquePlatforms);
      setModes(uniqueModes);
      
      if (prices.length > 0) {
        setPriceRange([Math.min(...prices), Math.max(...prices)]);
        setActiveFilters(prev => ({
          ...prev,
          price: [Math.min(...prices), Math.max(...prices)]
        }));
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          "Failed to load products. Please check your connection.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  
  // ✅ FIXED: Memoized filtering with sort applied
  const processedProducts = useMemo(() => {
    let result = [...products];
    
    // Apply filters
    if (activeFilters.query) {
      result = result.filter(p => 
        p.name?.toLowerCase().includes(activeFilters.query.toLowerCase()) ||
        p.description?.toLowerCase().includes(activeFilters.query.toLowerCase())
      );
    }
    
    if (activeFilters.categories && activeFilters.categories.length > 0) {
      result = result.filter(p => activeFilters.categories.includes(p.category));
    }
    
    if (activeFilters.tags && activeFilters.tags.length > 0) {
      result = result.filter(p => 
        p.tags?.some(tag => activeFilters.tags.includes(tag))
      );
    }
    
    if (activeFilters.platforms && activeFilters.platforms.length > 0) {
      result = result.filter(p => activeFilters.platforms.includes(p.platform));
    }
    
    if (activeFilters.modes && activeFilters.modes.length > 0) {
      result = result.filter(p => activeFilters.modes.includes(p.mode));
    }
    
    if (activeFilters.price) {
      result = result.filter(p => 
        p.price >= activeFilters.price[0] && p.price <= activeFilters.price[1]
      );
    }
    
    if (activeFilters.minRating) {
      result = result.filter(p => (p.rating || 0) >= activeFilters.minRating);
    }
    
    // Apply sort
    switch(sortType) {
      case 'price_low':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price_high':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'top_seller':
        result.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
        break;
      default:
        break;
    }
    
    return result;
  }, [products, activeFilters, sortType]);
  
  // ✅ Update filteredProducts when processedProducts changes
  useEffect(() => {
    setFilteredProducts(processedProducts);
  }, [processedProducts]);

  const handleFilter = (filters) => {
    setActiveFilters(filters);
  };

  const handleSort = (newSortType) => {
    setSortType(newSortType);
  };
  
  // ✅ FIXED: Newsletter submission handler
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    if (!newsletterEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setSubscribeStatus('loading');
    
    try {
      await axios.post('/newsletter/subscribe', { email: newsletterEmail });
      toast.success('Successfully subscribed! Check your inbox.');
      setNewsletterEmail('');
      setSubscribeStatus('success');
      setTimeout(() => setSubscribeStatus('idle'), 3000);
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      toast.error(err.response?.data?.message || 'Subscription failed. Please try again.');
      setSubscribeStatus('error');
      setTimeout(() => setSubscribeStatus('idle'), 3000);
    }
  };

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // ✅ FIXED: Handle category filter and scroll
  const handleCategoryClick = (categoryName) => {
    handleFilter({
      ...activeFilters,
      categories: [categoryName]
    });
    scrollToProducts();
  };

  return (
    <div className="min-h-screen bg-gaming-darker">
      
      {/* 🔥 HERO SECTION */}
      <section className="relative min-h-[700px] bg-gaming-dark overflow-hidden">
        
        {/* Animated Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute w-full h-full bg-gradient-to-br from-gaming-dark via-gaming-darker to-black opacity-90"></div>
          <div className="absolute top-20 left-10 w-96 h-96 bg-gaming-gold/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gaming-orange/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute inset-0 opacity-5" style={{ 
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,184,0,0.1) 35px, rgba(255,184,0,0.1) 70px)' 
          }}></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32 text-center">
          
          <div className="inline-flex items-center gap-2 bg-gaming-orange/10 border-2 border-gaming-orange px-6 py-2 rounded-full mb-8 backdrop-blur-sm hover:bg-gaming-orange/20 transition-all">
            <Zap className="text-gaming-gold animate-pulse" size={20} />
            <span className="text-gaming-gold font-bold uppercase tracking-wider text-sm">
              Level Up Your Game
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-tight mb-6">
            <span className="text-white block mb-2">INDIA KA</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gaming-gold via-gaming-orange to-gaming-gold">
              GAMING STORE
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Premium gaming gear, legendary skins, and esports equipment. 
            <span className="text-gaming-gold font-semibold"> Everything champions need</span> to dominate the battlefield.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button 
              onClick={scrollToProducts}
              className="group bg-gaming-orange hover:bg-gaming-gold text-black font-bold px-10 py-4 rounded-xl text-lg uppercase transition-all hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
            >
              <span>Shop Now</span>
              <ChevronDown className="group-hover:translate-y-1 transition-transform" size={20} />
            </button>
            <button 
              onClick={() => {
                handleCategoryClick('UC Packs');
              }}
              className="border-2 border-gaming-gold text-gaming-gold hover:bg-gaming-gold hover:text-black font-bold px-10 py-4 rounded-xl text-lg uppercase transition-all hover:scale-105"
            >
              Browse UC Packs
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6 md:gap-8 max-w-3xl mx-auto pt-8 border-t border-gray-800">
            <div className="text-center group cursor-default">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="text-gaming-gold" size={32} />
              </div>
              <div className="text-3xl md:text-4xl font-black text-gaming-gold group-hover:scale-110 transition-transform">500+</div>
              <div className="text-gray-400 uppercase text-xs md:text-sm mt-1 font-semibold">Products</div>
            </div>
            <div className="text-center group cursor-default">
              <div className="flex items-center justify-center mb-2">
                <Users className="text-gaming-gold" size={32} />
              </div>
              <div className="text-3xl md:text-4xl font-black text-gaming-gold group-hover:scale-110 transition-transform">10K+</div>
              <div className="text-gray-400 uppercase text-xs md:text-sm mt-1 font-semibold">Happy Gamers</div>
            </div>
            <div className="text-center group cursor-default">
              <div className="flex items-center justify-center mb-2">
                <Headphones className="text-gaming-gold" size={32} />
              </div>
              <div className="text-3xl md:text-4xl font-black text-gaming-gold group-hover:scale-110 transition-transform">24/7</div>
              <div className="text-gray-400 uppercase text-xs md:text-sm mt-1 font-semibold">Support</div>
            </div>
          </div>

        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="text-gaming-gold" size={32} />
        </div>

      </section>

      {/* 🎯 FEATURED CATEGORIES */}
      <section className="bg-gaming-darker py-12 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Gaming Skins", icon: "🎮", color: "from-gaming-gold to-yellow-500" },
              { name: "UC Packs", icon: "💎", color: "from-gaming-orange to-red-500" },
              { name: "Headsets", icon: "🎧", color: "from-purple-500 to-pink-500" },
              { name: "Accessories", icon: "⚡", color: "from-blue-500 to-cyan-500" },
            ].map((category, idx) => (
              <button
                key={idx}
                onClick={() => handleCategoryClick(category.name)}
                className="group bg-surface-dark hover:bg-gaming-dark border border-gray-800 hover:border-gaming-gold rounded-xl p-6 transition-all hover:scale-105"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <div className={`font-bold text-transparent bg-clip-text bg-gradient-to-r ${category.color} group-hover:scale-110 transition-transform`}>
                  {category.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 🛍️ PRODUCTS SECTION */}
      <section ref={productsRef} id="products" className="bg-gaming-darker py-16">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gaming-orange/10 border border-gaming-orange px-4 py-2 rounded-full mb-4">
              <TrendingUp className="text-gaming-gold" size={18} />
              <span className="text-gaming-gold font-bold uppercase text-sm">Hot Deals</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-black uppercase mb-4">
              <span className="text-white">FEATURED </span>
              <span className="text-gaming-gold">PRODUCTS</span>
            </h2>
            <p className="text-gray-400 text-lg">Gear up with the best gaming equipment</p>
          </div>

          {!loading && products.length > 0 && (
            <div className="mb-8">
              <ProductFilter
                categories={categories}
                tags={tags}
                platforms={platforms}
                modes={modes}
                minPrice={priceRange[0]}
                maxPrice={priceRange[1]}
                onFilter={handleFilter}
                onSort={handleSort}
              />
            </div>
          )}

          {loading ? (
            <ProductGridSkeleton count={6} />
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">❌</div>
              <div className="text-red-500 text-xl font-bold">{error}</div>
              <button 
                onClick={fetchProducts} 
                className="mt-4 bg-gaming-orange text-black px-6 py-2 rounded-lg font-bold hover:bg-gaming-gold transition"
              >
                Retry
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <div className="text-gray-400 text-xl">No products match your filters.</div>
              <p className="text-gray-500 mt-2">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {filteredProducts.length > 0 && (
            <div className="text-center mt-12">
              <div className="text-gray-400 mb-4">
                Showing <span className="text-gaming-gold font-bold">{filteredProducts.length}</span> of{" "}
                <span className="text-gaming-gold font-bold">{products.length}</span> products
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 🏆 WHY CHOOSE US */}
      <section className="bg-gaming-dark py-16 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-5xl font-black uppercase mb-4">
              <span className="text-white">WHY CHOOSE </span>
              <span className="text-gaming-gold">ESPORTS CART</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="text-gaming-gold" size={48} />,
                title: "Instant Delivery",
                description: "Get your digital products delivered instantly to your email after purchase."
              },
              {
                icon: <Award className="text-gaming-gold" size={48} />,
                title: "Authentic Products",
                description: "100% genuine gaming products and official UC packs verified by us."
              },
              {
                icon: <Headphones className="text-gaming-gold" size={48} />,
                title: "24/7 Support",
                description: "Round-the-clock customer support to help you with any queries or issues."
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group bg-surface-dark hover:bg-gaming-darker border border-gray-800 hover:border-gaming-gold rounded-xl p-8 transition-all hover:scale-105 text-center"
              >
                <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 uppercase">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🎮 NEWSLETTER */}
      <section className="bg-gradient-to-r from-gaming-dark via-gaming-darker to-gaming-dark py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-gaming-orange/10 border border-gaming-orange px-4 py-2 rounded-full mb-6">
            <Trophy className="text-gaming-gold" size={18} />
            <span className="text-gaming-gold font-bold uppercase text-sm">Exclusive Offers</span>
          </div>
          
          <h2 className="font-display text-3xl md:text-5xl font-black uppercase mb-4">
            <span className="text-white">JOIN THE </span>
            <span className="text-gaming-gold">WINNER'S CIRCLE</span>
          </h2>
          
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to get exclusive deals, new product drops, and gaming tips delivered straight to your inbox.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 bg-surface-dark border-2 border-gray-800 focus:border-gaming-gold text-white px-6 py-4 rounded-xl outline-none transition-all"
              required
              disabled={subscribeStatus === 'loading'}
            />
            <button 
              type="submit"
              disabled={subscribeStatus === 'loading'}
              className="bg-gaming-orange hover:bg-gaming-gold text-black font-bold px-8 py-4 rounded-xl uppercase transition-all hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {subscribeStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>

          <p className="text-gray-500 text-sm mt-4">
            🔒 We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* 🎯 TRUSTED BY */}
      <section className="bg-gaming-darker py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <p className="text-gray-500 uppercase text-sm font-bold tracking-wider">Trusted by Top Esports Teams</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="bg-surface-dark border border-gray-800 rounded-lg px-8 py-4 text-gray-600 font-bold"
              >
                TEAM LOGO {i}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
