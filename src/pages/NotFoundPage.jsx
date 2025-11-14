// src/pages/NotFoundPage.jsx
import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gaming-darker flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="inline-block relative">
            <span className="font-display text-[180px] md:text-[240px] font-black text-transparent bg-clip-text bg-gradient-to-r from-gaming-gold to-gaming-orange leading-none">
              404
            </span>
            <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-gaming-gold to-gaming-orange"></div>
          </div>
        </div>

        {/* Main Content */}
        <h1 className="font-display text-3xl md:text-5xl font-black text-white uppercase mb-4">
          Lost in the <span className="text-gaming-gold">Battlefield</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-md mx-auto">
          The page you're looking for has been eliminated from the game. Head back to base!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-gaming-orange hover:bg-gaming-gold text-black px-8 py-4 rounded-xl font-bold uppercase transition-all hover:scale-105 shadow-lg"
          >
            <Home size={20} />
            Back to Home
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 bg-surface-dark border-2 border-gray-700 hover:border-gaming-gold text-white px-8 py-4 rounded-xl font-bold uppercase transition-all hover:scale-105"
          >
            <Search size={20} />
            Browse Products
          </Link>
        </div>

        {/* Gaming Elements */}
        <div className="mt-16 grid grid-cols-3 gap-4 max-w-md mx-auto">
          <div className="bg-surface-dark border border-gray-800 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">🎮</div>
            <p className="text-gray-500 text-xs font-semibold uppercase">Continue Gaming</p>
          </div>
          <div className="bg-surface-dark border border-gray-800 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">🏆</div>
            <p className="text-gray-500 text-xs font-semibold uppercase">Top Products</p>
          </div>
          <div className="bg-surface-dark border border-gray-800 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">⚡</div>
            <p className="text-gray-500 text-xs font-semibold uppercase">Hot Deals</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
