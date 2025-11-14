// src/pages/SignUpPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, User, Loader2, Eye, EyeOff } from "lucide-react";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const result = await register({ name: formData.name, email: formData.email, password: formData.password });
      if (result.success) navigate("/");
      else setError(result.error || "Registration failed");
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gaming-darker flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gaming-gold to-gaming-orange rounded-2xl mb-4">
            <span className="text-4xl">🎮</span>
          </div>
          <h1 className="font-display text-4xl font-black text-white uppercase mb-2">
            Join The <span className="text-gaming-gold">Battle</span>
          </h1>
          <p className="text-gray-400">Create your gaming account</p>
        </div>

        <div className="bg-surface-dark border border-gray-800 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-out-red/10 border border-out-red rounded-lg p-4 text-out-red text-sm font-semibold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-gray-400 font-semibold mb-2 text-sm">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input type="text" name="name" value={formData.name} onChange={handleChange} required
                  className="w-full bg-gaming-darker border border-gray-700 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-gaming-gold transition"
                  placeholder="Enter your name" />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 font-semibold mb-2 text-sm">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required
                  className="w-full bg-gaming-darker border border-gray-700 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-gaming-gold transition"
                  placeholder="your@email.com" />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 font-semibold mb-2 text-sm">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required
                  className="w-full bg-gaming-darker border border-gray-700 text-white pl-12 pr-12 py-3 rounded-xl focus:outline-none focus:border-gaming-gold transition"
                  placeholder="At least 6 characters" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gaming-gold">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 font-semibold mb-2 text-sm">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input type={showPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required
                  className="w-full bg-gaming-darker border border-gray-700 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-gaming-gold transition"
                  placeholder="Confirm password" />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" required className="w-4 h-4 rounded border-gray-700 bg-gaming-darker text-gaming-gold" />
              <span className="text-gray-400 text-sm">I agree to the <Link to="/terms" className="text-gaming-gold hover:underline">Terms</Link> and <Link to="/privacy" className="text-gaming-gold hover:underline">Privacy Policy</Link></span>
            </label>

            <button type="submit" disabled={loading}
              className="w-full bg-gaming-orange hover:bg-gaming-gold text-black py-3 rounded-xl font-bold uppercase transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">
              {loading ? <><Loader2 className="animate-spin" size={20} />Creating Account...</> : "Sign Up"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-700"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-4 bg-surface-dark text-gray-400">OR</span></div>
          </div>

          <div className="space-y-3">
            <button className="w-full bg-gaming-darker border border-gray-700 hover:border-gaming-gold text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />Continue with Google
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-400">Already have an account? <Link to="/login" className="text-gaming-gold font-bold hover:underline">Login</Link></p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-gray-400 hover:text-gaming-gold text-sm font-semibold">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
