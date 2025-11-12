import React, { useState } from 'react';
import { useAuth, useToast } from '../context/AppProviders';
import { validateEmail } from '../lib/validation';
import { FormError, Input, Button } from '../components/Common';
import { Loader2 } from 'lucide-react';

export const LoginPage = ({ setPage }) => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState("gamer@esportscart.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateEmail(email)) return setError("Please enter a valid email address.");
    if (!password) return setError("Please enter your password.");
    
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);
    
    if (result.success) {
      showToast('Login successful!');
      setPage('cart');
    } else {
      setError(result.error || "Login failed. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 animate-fadeIn flex justify-center">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-extrabold text-white text-center mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">Email</label>
            <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="password">Password</label>
            <Input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <FormError message={error} />
          <Button type="submit" className="w-full bg-blue-500 text-white text-lg hover:bg-blue-400" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Login'}
          </Button>
          <p className="text-sm text-gray-400 text-center">
            Don't have an account? <button type="button" onClick={() => setPage('signup')} className="text-blue-400 hover:underline font-medium">Sign Up</button>
          </p>
        </form>
      </div>
    </div>
  );
};