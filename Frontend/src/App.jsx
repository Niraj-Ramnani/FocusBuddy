// frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LogIn, LogOut, UserPlus, Clock } from 'lucide-react'; // Using lucide-react for icons

// Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// --- Auth Utilities (Simulated) ---
const setToken = (token) => localStorage.setItem('userToken', token);
const getToken = () => localStorage.getItem('userToken');
const removeToken = () => localStorage.removeItem('userToken');

// --- Global Axios Configuration ---
// Intercept requests to attach the Authorization header if a token exists
axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [activityData, setActivityData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- API Calls ---

  const handleAuth = async (endpoint) => {
    setIsLoading(true);
    setMessage('');
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/${endpoint}`, { email, password });
      setMessage(`Success: ${response.data.message}`);
      setToken(response.data.token);
      setIsLoggedIn(true);
      setEmail('');
      setPassword('');
      fetchUserActivity();
    } catch (error) {
      const msg = error.response?.data?.message || 'Authentication failed.';
      setMessage(`Error: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => handleAuth('login');
  const handleSignup = () => handleAuth('signup');

  const handleLogout = async () => {
    // Call the backend logout route (optional, primarily for session invalidation)
    try {
        await axios.post(`${API_BASE_URL}/auth/logout`);
    } catch (e) {
        console.warn("Logout endpoint failed, proceeding with client-side cleanup.");
    }
    removeToken();
    setIsLoggedIn(false);
    setActivityData([]);
    setMessage('You have been logged out.');
  };

  const fetchUserActivity = async () => {
    if (!isLoggedIn) return;

    setIsLoading(true);
    setMessage('');
    try {
      const response = await axios.get(`${API_BASE_URL}/activity/mine`);
      setActivityData(response.data);
      setMessage('User activity loaded successfully.');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to fetch activity.';
      setMessage(`Error fetching activity: ${msg}. Try logging in.`);
      // If fetching fails due to auth error, might mean token expired
      if (error.response?.status === 401) handleLogout();
    } finally {
      setIsLoading(false);
    }
  };

  const recordSampleActivity = async () => {
    if (!isLoggedIn) {
      setMessage('You must be logged in to record activity.');
      return;
    }
    setIsLoading(true);
    setMessage('');
    try {
      const sampleActivity = {
        timeSpent: Math.floor(Math.random() * 300) + 60, // 1 to 6 min in seconds
        activityType: 'focus_session',
        attributes: {
          url: 'https://work.projectsite.com',
          score: (Math.random() * 10).toFixed(2),
        },
      };

      await axios.post(`${API_BASE_URL}/activity/record`, sampleActivity);
      setMessage('Sample activity recorded successfully!');
      fetchUserActivity(); // Refresh the list
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to record activity.';
      setMessage(`Error recording activity: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount if user is already logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchUserActivity();
    }
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
      <script src="https://cdn.tailwindcss.com"></script>
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-6 md:p-10">
        <h1 className="text-3xl font-extrabold text-blue-600 mb-2">
          Adaptive Focus Tracker (Frontend Mock)
        </h1>
        <p className="text-gray-500 mb-8">
          MERN Stack Connectivity Test. Status: <span className={`font-semibold ${isLoggedIn ? 'text-green-500' : 'text-red-500'}`}>{isLoggedIn ? 'LOGGED IN' : 'LOGGED OUT'}</span>
        </p>

        {message && (
          <div className={`p-3 rounded-lg mb-6 text-sm font-medium ${message.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        {/* --- Authentication Form/Controls --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {!isLoggedIn ? (
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner col-span-1 md:col-span-2">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <LogIn className="w-5 h-5 mr-2 text-blue-500" /> User Authentication
              </h2>
              <input
                type="email"
                placeholder="Email (e.g., test@user.com)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 mb-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="flex gap-4">
                <button
                  onClick={handleLogin}
                  disabled={isLoading || !email || !password}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150 disabled:opacity-50"
                >
                  {isLoading ? 'Loading...' : 'Login'}
                </button>
                <button
                  onClick={handleSignup}
                  disabled={isLoading || !email || !password}
                  className="flex-1 px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition duration-150 disabled:opacity-50 flex items-center justify-center"
                >
                  <UserPlus className="w-4 h-4 mr-1" /> {isLoading ? 'Loading...' : 'Sign Up'}
                </button>
              </div>
            </div>
          ) : (
            <div className="col-span-1 md:col-span-2">
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-150 disabled:opacity-50"
              >
                <LogOut className="w-5 h-5 mr-2" /> Logout
              </button>
            </div>
          )}
        </div>

        {/* --- Activity Tracking & Data Display --- */}
        {isLoggedIn && (
          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-green-500" /> User Activity Management
            </h2>

            <div className="mb-6 flex gap-4">
              <button
                onClick={recordSampleActivity}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-150 disabled:opacity-50"
              >
                {isLoading ? 'Recording...' : 'Record Sample Focus Session'}
              </button>
              <button
                onClick={fetchUserActivity}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition duration-150 disabled:opacity-50"
              >
                {isLoading ? 'Refreshing...' : 'Refresh Activity Data'}
              </button>
            </div>

            {/* Activity List */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-inner h-64 overflow-y-auto">
              <h3 className="font-semibold text-lg mb-2 text-gray-700">Recent Activity ({activityData.length})</h3>
              {activityData.length === 0 ? (
                <p className="text-gray-500 italic">No activity recorded yet. Record a sample session!</p>
              ) : (
                <ul className="space-y-2">
                  {activityData.slice(0, 10).map((activity, index) => (
                    <li key={activity._id || index} className="p-3 bg-white border border-gray-200 rounded-md text-sm shadow-sm">
                      <div className="flex justify-between items-start">
                        <span className={`font-bold uppercase ${activity.activityType === 'focus_session' ? 'text-blue-600' : 'text-orange-500'}`}>
                          {activity.activityType.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-gray-600">
                        Spent: <span className="font-mono">{activity.timeSpent}s</span>
                        {activity.attributes?.score && (
                          <span className="ml-4">| Focus Score: <span className="font-mono text-indigo-600">{activity.attributes.score}</span></span>
                        )}
                      </p>
                    </li>
                  ))}
                  {activityData.length > 10 && (
                    <li className="text-center text-gray-500 text-sm italic">...showing top 10 activities.</li>
                  )}
                </ul>
              )}
            </div>
          </div>
        )}

        <footer className="mt-10 pt-6 border-t text-center text-xs text-gray-400">
          This frontend serves as a template for team integration. Replace with final components.
        </footer>
      </div>
    </div>
  );
};

export default App;