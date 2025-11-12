import React, { useState } from 'react';
import { useAuth } from '../context/AppProviders';
import { validateEmail } from '../lib/validation';
import { FormError } from '../components/Common';

export const LoginPage = ({ setPage }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("gamer@esportscart.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }
    if (login(email, password)) {
      setPage('cart'); // Go back to cart after login
    } else {
      setError("Invalid email or password (mock error).");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 animate-fadeIn flex justify-center">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-extrabold text-white text-center mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              required 
            />
          </div>
          <FormError message={error} />
          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-500 text-white font-bold text-lg rounded-md shadow-lg hover:bg-blue-400 transition-colors"
          >
            Login
          </button>
          <p className="text-sm text-gray-400 text-center">
            Don't have an account?{" "}
            <button onClick={() => setPage('signup')} className="text-blue-400 hover:underline font-medium">
              Sign Up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};