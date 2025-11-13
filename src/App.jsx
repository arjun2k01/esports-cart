import React, { useState } from 'react';
import AppProviders from './context/AppProviders'; // Keeps Cart, Product, etc.
import { AuthProvider } from './context/AuthContext'; // New dedicated Auth provider
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Import Pages
import { HomePage } from './pages/HomePage';
import { ProductListPage } from './pages/ProductListPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrdersPage } from './pages/OrdersPage';
import { WishlistPage } from './pages/WishListPage';

function MainContent() {
  const [page, setPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <HomePage setPage={setPage} setSelectedProductId={setSelectedProductId} />;
      case 'products':
        return <ProductListPage setPage={setPage} setSelectedProductId={setSelectedProductId} searchTerm={searchTerm} />;
      case 'productDetail':
        return <ProductDetailPage productId={selectedProductId} setPage={setPage} />;
      case 'cart':
        return <CartPage setPage={setPage} />;
      case 'about':
        return <AboutPage />;
      case 'login':
        return <LoginPage setPage={setPage} />;
      case 'signup':
        return <SignUpPage setPage={setPage} />;
      case 'checkout':
        return <CheckoutPage setPage={setPage} />;
      case 'orderConfirmation':
        return <OrderConfirmationPage setPage={setPage} />;
      case 'orders':
        return <OrdersPage />;
      case 'wishlist':
        return <WishlistPage setPage={setPage} setSelectedProductId={setSelectedProductId} />;
      default:
        return <HomePage setPage={setPage} setSelectedProductId={setSelectedProductId} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-inter antialiased">
      <Header setPage={setPage} setSearchTerm={setSearchTerm} />
      <main>
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    // AuthProvider is at the top level
    <AuthProvider>
      <AppProviders>
        <MainContent />
      </AppProviders>
    </AuthProvider>
  );
}