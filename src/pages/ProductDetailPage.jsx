// src/pages/ProductDetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from '../lib/axios';
import { Star, ShoppingCart, Heart, Share2, Package, Shield, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/products/${id}`);
      setProduct(res.data);
    } catch (error) {
      toast.error('Failed to load product');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gaming-darker flex items-center justify-center">
        <div className="text-gaming-gold text-2xl">Loading...</div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gaming-darker py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <div className="text-gray-400 mb-6 flex items-center gap-2">
          <button onClick={() => navigate('/')} className="hover:text-gaming-gold">
            Home
          </button>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="bg-surface-dark rounded-xl overflow-hidden mb-4">
              <img
                src={product.images?.[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`rounded-lg overflow-hidden border-2 ${
                      selectedImage === idx ? 'border-gaming-gold' : 'border-gray-800'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-20 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-black text-white mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < (product.rating || 0) ? 'fill-gaming-gold text-gaming-gold' : 'text-gray-600'}
                  />
                ))}
              </div>
              <span className="text-gray-400">({product.reviews || 0} reviews)</span>
            </div>

            <div className="text-5xl font-black text-gaming-gold mb-6">
              ₹{product.price}
            </div>

            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-white font-bold">Quantity:</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-gaming-dark hover:bg-gaming-gold/20 px-4 py-2 rounded-lg text-gaming-gold font-bold"
                >
                  -
                </button>
                <span className="text-white font-bold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="bg-gaming-dark hover:bg-gaming-gold/20 px-4 py-2 rounded-lg text-gaming-gold font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => {
                  addToCart(product, quantity);
                  setQuantity(1);
                }}
                className="flex-1 bg-gaming-orange hover:bg-gaming-gold text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
              
              <button className="bg-surface-dark hover:bg-gaming-dark border border-gray-800 hover:border-gaming-gold p-4 rounded-xl transition-all">
                <Heart size={24} className="text-gaming-gold" />
              </button>
              
              <button className="bg-surface-dark hover:bg-gaming-dark border border-gray-800 hover:border-gaming-gold p-4 rounded-xl transition-all">
                <Share2 size={24} className="text-gaming-gold" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-surface-dark border border-gray-800 rounded-xl p-4 text-center">
                <Package className="text-gaming-gold mx-auto mb-2" size={32} />
                <div className="text-white font-bold text-sm">Fast Delivery</div>
              </div>
              <div className="bg-surface-dark border border-gray-800 rounded-xl p-4 text-center">
                <Shield className="text-gaming-gold mx-auto mb-2" size={32} />
                <div className="text-white font-bold text-sm">Authentic</div>
              </div>
              <div className="bg-surface-dark border border-gray-800 rounded-xl p-4 text-center">
                <Zap className="text-gaming-gold mx-auto mb-2" size={32} />
                <div className="text-white font-bold text-sm">Instant Access</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
