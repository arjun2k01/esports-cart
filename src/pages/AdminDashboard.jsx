import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { useAuth } from "../context/AuthContext.jsx";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If not admin, AdminRoute normally blocks already, but keep a hard guard too.
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/", { replace: true });
    }
  }, [authLoading, user, isAdmin, navigate]);

  const adminStyles = useMemo(
    () => `
    .admin-dashboard { padding: 20px; background: #0a0e27; color: #fff; min-height: 100vh; }
    .admin-container { max-width: 1400px; margin: 0 auto; }
    .admin-header { margin-bottom: 30px; border-bottom: 2px solid #ff6b35; padding-bottom: 15px; }
    .admin-header h1 { font-size: 32px; margin: 0; color: #ff6b35; }
    .admin-tabs { display: flex; gap: 10px; margin: 20px 0; flex-wrap: wrap; }
    .tab-btn { padding: 10px 20px; background: #1a1f3a; border: 1px solid #ff6b35; color: #fff; cursor: pointer; border-radius: 6px; font-weight: 700; }
    .tab-btn.active { background: #ff6b35; color: #000; }
    .admin-error { background: #d32f2f; padding: 12px 14px; border-radius: 6px; margin: 10px 0; }
    .admin-loading { text-align: center; padding: 20px; font-size: 16px; opacity: 0.85; }
    .admin-content { background: #1a1f3a; padding: 16px; border-radius: 8px; overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; min-width: 900px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #2a2f55; }
    th { background: #0a0e27; color: #ff6b35; font-weight: 800; position: sticky; top: 0; }
    .btn { border: none; border-radius: 6px; padding: 7px 10px; cursor: pointer; font-weight: 700; }
    .btn-view { background: #2196F3; color: #fff; }
    .btn-danger { background: #d32f2f; color: #fff; }
    .btn-warn { background: #ff6b35; color: #000; }
    .btn-ok { background: #4CAF50; color: #fff; }
    .pill { display:inline-block; padding: 4px 10px; border-radius:999px; background:#0a0e27; border:1px solid #2a2f55; }
    select { padding: 6px 10px; background: #0a0e27; color: #fff; border: 1px solid #ff6b35; border-radius: 6px; }
  `,
    []
  );

  // -------- DATA LOADERS --------
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/products");
      setProducts(res?.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/orders"); // ✅ Admin-only route in your backend
      setOrders(res?.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/users"); // ✅ Admin-only route
      setUsers(res?.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Tab switch triggers
  useEffect(() => {
    if (authLoading) return;
    if (!user || !isAdmin) return;

    if (activeTab === "products") fetchProducts();
    if (activeTab === "orders") fetchOrders();
    if (activeTab === "users") fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, authLoading, user, isAdmin]);

  // -------- ORDER ACTIONS (MATCH YOUR REAL ROUTES) --------
  const markShipped = async (orderId) => {
    try {
      await api.put(`/api/orders/${orderId}/ship`);
      toast.success("Marked as shipped");
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: "shipped" } : o))
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark shipped");
    }
  };

  const markDelivered = async (orderId) => {
    try {
      await api.put(`/api/orders/${orderId}/deliver`);
      toast.success("Marked as delivered");
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: "delivered" } : o))
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark delivered");
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await api.put(`/api/orders/${orderId}/cancel`);
      toast.success("Order cancelled");
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: "cancelled" } : o))
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel order");
    }
  };

  const deleteUser = async (userId) => {
    try {
      await api.delete(`/api/users/${userId}`);
      toast.success("User deleted");
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-sm opacity-70">Loading admin…</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <style>{adminStyles}</style>

      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome, {user?.name || "Admin"}</p>
        </div>

        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            Products
          </button>
          <button
            className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>
          <button
            className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
        </div>

        {error ? <div className="admin-error">{error}</div> : null}
        {loading ? <div className="admin-loading">Loading…</div> : null}

        <div className="admin-content">
          {activeTab === "products" && (
            <>
              <h2 style={{ marginTop: 0 }}>Products ({products.length})</h2>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td>{p.name}</td>
                      <td>₹{p.price}</td>
                      <td>{p.brand || "-"}</td>
                      <td>{p.category || "-"}</td>
                      <td>{p.countInStock ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {activeTab === "orders" && (
            <>
              <h2 style={{ marginTop: 0 }}>Orders ({orders.length})</h2>
              <table>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>User</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id}>
                      <td>{o._id.slice(-8)}</td>
                      <td>{o.user?.email || o.user?.name || "-"}</td>
                      <td>₹{o.totalPrice ?? o.total ?? "-"}</td>
                      <td>
                        <span className="pill">{o.status || "processing"}</span>
                      </td>
                      <td>{o.createdAt ? new Date(o.createdAt).toLocaleString() : "-"}</td>
                      <td style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button className="btn btn-warn" onClick={() => markShipped(o._id)}>
                          Ship
                        </button>
                        <button className="btn btn-ok" onClick={() => markDelivered(o._id)}>
                          Deliver
                        </button>
                        <button className="btn btn-danger" onClick={() => cancelOrder(o._id)}>
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {activeTab === "users" && (
            <>
              <h2 style={{ marginTop: 0 }}>Users ({users.length})</h2>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Admin</th>
                    <th>Created</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.isAdmin ? "Yes" : "No"}</td>
                      <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}</td>
                      <td>
                        <button className="btn btn-danger" onClick={() => deleteUser(u._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
