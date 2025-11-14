// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, Gamepad2 } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gaming-dark border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gaming-gold to-gaming-orange rounded-xl flex items-center justify-center">
                <Gamepad2 size={28} className="text-black" />
              </div>
              <span className="font-display text-2xl font-black text-gaming-gold uppercase tracking-wider">
                E-Sports Cart
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              Your trusted source for high-performance gaming gear, accessories, and esports equipment. 
              Built for gamers, streamers, and champions.
            </p>
            
            {/* Social Media */}
            <div className="flex items-center gap-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-surface-dark hover:bg-gaming-gold border border-gray-700 hover:border-gaming-gold rounded-lg flex items-center justify-center transition-all group"
              >
                <Facebook size={20} className="text-gray-400 group-hover:text-black transition" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-surface-dark hover:bg-gaming-gold border border-gray-700 hover:border-gaming-gold rounded-lg flex items-center justify-center transition-all group"
              >
                <Instagram size={20} className="text-gray-400 group-hover:text-black transition" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-surface-dark hover:bg-gaming-gold border border-gray-700 hover:border-gaming-gold rounded-lg flex items-center justify-center transition-all group"
              >
                <Twitter size={20} className="text-gray-400 group-hover:text-black transition" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-bold text-white uppercase mb-4 tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { to: "/", label: "Home" },
                { to: "/products", label: "Products" },
                { to: "/about", label: "About Us" },
                { to: "/wishlist", label: "Wishlist" },
                { to: "/cart", label: "Cart" },
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-gray-400 hover:text-gaming-gold transition font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display text-lg font-bold text-white uppercase mb-4 tracking-wide">
              Contact
            </h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="mailto:support@esportscart.com" 
                  className="flex items-center gap-2 text-gray-400 hover:text-gaming-gold transition"
                >
                  <Mail size={18} />
                  <span className="font-medium">support@esportscart.com</span>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+919876543210" 
                  className="flex items-center gap-2 text-gray-400 hover:text-gaming-gold transition"
                >
                  <Phone size={18} />
                  <span className="font-medium">+91-9876543210</span>
                </a>
              </li>
              <li className="text-gray-400 text-sm pt-2">
                Available 24/7 for support
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {currentYear} E-Sports Cart — All Rights Reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="text-gray-400 hover:text-gaming-gold transition">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-gaming-gold transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
