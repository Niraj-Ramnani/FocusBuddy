// frontend/src/components/DashboardStats.jsx
import React from 'react';
import { Clock, TrendingUp, AlertCircle } from 'lucide-react';

const formatTodayTime = (sec) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return `${h}h ${m}m`;
};

const DashboardStats = ({ focusTime, dailyProgress, darkMode }) => {
  const cardBg = darkMode ? 'bg-slate-800' : 'bg-white';
  const textClass = darkMode ? 'text-gray-50' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Card 1: Focus Time */}
      <div className={`${cardBg} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
        <div className="flex items-center justify-between mb-4">
          <Clock className="w-10 h-10 text-blue-500" />
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <span className="text-2xl">⏱️</span>
          </div>
        </div>
        <h3 className={`text-lg font-semibold ${textSecondary} mb-2`}>Focus Time</h3>
        <p className={`text-3xl font-bold ${textClass}`}>{formatTodayTime(focusTime)}</p>
        <p className="text-sm text-blue-500 mt-2">Today ({dailyProgress}% Goal)</p>
      </div>

      {/* Card 2: Productivity Trend */}
      <div className={`${cardBg} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
        <div className="flex items-center justify-between mb-4">
          <TrendingUp className="w-10 h-10 text-green-500" />
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <span className="text-2xl">📈</span>
          </div>
        </div>
        <h3 className={`text-lg font-semibold ${textSecondary} mb-2`}>Productivity</h3>
        <p className={`text-3xl font-bold ${textClass}`}>+15%</p>
        <p className="text-sm text-green-500 mt-2">From last week</p>
      </div>

      {/* Card 3: Fatigue Alert */}
      <div className={`${cardBg} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-orange-500/20`}>
        <div className="flex items-center justify-between mb-4">
          <AlertCircle className="w-10 h-10 text-orange-500" />
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
        </div>
        <h3 className={`text-lg font-semibold ${textSecondary} mb-2`}>Fatigue Alert</h3>
        <p className={`text-xl font-bold ${textClass}`}>Losing focus</p>
        <p className="text-sm text-orange-500 mt-2">Take a break!</p>
      </div>
    </div>
  );
};

export default DashboardStats;