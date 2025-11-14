// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart, useWishlist } from '../context/AppProviders';
import { ShoppingCart, Heart, ArrowLeft, Truck, Shield, RotateCcw, Star, Plus, Minus, Check, X, Loader2 } from 'lucide-react';
import axiosInstance from '../lib/axios';
import { toast } from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/products/${id}`);
      setProduct(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product. Please try again.');
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product && product.countInStock > 0) {
      addToCart(product, quantity);
      setQuantity(1);
    }
  };

  const handleBuyNow = () => {
    if (product && product.countInStock > 0) {
      addToCart(product, quantity);
      navigate('/checkout');
    }
  };

  const incrementQty = () => {
    if (quantity < product.countInStock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black py-12 px-4 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Product Not Found</h2>
          <p className="text-gray-400 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <Link to="/products" className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all inline-block">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-neutral-900/50 border border-neutral-800">
              <img src={images[selectedImage]} alt={product.name} className="w-full h-96 lg:h-[500px] object-cover" />
              {product.countInStock === 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-4xl font-bold text-red-500">OUT OF STOCK</span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <button key={idx} onClick={() => setSelectedImage(idx)} className={`relative overflow-hidden rounded-xl border-2 transition-all ${selectedImage === idx ? 'border-orange-500' : 'border-neutral-800 hover:border-neutral-700'}`}>
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-20 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            {product.category && (
              <span className="inline-block px-3 py-1 bg-orange-500/10 border border-orange-500/50 text-orange-500 text-sm rounded-full mb-4">
                {product.category}
              </span>
            )}
            <h1 className="text-4xl font-bold text-white mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < (product.rating || 4) ? 'text-orange-500 fill-orange-500' : 'text-gray-600'}`} />
                ))}
              </div>
              <span className="text-gray-400">({product.numReviews || 0} reviews)</span>
            </div>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-5xl font-bold text-orange-500">₹{product.price.toLocaleString('en-IN')}</span>
              {product.originalPrice && (
                <span className="text-2xl text-gray-500 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
              )}
            </div>
            {product.countInStock > 0 ? (
              <div className="flex items-center gap-2 mb-6">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-green-500 font-semibold">In Stock ({product.countInStock} available)</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-6">
                <X className="w-5 h-5 text-red-500" />
                <span className="text-red-500 font-semibold">Out of Stock</span>
              </div>
            )}
            {product.description && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-3">Description</h3>
                <p className="text-gray-400 leading-relaxed">{product.description}</p>
              </div>
            )}
            {product.countInStock > 0 && (
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-300 mb-3">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-neutral-900/50 border border-neutral-800 rounded-xl">
                    <button onClick={decrementQty} disabled={quantity <= 1} className="p-3 hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-l-xl">
                      <Minus className="w-5 h-5 text-white" />
                    </button>
                    <span className="px-6 py-3 font-bold text-white">{quantity}</span>
                    <button onClick={incrementQty} disabled={quantity >= product.countInStock} className="p-3 hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-r-xl">
                      <Plus className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-400">Max: {product.countInStock}</span>
                </div>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {product.countInStock > 0 ? (
                <>
                  <button onClick={handleBuyNow} className="flex-1 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/20">
                    BUY NOW
                  </button>
                  <button onClick={handleAddToCart} className="flex-1 px-8 py-4 bg-neutral-900/50 border border-neutral-800 text-white font-bold rounded-xl hover:bg-neutral-800 transition-all flex items-center justify-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    ADD TO CART
                  </button>
                </>
              ) : (
                <button disabled className="flex-1 px-8 py-4 bg-neutral-800 text-gray-500 font-bold rounded-xl cursor-not-allowed">
                  OUT OF STOCK
                </button>
              )}
              <button onClick={() => addToWishlist(product)} className={`px-8 py-4 rounded-xl transition-all ${isInWishlist(product._id) ? 'bg-orange-500 text-white' : 'bg-neutral-900/50 border border-neutral-800 text-white hover:bg-neutral-800'}`}>
                <Heart className={`w-6 h-6 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-neutral-900/50 border border-neutral-800 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Free Delivery</p>
                  <p className="text-gray-500 text-xs">On orders above ₹500</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Secure Payment</p>
                  <p className="text-gray-500 text-xs">100% protected</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                  <RotateCcw className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Easy Returns</p>
                  <p className="text-gray-500 text-xs">7 days return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
