// src/pages/ProductListPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "../lib/axios";
import ProductCard from "../components/ProductCard";

const ProductListPage = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useError("");

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`/products?keyword=${keyword}`);
      setProducts(res.data);
    } catch (err) {
      setError("Failed to load products");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [keyword]);

  if (loading)
    return (
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-60 bg-gray-200 animate-pulse rounded shadow"
          ></div>
        ))}
      </div>
    );

  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {keyword ? `Search Results for "${keyword}"` : "All Products"}
      </h1>

      {products.length === 0 ? (
        <div className="text-center text-gray-600 text-lg">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductListPage;
