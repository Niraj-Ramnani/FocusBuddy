// frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken, setToken, handleLogoutApi, fetchUserActivityApi, fetchOptimizationFeedbackApi } from './api/auth';

// Screen Imports
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import ExtensionPopup from './screens/ExtensionPopup';
import SettingsScreen from './screens/SettingsScreen';

const App = () => {
  // --- Authentication State ---
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());
  const [currentScreen, setCurrentScreen] = useState(isLoggedIn ? 'dashboard' : 'login');
  const [userName] = useState('Focus User'); // Placeholder, ideally fetched after login
  const [userEmail, setUserEmail] = useState('user@focusbuddy.com'); // Placeholder
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '...' }
  const [isLoading, setIsLoading] = useState(false);

  // --- UI/Theming State ---
  const [darkMode, setDarkMode] = useState(false);
  
  // --- Application Data/Metrics State ---
  const [activityData, setActivityData] = useState([]);
  const [userMetrics, setUserMetrics] = useState({ totalFocusTimeSeconds: 0, dailyFocusData: [] });
  const [optimizationFeedback, setOptimizationFeedback] = useState(null);
  
  // Simulated extension state (for demoing popup)
  const [isTracking, setIsTracking] = useState(true); 
  // We will derive focusTime and dailyProgress from userMetrics, but keep local state for the Extension timer demo
  const [focusTime, setFocusTime] = useState(0); 
  const [dailyProgress, setDailyProgress] = useState(0); 

  // --- Data Fetching and Logic ---

  const handleLoginSuccess = (token) => {
    setToken(token);
    setIsLoggedIn(true);
    setCurrentScreen('dashboard');
    fetchData(); // Fetch both activity and metrics
  };

  const handleLogout = async () => {
    await handleLogoutApi();
    setIsLoggedIn(false);
    setActivityData([]);
    setUserMetrics({ totalFocusTimeSeconds: 0, dailyFocusData: [] });
    setOptimizationFeedback(null);
    setMessage({ type: 'success', text: 'You have been logged out.' });
    setCurrentScreen('login');
  };

  const fetchOptimizationFeedback = async () => {
    try {
        const feedback = await fetchOptimizationFeedbackApi();
        setOptimizationFeedback(feedback);
    } catch (error) {
        console.error("Failed to fetch optimization feedback:", error);
        setOptimizationFeedback({
            feedback: "Failed to connect to ML model for personalized feedback.",
            area: "System Error",
            action: "Try recording more activity."
        });
    }
  };

  const fetchData = async () => {
    if (!isLoggedIn) return;

    setIsLoading(true);
    setMessage(null);
    try {
      const data = await fetchUserActivityApi();
      setActivityData(data.activities);
      setUserMetrics(data.metrics);
      
      // Calculate today's focus time from metrics for the UI timer simulation
      const today = new Date().toDateString();
      const todayMetric = data.metrics.dailyFocusData.find(d => new Date(d.date).toDateString() === today);
      const todayFocus = todayMetric ? todayMetric.focusTime : 0;
      setFocusTime(todayFocus);
      
      // Simple daily progress calculation (e.g., based on a 4-hour goal = 14400s)
      setDailyProgress(Math.min(100, Math.round((todayFocus / 14400) * 100)));

      // Fetch optimization feedback only after data is loaded
      await fetchOptimizationFeedback();
      
      setMessage({ type: 'success', text: 'Dashboard data loaded successfully.' });
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to fetch data. Try logging in again.';
      setMessage({ type: 'error', text: msg });
      if (error.response?.status === 401) handleLogout();
    } finally {
      setIsLoading(false);
    }
  };

  // Simulated Timer Effect (runs on the Extension screen mock)
  useEffect(() => {
    if (isTracking && currentScreen === 'extension') {
      const timer = setInterval(() => {
        setFocusTime((prev) => prev + 1);
        setDailyProgress((prev) => Math.min(100, prev + 0.05));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isTracking, currentScreen]);
  
  // Initial data fetch on mount/login
  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]); // eslint-disable-line react-hooks/exhaustive-deps


  // --- Router/Screen Rendering ---
  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen 
          handleLoginSuccess={handleLoginSuccess} 
        />;

      case 'dashboard':
        return <DashboardScreen 
          userName={userName}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          setCurrentScreen={setCurrentScreen}
          focusTime={focusTime} // Now dynamically loaded/updated
          dailyProgress={dailyProgress} // Now dynamically loaded/updated
          activityData={activityData}
          userMetrics={userMetrics} // Pass metrics object
          optimizationFeedback={optimizationFeedback} // Pass ML feedback
          isLoading={isLoading}
          message={message}
          setMessage={setMessage}
          fetchUserActivity={fetchData} // Use fetchData to refresh everything
          handleLogout={handleLogout}
        />;

      case 'extension':
        return <ExtensionPopup 
          setCurrentScreen={setCurrentScreen} 
          isTracking={isTracking}
          setIsTracking={setIsTracking}
          focusTime={focusTime}
          dailyProgress={dailyProgress}
          setFocusTime={setFocusTime}
          setDailyProgress={setDailyProgress}
        />;

      case 'settings':
        return <SettingsScreen
          userName={userName}
          userEmail={userEmail}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          setCurrentScreen={setCurrentScreen}
          setIsLoggedIn={setIsLoggedIn}
          setIsTracking={setIsTracking}
        />;

      default:
        return <LoginScreen handleLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <div className="font-sans">
      {renderScreen()}
    </div>
  );
};

export default App;