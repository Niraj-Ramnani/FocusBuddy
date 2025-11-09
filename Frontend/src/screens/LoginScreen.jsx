// frontend/src/screens/LoginScreen.jsx
import React, { useState } from 'react';
import { Clock, UserPlus, LogIn } from 'lucide-react';
import { handleAuth } from '../api/auth';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginScreen = ({ handleLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  
  const cardBg = 'bg-white';
  const textClass = 'text-gray-900';
  const textSecondary = 'text-gray-600';

  const handleSubmit = async (endpoint) => {
    setIsLoading(true);
    setMessage(null);
    try {
      const data = await handleAuth(endpoint, email, password);
      setMessage({ type: 'success', text: data.message || 'Login successful!' });
      handleLoginSuccess(data.token); // Pass token up to App.jsx
    } catch (error) {
      const msg = error.response?.data?.message || 'Authentication failed. Check server status and credentials.';
      setMessage({ type: 'error', text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-violet-600 p-4">
      <div
        className={`${cardBg} rounded-3xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 hover:shadow-blue-500/20`}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse-slow">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-3xl font-bold ${textClass} mb-2`}>FocusBuddy</h1>
          <p className={textSecondary}>Track your focus, boost productivity</p>
        </div>

        {message && (
          <div className={`p-3 rounded-xl mb-4 text-sm font-medium ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message.text}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all shadow-sm`}
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all shadow-sm`}
            disabled={isLoading}
          />
        </div>

        <button
          onClick={() => handleSubmit('login')}
          disabled={isLoading || !email || !password}
          className="w-full bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white py-3 rounded-xl font-semibold mb-3 transition-all duration-300 transform hover:scale-[1.01] shadow-lg shadow-blue-500/30 disabled:opacity-50 flex items-center justify-center"
        >
          {isLoading ? <LoadingSpinner text="Logging in..." isDark={false} /> : <><LogIn className="w-5 h-5 mr-2" /> Login</>}
        </button>

        <button
          onClick={() => handleSubmit('signup')}
          disabled={isLoading || !email || !password}
          className={`w-full bg-transparent border border-gray-300 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-md ${textClass} disabled:opacity-50`}
        >
          <UserPlus className="w-5 h-5" /> Sign Up
        </button>

        <p className={`text-center mt-6 ${textSecondary} text-sm`}>
          By logging in, you agree to our <span className="text-blue-500 cursor-pointer hover:underline">Terms</span>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;