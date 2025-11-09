// frontend/src/screens/SettingsScreen.jsx
import React from 'react';
import { LogOut, User } from 'lucide-react';
import { handleLogoutApi } from '../api/auth';

const SettingsScreen = ({ darkMode, setDarkMode, setCurrentScreen, userName, setIsLoggedIn, setIsTracking, userEmail }) => {
  const bgClass = darkMode ? 'bg-slate-900' : 'bg-gray-50';
  const cardBg = darkMode ? 'bg-slate-800' : 'bg-white';
  const textClass = darkMode ? 'text-gray-50' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';

  const handleFullLogout = async () => {
    await handleLogoutApi();
    setIsLoggedIn(false);
    setIsTracking(false);
    setCurrentScreen('login');
  };

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300`}>
      <header className={`${cardBg} shadow-sm border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <button
            onClick={() => setCurrentScreen('dashboard')}
            className={`p-2 rounded-lg ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'} transition-all`}
          >
            <span className={textClass}>←</span>
          </button>
          <h1 className={`text-2xl font-bold ${textClass}`}>Settings</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Profile Section */}
        <div className={`${cardBg} rounded-2xl p-6 shadow-lg mb-6`}>
          <h3 className={`text-xl font-bold ${textClass} mb-6`}>Profile</h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <p className={`text-lg font-semibold ${textClass}`}>{userName}</p>
              <p className={textSecondary}>{userEmail}</p>
            </div>
          </div>
          <button className="text-blue-500 hover:text-blue-600 font-semibold transition-colors">Edit Profile</button>
        </div>

        {/* Appearance */}
        <div className={`${cardBg} rounded-2xl p-6 shadow-lg mb-6`}>
          <h3 className={`text-xl font-bold ${textClass} mb-6`}>Appearance</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className={`font-semibold ${textClass}`}>Dark Mode</p>
              <p className={`text-sm ${textSecondary}`}>Toggle dark theme for the dashboard</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${darkMode ? 'bg-blue-500' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${darkMode ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className={`${cardBg} rounded-2xl p-6 shadow-lg`}>
          <button
            onClick={handleFullLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.01]"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </main>
    </div>
  );
};

export default SettingsScreen;