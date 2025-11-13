// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">

        {/* Column 1 — Brand About */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-3">E-Sports Cart</h3>
          <p className="text-gray-400 leading-relaxed">
            Your trusted source for high-performance gaming gear, accessories,
            and esports equipment. Built for gamers, streamers, and champions.
          </p>
        </div>

        {/* Column 2 — Quick Links */}
        <div>
          <h4 className="text-xl font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-blue-400 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-blue-400 transition">
                Products
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-blue-400 transition">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="hover:text-blue-400 transition">
                Wishlist
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-blue-400 transition">
                Cart
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3 — Contact & Social */}
        <div>
          <h4 className="text-xl font-semibold text-white mb-4">Follow Us</h4>
          <div className="flex items-center gap-4 mb-6">
            <a href="#" className="hover:text-blue-400 transition">
              <Facebook size={22} />
            </a>
            <a href="#" className="hover:text-pink-400 transition">
              <Instagram size={22} />
            </a>
            <a href="#" className="hover:text-blue-300 transition">
              <Twitter size={22} />
            </a>
          </div>

          <h4 className="text-xl font-semibold text-white mb-2">Contact</h4>
          <p className="text-gray-400">support@esportscart.com</p>
          <p className="text-gray-400 mt-1">+91-9876543210</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-800 py-3 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} E-Sports Cart — All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
