import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'https://esports-cart.onrender.com';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!storedUser.isAdmin) {
      navigate('/products');
    }
    setUser(storedUser);
  }, [navigate]);

  useEffect(() => {
    if (activeTab === 'products') fetchProducts();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`${API_URL}/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.filter(p => p._id !== productId));
      alert('Product deleted');
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${API_URL}/api/orders/${orderId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      alert('Order updated');
    } catch (err) {
      alert('Failed to update');
    }
  };

  const adminStyles = `
    .admin-dashboard { padding: 20px; background: #0a0e27; color: #fff; min-height: 100vh; }
    .admin-container { max-width: 1400px; margin: 0 auto; }
    .admin-header { margin-bottom: 30px; border-bottom: 2px solid #ff6b35; padding-bottom: 15px; }
    .admin-header h1 { font-size: 32px; margin: 0; color: #ff6b35; }
    .admin-tabs { display: flex; gap: 10px; margin: 20px 0; }
    .tab-btn { padding: 10px 20px; background: #1a1f3a; border: 2px solid #ff6b35; color: #fff; cursor: pointer; border-radius: 5px; font-weight: bold; }
    .tab-btn.active { background: #ff6b35; color: #000; }
    .admin-error { background: #d32f2f; padding: 15px; border-radius: 5px; margin: 10px 0; }
    .admin-loading { text-align: center; padding: 20px; font-size: 18px; }
    .admin-content { background: #1a1f3a; padding: 20px; border-radius: 5px; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .btn-primary { background: #ff6b35; color: #000; padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #333; }
    th { background: #0a0e27; color: #ff6b35; font-weight: bold; }
    .btn-edit { background: #4CAF50; color: white; padding: 5px 10px; border: none; border-radius: 3px; cursor: pointer; margin-right: 5px; }
    .btn-delete { background: #d32f2f; color: white; padding: 5px 10px; border: none; border-radius: 3px; cursor: pointer; }
    .btn-view { background: #2196F3; color: white; padding: 5px 10px; border: none; border-radius: 3px; cursor: pointer; }
    .status-select { padding: 5px 10px; background: #0a0e27; color: #fff; border: 1px solid #ff6b35; border-radius: 3px; }
  `;

  return (
    <div className="admin-dashboard">
      <style>{adminStyles}</style>
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome, {user?.name}</p>
        </div>

        <div className="admin-tabs">
          <button className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
            📦 Products ({products.length})
          </button>
          <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            📋 Orders ({orders.length})
          </button>
          <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            👥 Users ({users.length})
          </button>
        </div>

        {error && <div className="admin-error">{error}</div>}
        {loading && <div className="admin-loading">Loading...</div>}

        {activeTab === 'products' && (
          <div className="admin-content">
            <div className="section-header">
              <h2>Product Management</h2>
              <button className="btn-primary" onClick={() => navigate('/admin/add-product')}>+ Add Product</button>
            </div>
            <div className="products-table">
              {products.length === 0 ? (
                <p>No products found</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Category</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product._id}>
                        <td>{product._id.slice(0, 8)}...</td>
                        <td>{product.name}</td>
                        <td>₹{product.price}</td>
                        <td>{product.countInStock}</td>
                        <td>{product.category}</td>
                        <td>
                          <button className="btn-edit" onClick={() => navigate(`/admin/edit-product/${product._id}`)}>Edit</button>
                          <button className="btn-delete" onClick={() => deleteProduct(product._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="admin-content">
            <div className="section-header">
              <h2>Order Management</h2>
            </div>
            {orders.length === 0 ? (
              <p>No orders found</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>User</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id}>
                      <td>{order._id.slice(0, 8)}...</td>
                      <td>{order.user?.email || 'N/A'}</td>
                      <td>₹{order.totalPrice}</td>
                      <td>
                        <select value={order.status} onChange={(e) => updateOrderStatus(order._id, e.target.value)} className="status-select">
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="btn-view" onClick={() => navigate(`/orders/${order._id}`)}>View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-content">
            <div className="section-header">
              <h2>User Management</h2>
            </div>
            {users.length === 0 ? (
              <p>No users found</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Join Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td>{u._id.slice(0, 8)}...</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>{u.isAdmin ? 'Admin' : 'User'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
