// src/pages/ProductDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../lib/axios";
import { useCart } from "../context/AppProviders";

const ProductDetailPage = () => {
  const { id } = useParams();
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
      <div className="p-6 text-center text-gray-600">Loading product...</div>
    );

  if (error)
    return (
      <div className="p-6 text-center text-red-600 text-lg">{error}</div>
    );

  if (!product)
    return (
      <div className="p-6 text-center text-gray-600">Product not found.</div>
    );

  return (
    <div className="p-6 grid md:grid-cols-2 gap-8">
      {/* Product Image */}
      <div>
        <img
          src={product.image}
          alt={product.name}
          className="w-full max-h-96 object-cover rounded shadow"
        />
      </div>

      {/* Product Details */}
      <div>
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

        <p className="text-xl text-gray-700 mb-2">
          Price: <span className="font-semibold">₹{product.price}</span>
        </p>

        <p className="text-gray-600 mb-2">
          Category: <span className="font-semibold">{product.category}</span>
        </p>

        <p className="text-gray-600 mb-4">
          Brand: <span className="font-semibold">{product.brand}</span>
        </p>

        {product.countInStock > 0 ? (
          <p className="text-green-600 font-semibold mb-4">
            In Stock ({product.countInStock} available)
          </p>
        ) : (
          <p className="text-red-600 font-semibold mb-4">Out of Stock</p>
        )}

        {/* Quantity Selector */}
        {product.countInStock > 0 && (
          <div className="mb-6">
            <label className="mr-3 font-semibold">Quantity:</label>
            <select
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="p-2 border rounded"
            >
              {[...Array(product.countInStock).keys()].map((x) => (
                <option key={x + 1} value={x + 1}>
                  {x + 1}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.countInStock === 0}
          className={`w-full p-3 rounded text-white transition ${
            product.countInStock === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {product.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductDetailPage;
