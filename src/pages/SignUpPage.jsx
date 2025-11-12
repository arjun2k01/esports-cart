import React, { useState } from 'react';
import { useAuth } from '../context/AppProviders';
import { validateEmail } from '../lib/validation';
import { FormError } from '../components/Common';

export const SignUpPage = ({ setPage }) => {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Name is required.";
    if (!validateEmail(email)) newErrors.email = "Please enter a valid email.";
    if (password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    if (signup(name, email, password)) {
      setPage('home'); // Go to home after signup
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 animate-fadeIn flex justify-center">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-extrabold text-white text-center mb-6">Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="name">Name</label>
            <input 
              type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FormError message={errors.name} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">Email</label>
            <input 
              type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FormError message={errors.email} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="password">Password</label>
            <input 
              type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FormError message={errors.password} />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-500 text-white font-bold text-lg rounded-md shadow-lg hover:bg-blue-400 transition-colors"
          >
            Sign Up
          </button>
          <p className="text-sm text-gray-400 text-center">
            Already have an account?{" "}
            <button onClick={() => setPage('login')} className="text-blue-400 hover:underline font-medium">
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};