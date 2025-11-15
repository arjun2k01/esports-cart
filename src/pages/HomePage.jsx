// src/pages/HomePage.jsx
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import ProductCard from "../components/ProductCard";
import { Zap, TrendingUp, Award, ChevronDown, Trophy, Users, Headphones } from "lucide-react";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gaming-darker">
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-96 bg-surface-dark animate-pulse rounded-2xl shadow"
            ></div>
          ))}
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gaming-darker flex items-center justify-center">
        <div className="text-center text-out-red text-xl font-bold">{error}</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gaming-darker">
      
      {/* 🔥 HERO SECTION - BGMI INSPIRED */}
      <section className="relative min-h-[700px] bg-gaming-dark overflow-hidden">
        
        {/* Animated Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute w-full h-full bg-gradient-to-br from-gaming-dark via-gaming-darker to-black opacity-90"></div>
          <div className="absolute top-20 left-10 w-96 h-96 bg-gaming-gold/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gaming-orange/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          {/* Diagonal lines pattern */}
          <div className="absolute inset-0 opacity-5" style={{ 
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,184,0,0.1) 35px, rgba(255,184,0,0.1) 70px)' 
          }}></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32 text-center">
          
          {/* Top Badge - Like BGMI */}
          <div className="inline-flex items-center gap-2 bg-gaming-orange/10 border-2 border-gaming-orange px-6 py-2 rounded-full mb-8 backdrop-blur-sm hover:bg-gaming-orange/20 transition-all">
            <Zap className="text-gaming-gold animate-pulse" size={20} />
            <span className="text-gaming-gold font-bold uppercase tracking-wider text-sm">
              Level Up Your Game
            </span>
          </div>

          {/* Main Headline - BGMI "INDIA KA BATTLEGROUNDS" Style */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-tight mb-6">
            <span className="text-white block mb-2">INDIA KA</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gaming-gold via-gaming-orange to-gaming-gold">
              GAMING STORE
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Premium gaming gear, legendary skins, and esports equipment. 
            <span className="text-gaming-gold font-semibold"> Everything champions need</span> to dominate the battlefield.
          </p>

          {/* CTA Buttons - Orange/Gold like BGMI */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button 
              onClick={scrollToProducts}
              className="group bg-gaming-orange hover:bg-gaming-gold text-black font-bold px-10 py-4 rounded-xl text-lg uppercase transition-all hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
            >
              <span>Shop Now</span>
              <ChevronDown className="group-hover:translate-y-1 transition-transform" size={20} />
            </button>
            <button 
              onClick={scrollToProducts}
              className="border-2 border-gaming-gold text-gaming-gold hover:bg-gaming-gold hover:text-black font-bold px-10 py-4 rounded-xl text-lg uppercase transition-all hover:scale-105"
            >
              Browse UC Packs
            </button>
          </div>

          {/* Stats Section - Gaming Metrics */}
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

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="text-gaming-gold" size={32} />
        </div>
      </section>

      {/* 🎯 FEATURED CATEGORIES SECTION */}
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
                onClick={scrollToProducts}
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
      <section id="products" className="bg-gaming-darker py-16">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Section Header */}
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

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎮</div>
              <div className="text-gray-400 text-xl">No products available at the moment.</div>
              <p className="text-gray-500 mt-2">Check back soon for amazing deals!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 🎖️ FEATURES SECTION */}
      <section className="bg-gaming-dark py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-gaming-gold to-gaming-orange rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Award size={32} className="text-black" />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-2 uppercase">Premium Quality</h3>
              <p className="text-gray-400">Authentic products from trusted brands</p>
            </div>

            {/* Feature 2 */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-gaming-gold to-gaming-orange rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Zap size={32} className="text-black" />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-2 uppercase">Fast Delivery</h3>
              <p className="text-gray-400">Get your gear delivered in 24-48 hours</p>
            </div>

            {/* Feature 3 */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-gaming-gold to-gaming-orange rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Headphones size={32} className="text-black" />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-2 uppercase">24/7 Support</h3>
              <p className="text-gray-400">Our team is always here to help you</p>
            </div>
          </div>
        </div>
      </section>

      {/* 📣 CTA BANNER */}
      <section className="bg-gradient-to-r from-gaming-orange via-gaming-gold to-gaming-orange py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-black uppercase text-black mb-4">
            Ready to Dominate?
          </h2>
          <p className="text-black/80 text-xl mb-8">
            Join thousands of gamers who trust us for their gaming needs
          </p>
          <button 
            onClick={scrollToProducts}
            className="bg-black text-gaming-gold font-bold px-12 py-4 rounded-xl text-lg uppercase hover:scale-105 transition-all shadow-2xl"
          >
            Start Shopping
          </button>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
