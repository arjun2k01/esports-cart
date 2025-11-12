import React, { useState } from 'react';
import { ArrowLeft, Minus, Plus, Star, Zap, Loader2 } from 'lucide-react';
// FIX: Import useProducts and remove mockProducts
import { useProducts, useCart, useToast, useReviews, useAuth } from '../context/AppProviders';
import { callGeminiAPI } from '../lib/gemini';
import { FormError, StarRating } from '../components/Common';

export const ProductDetailPage = ({ productId, setPage }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { addReview, getReviewsForProduct } = useReviews();
  const { user } = useAuth();
  
  // FIX: Get products, loading, and error from the real backend context
  const { products, loading, error } = useProducts();
  
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  
  const [aiInsight, setAiInsight] = useState("");
  const [isAiInsightLoading, setIsAiInsightLoading] = useState(false);
  const [aiInsightError, setAiInsightError] = useState("");
  const [reviewSummary, setReviewSummary] = useState("");
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  
  // FIX: Find the product in the live 'products' array using the MongoDB _id (or fallback id)
  const product = products.find(p => (p._id || p.id) === productId);
  
  // FIX: Get reviews using the correct ID
  const reviews = product ? getReviewsForProduct(product._id || product.id) : [];

  // FIX: Handle loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-12 w-12 text-blue-400 animate-spin" />
      </div>
    );
  }

  // FIX: Handle error or missing product
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">{error || 'Product not found!'}</h2>
        <button onClick={() => setPage('products')} className="px-6 py-2 bg-blue-500 text-white font-bold rounded-md shadow-lg hover:bg-blue-400">
          Back to Products
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showToast(`${product.name} (x${quantity}) added to cart!`);
    setPage('cart');
  };
  
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (reviewRating === 0 || !reviewText) {
      showToast('Please provide a rating and a review.', 'error');
      return;
    }
    // FIX: Use the correct product ID for the review
    addReview(product._id || product.id, {
      author: user?.name || 'AnonymousGamer',
      rating: reviewRating,
      text: reviewText,
    });
    setReviewRating(0);
    setReviewText("");
    showToast('Review submitted!');
  };

  // ... (The rest of the file, including handleGetAiInsight and JSX, remains the same) ...
  // I will provide the full file content below to be safe.

  const handleGetAiInsight = async () => {
    setIsAiInsightLoading(true);
    setAiInsight("");
    setAiInsightError("");

    let systemPrompt = "You are a helpful expert.";
    let userQuery = `Tell me something interesting about the '${product.name}'.`;

    if (product.category === 'Weapon Skins') {
      systemPrompt = "You are a pro-level BGMI (Battlegrounds Mobile India) esports analyst and strategist.";
      userQuery = `I'm planning to use the '${product.name}'. Suggest a complete tactical loadout for me. Include a recommended secondary weapon, all attachments for both weapons, and a short, aggressive strategy for the Erangel map. Format it clearly.`;
    } else if (product.category === 'Outfits') {
      systemPrompt = "You are a creative storyteller and lore writer for a fantasy battle royale game.";
      userQuery = `Write a short, epic character backstory for a player wearing the '${product.name}'. Make it sound legendary and fitting for the BGMI universe.`;
    } else if (product.category === 'Gear') {
      systemPrompt = "You are a professional tech reviewer specializing in esports hardware.";
      userQuery = `Give me a short, hard-hitting review of the '${product.name}'. Focus on why this would give a player a competitive edge in a game like BGMI.`;
    }

    try {
      const text = await callGeminiAPI(systemPrompt, userQuery);
      setAiInsight(text);
    } catch (error) {
      setAiInsightError("Failed to get AI insight. Please try again later.");
      showToast('Error generating AI insight.', 'error');
    } finally {
      setIsAiInsightLoading(false);
    }
  };

  const handleSummarizeReviews = async () => {
    setIsSummaryLoading(true);
    setReviewSummary("");

    const reviewText = reviews.map(r => `${r.author} (${r.rating} stars): ${r.text}`).join("\n\n");
    const systemPrompt = "You are a helpful e-commerce assistant. Concisely summarize the following customer reviews in a single paragraph. Highlight the main pros and cons mentioned by the users.";
    
    try {
      const text = await callGeminiAPI(systemPrompt, reviewText);
      setReviewSummary(text);
    } catch (error) {
      showToast('Failed to summarize reviews.', 'error');
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const getAiButtonText = () => {
    if (product.category === 'Weapon Skins') return "✨ Get Tactical Loadout";
    if (product.category === 'Outfits') return "✨ Get Outfit Backstory";
    return "✨ Get AI Product Insight";
  };
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
      <button onClick={() => setPage('products')} className="flex items-center text-gray-300 hover:text-white mb-6">
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Products
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x600/2d3748/FFFFFF?text=Image+Error'; }}
          />
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-sm font-bold text-yellow-300 uppercase tracking-wider">{product.category}</span>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mt-2 mb-4">{product.name}</h1>
          <p className="text-3xl font-bold text-blue-400 mb-6">₹{product.price.toLocaleString('en-IN')}</p>
          <p className="text-gray-300 text-lg mb-8">{product.description}</p>
          <div className="flex items-center gap-4 mb-8">
            <span className="text-white font-medium">Quantity:</span>
            <div className="flex items-center border border-gray-600 rounded-md">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-l-md">
                <Minus className="h-5 w-5" />
              </button>
              <span className="px-4 py-2 text-white font-bold w-16 text-center">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-r-md">
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            className="w-full lg:w-auto px-10 py-4 bg-yellow-400 text-gray-900 font-bold text-lg rounded-md shadow-lg hover:bg-yellow-300 transform hover:scale-105 transition-all"
          >
            Add to Cart
          </button>
          
          <div className="mt-8">
            <button
              onClick={handleGetAiInsight}
              disabled={isAiInsightLoading}
              className="w-full lg:w-auto px-10 py-3 bg-blue-600 text-white font-bold text-lg rounded-md shadow-lg hover:bg-blue-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAiInsightLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5" />
                  {getAiButtonText()}
                </>
              )}
            </button>
            
            {aiInsightError && (
              <div className="mt-4 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">
                <FormError message={aiInsightError} />
              </div>
            )}
            
            {aiInsight && (
              <div className="mt-4 p-5 bg-gray-800 border border-gray-700 rounded-lg shadow-inner">
                <h4 className="text-xl font-bold text-yellow-300 mb-3">AI Insight</h4>
                <p className="text-gray-200 whitespace-pre-wrap font-mono">{aiInsight}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-16 pt-12 border-t border-gray-700">
        <h2 className="text-3xl font-extrabold text-white mb-8">Player Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-white mb-4">Leave a Review</h3>
            {user ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Your Rating</label>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <button type="button" key={i} onClick={() => setReviewRating(i + 1)}>
                        <Star className={`h-6 w-6 ${i < reviewRating ? 'text-yellow-400 fill-current' : 'text-gray-600 hover:text-yellow-400'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="reviewText">Your Review</label>
                  <textarea
                    id="reviewText"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows="4"
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us what you think..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-2 bg-blue-500 text-white font-bold rounded-md shadow-lg hover:bg-blue-400 transition-colors"
                >
                  Submit Review
                </button>
              </form>
            ) : (
              <p className="text-gray-400">Please <button onClick={() => setPage('login')} className="text-blue-400 hover:underline">log in</button> to leave a review.</p>
            )}
            
            {reviews.length > 1 && (
              <div className="mt-8 pt-6 border-t border-gray-700">
                <h4 className="text-xl font-bold text-white mb-3">AI Review Summary</h4>
                <button
                  onClick={handleSummarizeReviews}
                  disabled={isSummaryLoading}
                  className="w-full px-6 py-2 bg-gray-600 text-white font-bold rounded-md shadow-lg hover:bg-gray-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSummaryLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Summarizing...
                    </>
                  ) : (
                    "✨ Summarize Reviews"
                  )}
                </button>
                
                {reviewSummary && (
                  <div className="mt-4 p-4 bg-gray-900 border border-gray-700 rounded-lg shadow-inner">
                    <p className="text-gray-300 whitespace-pre-wrap">{reviewSummary}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map(review => (
                <div key={review.id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-bold text-white">{review.author}</h4>
                    <span className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString('en-IN')}</span>
                  </div>
                  <StarRating rating={review.rating} />
                  <p className="text-gray-300 mt-3">{review.text}</p>
                </div>
              ))
            ) : (
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                <p className="text-gray-400">No reviews yet. Be the first!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};