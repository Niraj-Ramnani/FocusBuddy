// frontend/src/components/Header.jsx
import React from 'react';
import { Clock, Settings } from 'lucide-react';

const Header = ({ userName, darkMode, setDarkMode, setCurrentScreen }) => {
  const cardBg = darkMode ? 'bg-slate-800' : 'bg-white';
  const textClass = darkMode ? 'text-gray-50' : 'text-gray-900';
  
  return (
    <header className={`${cardBg} shadow-sm border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <h1 className={`text-2xl font-bold ${textClass}`}>FocusBuddy</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className={`${textClass} text-lg font-semibold hidden sm:inline`}>Welcome, {userName}!</span>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-200'} transition-all hover:scale-110`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '🌙' : '☀️'}
          </button>
          <button
            onClick={() => setCurrentScreen('settings')}
            className={`p-2 rounded-lg ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'} transition-all`}
            aria-label="Settings"
          >
            <Settings className={`w-5 h-5 ${textClass}`} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;