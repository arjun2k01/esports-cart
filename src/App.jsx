// src/App.jsx
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import ProtectedRoute from "./components/routes/ProtectedRoute.jsx";
import AdminRoute from "./components/routes/AdminRoute.jsx";

// Pages (these exist in your repo)
import HomePage from "./pages/HomePage.jsx";
import ProductListPage from "./pages/ProductListPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import OrderConfirmationPage from "./pages/OrderConfirmationPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import OrderDetailPage from "./pages/OrderDetailPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import WishListPage from "./pages/WishListPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// Admin pages (we add these below)
import AdminUsersPage from "./pages/admin/AdminUsersPage.jsx";
import AdminProductsPage from "./pages/admin/AdminProductsPage.jsx";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage.jsx";
import AdminProductEditPage from "./pages/admin/AdminProductEditPage.jsx";
import AdminUserEditPage from "./pages/admin/AdminUserEditPage.jsx";
import AdminProductCreatePage from "./pages/admin/AdminProductCreatePage.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishListPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />

          {/* Auth required */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/order/:id" element={<OrderDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Admin only */}
          <Route element={<AdminRoute />}>
          <Route path="/admin/products/new" element={<AdminProductCreatePage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/users/:id/edit" element={<AdminUserEditPage />} />

            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/products/:id/edit" element={<AdminProductEditPage />} />

            <Route path="/admin/orders" element={<AdminOrdersPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
