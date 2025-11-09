// frontend/src/components/ChartsSection.jsx
import React, { useMemo } from 'react';

// Utility to create the last 7 days chart data
const getWeeklyFocusData = (dailyFocusData) => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const last7DaysData = Array(7).fill(null).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i)); // Get date for last 7 days
    return {
      date: d,
      dayLabel: daysOfWeek[d.getDay()],
      focusHours: 0,
    };
  });

  if (dailyFocusData.length === 0) return last7DaysData;

  // Map recorded data onto the last 7 days
  dailyFocusData.forEach(metric => {
    const metricDate = new Date(metric.date).toDateString();
    const targetDay = last7DaysData.find(d => new Date(d.date).toDateString() === metricDate);
    if (targetDay) {
      targetDay.focusHours = (metric.focusTime / 3600); // Convert seconds to hours
    }
  });

  return last7DaysData;
};

const ChartsSection = ({ darkMode, userMetrics }) => {
  const cardBg = darkMode ? 'bg-slate-800' : 'bg-white';
  const textClass = darkMode ? 'text-gray-50' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';

  // Sample static distribution data (since we don't track categories in the backend yet)
  const focusDistribution = [
    { label: 'Work', percentage: 30, color: '#3B82F6' },
    { label: 'Learning', percentage: 25, color: '#8B5CF6' },
    { label: 'Creative', percentage: 45, color: '#22C55E' },
  ];
  const totalCircumference = 251.3; // Used for Donut chart SVG
  let currentOffset = 0;

  // Calculate dynamic weekly data
  const weeklyData = useMemo(() => getWeeklyFocusData(userMetrics.dailyFocusData), [userMetrics.dailyFocusData]);
  const maxHours = Math.max(...weeklyData.map(d => d.focusHours), 1); // Max focus time in the last 7 days (min 1 to avoid division by zero)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Focus Distribution (Donut Chart) */}
      <div className={`${cardBg} rounded-2xl p-6 shadow-lg`}>
        <h3 className={`text-xl font-bold ${textClass} mb-6`}>Focus Distribution (Mock)</h3>
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-48 h-48">
            <svg viewBox="0 0 100 100" className="transform -rotate-90">
              {/* Background Circle */}
              <circle cx="50" cy="50" r="40" fill="none" stroke={darkMode ? '#1e293b' : '#f3f4f6'} strokeWidth="20" />

              {/* Segments */}
              {focusDistribution.map((item, index) => {
                const dashArray = (item.percentage / 100) * totalCircumference;
                const offset = currentOffset;
                currentOffset += dashArray;

                return (
                  <circle
                    key={index}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={item.color}
                    strokeWidth="20"
                    strokeDasharray={`${dashArray} ${totalCircumference}`}
                    strokeDashoffset={-offset}
                    className="transition-all duration-1000 ease-out"
                  />
                );
              })}
            </svg>
          </div>
          {/* Legend */}
          <div className="mt-6 space-y-3 w-full max-w-xs">
            {focusDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className={textSecondary}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Trends (Dynamic Bar Chart) */}
      <div className={`${cardBg} rounded-2xl p-6 shadow-lg`}>
        <h3 className={`text-xl font-bold ${textClass} mb-6`}>Weekly Trends (Focus Hours)</h3>
        <div className="flex items-end justify-between h-48 gap-3">
          {weeklyData.map((dayData, i) => {
            // Normalize height based on max hours recorded (Max height is 100%)
            const heightPercent = maxHours > 0 ? (dayData.focusHours / maxHours) * 90 + 10 : 10; // +10% minimum height for visibility
            
            return (
              <div key={i} className="flex flex-col items-center flex-1 h-full relative group">
                {/* Tooltip */}
                <span className={`absolute bottom-full mb-2 p-1 px-2 rounded-lg bg-gray-800 text-white text-xs opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${maxHours > 0 ? '' : 'hidden'}`}>
                    {dayData.focusHours.toFixed(1)} hrs
                </span>
                
                {/* Bar */}
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-violet-600 rounded-t-lg transition-all duration-500 cursor-pointer shadow-lg hover:shadow-xl"
                  style={{ height: `${heightPercent}%` }}
                />
                {/* Day Label */}
                <span className={`text-xs mt-2 ${textSecondary} group-hover:font-semibold`}>{dayData.dayLabel}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;