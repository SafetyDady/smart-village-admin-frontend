import React, { useState } from 'react';
import axios from 'axios';

const SimpleLoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('Login attempt:', formData);
      
      // Try to call the backend API
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username: formData.username,
        password: formData.password
      });
      
      console.log('Login successful:', response.data);
      alert(`Login successful! Welcome ${formData.username}`);
      
      // Store token if provided
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please ensure the backend is running.');
      } else if (error.response) {
        setError(error.response.data.message || 'Login failed');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Smart Village Management
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your admin account
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
          
          <div className="text-center text-sm text-gray-600">
            <p>Test Credentials:</p>
            <p>Username: <code className="bg-gray-100 px-1 rounded">superadmin</code></p>
            <p>Password: <code className="bg-gray-100 px-1 rounded">SmartVillage2025!</code></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SimpleLoginForm;

