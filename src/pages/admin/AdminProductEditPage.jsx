// src/pages/admin/AdminProductEditPage.jsx
import { useParams } from "react-router-dom";

export default function AdminProductEditPage() {
  const { id } = useParams();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold">Admin • Edit Product</h1>
      <p className="mt-3 opacity-70">
        Editor UI not implemented yet. Product ID: <span className="font-mono">{id}</span>
      </p>
    </div>
  );
}
