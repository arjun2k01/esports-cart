import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
// import your pages here
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CartPage from './pages/CartPage';
// ... other imports (AuthProvider, CartProvider, Toaster, etc.)

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster position="top-right" />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/cart" element={<CartPage />} />
              {/* Add other Route lines for your pages */}
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
export default App;
