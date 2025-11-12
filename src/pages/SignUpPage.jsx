import React, { useState } from 'react';
import { useAuth, useToast } from '../context/AppProviders';
import { validateEmail } from '../lib/validation';
import { FormError, Input, Button } from '../components/Common';
import { Loader2 } from 'lucide-react';

export const SignUpPage = ({ setPage }) => {
  const { signup } = useAuth(); // <--- This pulls the logic from AppProviders
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Name is required.";
    if (!validateEmail(email)) newErrors.email = "Please enter a valid email.";
    if (password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    
    setIsLoading(true);
    // Calls the signup function from AuthContext
    const result = await signup(name, email, password);
    setIsLoading(false);
    
    if (result.success) {
      showToast('Account created successfully!');
      setPage('home'); // Redirects to home on success
    } else {
      setServerError(result.error || "Sign up failed. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 animate-fadeIn flex justify-center">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-extrabold text-white text-center mb-6">Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="name">Name</label>
            <Input 
              type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}
            />
            <FormError message={errors.name} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">Email</label>
            <Input 
              type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
            />
            <FormError message={errors.email} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="password">Password</label>
            <Input 
              type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
            />
            <FormError message={errors.password} />
          </div>
          
          <FormError message={serverError} />

          <Button
            type="submit"
            className="w-full bg-blue-500 text-white text-lg hover:bg-blue-400"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Sign Up'}
          </Button>
          <p className="text-sm text-gray-400 text-center">
            Already have an account?{" "}
            <button type="button" onClick={() => setPage('login')} className="text-blue-400 hover:underline font-medium">
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};