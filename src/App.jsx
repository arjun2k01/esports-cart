// frontend/src/App.jsx
import { Routes, Route } from "react-router-dom";

// Layout (adjust if your repo uses different components)
import Header from "./components/Header";
import Footer from "./components/Footer";

// Route guards (we created these)
import ProtectedRoute from "./components/routes/ProtectedRoute.jsx";
import AdminRoute from "./components/routes/AdminRoute.jsx";

// Public pages (adjust paths if your repo uses /screens instead of /pages)
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/SignupPage.jsx";

// Auth required pages
import ShippingPage from "./pages/ShippingPage";
import PaymentPage from "./pages/PaymentPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import OrderPage from "./pages/OrderPage";
import ProfilePage from "./pages/ProfilePage";

// Admin pages
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminProductEditPage from "./pages/admin/AdminProductEditPage";
import AdminUserEditPage from "./pages/admin/AdminUserEditPage";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Authenticated users */}
          <Route element={<ProtectedRoute />}>
            <Route path="/shipping" element={<ShippingPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/placeorder" element={<PlaceOrderPage />} />
            <Route path="/order/:id" element={<OrderPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Admin only */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/users/:id/edit" element={<AdminUserEditPage />} />

            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/products/:id/edit" element={<AdminProductEditPage />} />

            <Route path="/admin/orders" element={<AdminOrdersPage />} />
          </Route>

          {/* Fallback */}
          <Route
            path="*"
            element={
              <div className="max-w-5xl mx-auto px-4 py-10">
                <h1 className="text-2xl font-semibold">Page not found</h1>
                <p className="opacity-70 mt-2">
                  The page you are looking for doesn’t exist.
                </p>
              </div>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
