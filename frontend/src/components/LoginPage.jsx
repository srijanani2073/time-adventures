import React from 'react';
import { Clock, LogIn } from 'lucide-react';

const LoginPage = ({ loginForm, setLoginForm, handleLogin, loading }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <Clock size={60} className="mx-auto mb-4 text-purple-600" />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Time Adventures</h1>
          <p className="text-gray-600">Learn to read clocks through exciting stories!</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={loginForm.username}
              onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition"
              placeholder="Enter your username"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition"
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogIn size={20} />
            {loading ? 'Loading...' : 'Start Learning'}
          </button>
        </form>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            New here? Just enter your details to create an account!
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;