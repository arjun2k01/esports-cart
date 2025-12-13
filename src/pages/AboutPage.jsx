// src/pages/AboutPage.jsx
import { Award, Users, Shield, Zap, Target, TrendingUp } from "lucide-react";

const AboutPage = () => {
  const stats = [
    { icon: <Users size={32} />, number: "10K+", label: "Active Gamers" },
    { icon: <Award size={32} />, number: "500+", label: "Products" },
    { icon: <Shield size={32} />, number: "100%", label: "Authentic" },
    { icon: <Zap size={32} />, number: "24/7", label: "Support" },
  ];

  const values = [
    { icon: <Target size={24} />, title: "Quality First", description: "We only stock authentic gaming gear from trusted brands" },
    { icon: <TrendingUp size={24} />, title: "Best Prices", description: "Competitive pricing with regular deals and offers" },
    { icon: <Shield size={24} />, title: "Secure Shopping", description: "Your data and transactions are 100% safe with us" },
    { icon: <Users size={24} />, title: "Community", description: "Built by gamers, for gamers - we understand your needs" },
  ];

  return (
    <div className="min-h-screen bg-gaming-darker">
      
      {/* Hero Section */}
      <section className="relative bg-gaming-dark py-20 border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-gaming-gold/5 to-gaming-orange/5"></div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-gaming-orange/10 border border-gaming-orange px-4 py-2 rounded-full mb-6">
            <Zap className="text-gaming-gold" size={18} />
            <span className="text-gaming-gold font-bold uppercase text-sm">About Us</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black text-white uppercase mb-6 leading-tight">
            INDIA KA <span className="text-gaming-gold">GAMING HUB</span>
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            We're passionate gamers building the ultimate destination for esports equipment, gaming gear, and everything you need to dominate the battlefield.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gaming-darker">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-surface-dark border border-gray-800 rounded-2xl p-6 text-center hover:border-gaming-gold transition-all group">
                <div className="w-16 h-16 bg-gaming-gold/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <div className="text-gaming-gold">{stat.icon}</div>
                </div>
                <div className="font-display text-4xl font-black text-gaming-gold mb-2">{stat.number}</div>
                <div className="text-gray-400 font-semibold uppercase text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gaming-dark">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-display text-4xl md:text-5xl font-black text-white uppercase text-center mb-12">
            Our <span className="text-gaming-gold">Story</span>
          </h2>
          <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
            <p>
              E-Sports Cart was born from a simple idea: every gamer deserves access to high-quality gaming gear without breaking the bank. As passionate BGMI players ourselves, we know the frustration of finding authentic products at fair prices.
            </p>
            <p>
              We started in 2024 with a mission to bridge the gap between gamers and premium gaming equipment. Today, we serve over 10,000+ gamers across India, providing everything from UC packs to gaming peripherals.
            </p>
            <p>
              Our team consists of professional gamers, esports enthusiasts, and tech experts who live and breathe gaming culture. We understand what it takes to win because we're right there with you on the battlefield.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gaming-darker">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display text-4xl md:text-5xl font-black text-white uppercase text-center mb-12">
            What We <span className="text-gaming-gold">Stand For</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, idx) => (
              <div key={idx} className="bg-surface-dark border border-gray-800 rounded-2xl p-8 hover:border-gaming-gold transition-all group">
                <div className="w-14 h-14 bg-gaming-gold/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <div className="text-gaming-gold">{value.icon}</div>
                </div>
                <h3 className="font-display text-2xl font-bold text-white uppercase mb-3">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gaming-orange to-gaming-gold">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-black text-black uppercase mb-6">
            Join The Community
          </h2>
          <p className="text-black/80 text-xl mb-8">
            Become part of India's fastest-growing gaming community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/" className="bg-black text-gaming-gold px-8 py-4 rounded-xl font-bold uppercase hover:scale-105 transition-all inline-block">
              Start Shopping
            </a>
            <a href="/products" className="bg-white text-black px-8 py-4 rounded-xl font-bold uppercase hover:scale-105 transition-all inline-block">
              Browse Products
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
