// src/pages/ProductDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../lib/axios";
import { useCart } from "../context/AppProviders";
import { ShoppingCart, Heart, ArrowLeft, Package, Shield, Truck } from "lucide-react";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      setError("Failed to load product");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gaming-darker flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gaming-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-semibold">Loading product...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gaming-darker flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-out-red text-xl font-bold mb-4">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-gaming-orange text-black px-6 py-3 rounded-lg font-bold hover:bg-gaming-gold transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen bg-gaming-darker flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-gray-400 text-xl mb-4">Product not found.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-gaming-orange text-black px-6 py-3 rounded-lg font-bold hover:bg-gaming-gold transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gaming-darker py-12">
      <div className="max-w-7xl mx-auto px-6">
        
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-gaming-gold mb-8 font-semibold transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <div className="bg-surface-dark rounded-2xl overflow-hidden border border-gray-800 p-8">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto max-h-[500px] object-contain rounded-xl"
            />
          </div>

          <div>
            <h1 className="font-display text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-display text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gaming-gold to-gaming-orange">
                ₹{product.price?.toLocaleString('en-IN')}
              </span>
            </div>

            {product.countInStock > 0 ? (
              <div className="flex items-center gap-2 bg-stock-green/10 border border-stock-green px-4 py-3 rounded-lg mb-6">
                <div className="w-2 h-2 rounded-full bg-stock-green animate-pulse"></div>
                <span className="text-stock-green font-bold uppercase text-sm">
                  In Stock ({product.countInStock} available)
                </span>
              </div>
            ) : (
              <div className="bg-out-red/10 border border-out-red px-4 py-3 rounded-lg mb-6">
                <span className="text-out-red font-bold uppercase text-sm">Out of Stock</span>
              </div>
            )}

            <div className="bg-surface-dark border border-gray-800 rounded-xl p-6 mb-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Category:</span>
                <span className="font-bold text-white">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Brand:</span>
                <span className="font-bold text-white">{product.brand}</span>
              </div>
            </div>

            {product.countInStock > 0 && (
              <div className="mb-6">
                <label className="block text-gray-400 font-semibold mb-3">
                  Quantity:
                </label>
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="bg-surface-dark border border-gray-700 text-white px-4 py-3 rounded-lg font-bold focus:outline-none focus:border-gaming-gold transition w-full md:w-auto"
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.countInStock === 0}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-8 rounded-xl font-bold uppercase transition-all ${
                  product.countInStock === 0
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gaming-orange hover:bg-gaming-gold text-black hover:scale-105 shadow-lg"
                }`}
              >
                <ShoppingCart size={20} />
                {product.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
              
              <button className="px-6 py-4 bg-surface-dark border-2 border-gray-700 hover:border-gaming-gold text-white rounded-xl transition-all">
                <Heart size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-surface-dark border border-gray-800 rounded-lg p-4 text-center">
                <Truck className="text-gaming-gold mx-auto mb-2" size={24} />
                <p className="text-sm text-gray-400 font-semibold">Free Delivery</p>
              </div>
              <div className="bg-surface-dark border border-gray-800 rounded-lg p-4 text-center">
                <Shield className="text-gaming-gold mx-auto mb-2" size={24} />
                <p className="text-sm text-gray-400 font-semibold">Secure Payment</p>
              </div>
              <div className="bg-surface-dark border border-gray-800 rounded-lg p-4 text-center">
                <Package className="text-gaming-gold mx-auto mb-2" size={24} />
                <p className="text-sm text-gray-400 font-semibold">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
