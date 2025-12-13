// src/components/SearchBar.jsx
import { useState } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setQuery("");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-gaming-darker border border-gray-700 hover:border-gaming-gold text-gray-400 px-4 py-2 rounded-lg transition-all"
      >
        <Search size={18} />
        <span className="hidden md:inline text-sm">Search products...</span>
        <kbd className="hidden md:inline-block bg-surface-dark border border-gray-700 px-2 py-1 rounded text-xs">⌘K</kbd>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4">
          <div className="w-full max-w-2xl bg-surface-dark border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            <form onSubmit={handleSearch} className="flex items-center gap-3 p-4 border-b border-gray-800">
              <Search className="text-gray-400" size={24} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products, skins, UC packs..."
                autoFocus
                className="flex-1 bg-transparent text-white text-lg focus:outline-none placeholder:text-gray-500"
              />
              <button type="button" onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition">
                <X size={24} />
              </button>
            </form>
            <div className="p-4 text-gray-400 text-sm">
              Press <kbd className="bg-gaming-darker border border-gray-700 px-2 py-1 rounded text-xs">Enter</kbd> to search
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchBar;
