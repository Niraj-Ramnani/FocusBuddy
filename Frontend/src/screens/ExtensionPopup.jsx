// frontend/src/screens/ExtensionPopup.jsx
import React from 'react';
import { Activity, Globe, Clock, RotateCcw, BarChart3 } from 'lucide-react';

const formatTodayTime = (sec) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return `${h}h ${m}m`;
};

const formatTimeShort = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};


const ExtensionPopup = ({ setCurrentScreen, isTracking, setIsTracking, focusTime, dailyProgress, setFocusTime, setDailyProgress }) => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
      <div className="w-[380px] bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-violet-600 p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-white opacity-10 animate-pulse"></div>
          <div className="relative z-10 flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <Activity className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-white font-bold text-xl tracking-tight">FocusBuddy</h1>
                <p className="text-white/80 text-xs font-medium">Extension</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full">
              <span className="text-white text-sm font-medium">Tracking</span>
              <button
                onClick={() => setIsTracking(!isTracking)}
                className={`w-12 h-6 rounded-full transition-all duration-300 relative ${
                  isTracking ? 'bg-green-400' : 'bg-white/30'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 ${
                    isTracking ? 'left-6' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Timer Display */}
          <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center">
            <Clock className="w-10 h-10 text-white mx-auto mb-3 opacity-90" strokeWidth={2} />
            <div className="text-5xl font-bold text-white mb-2 tracking-tight">{formatTimeShort(focusTime)}</div>
            <p className="text-white/80 text-sm font-medium">Time on this site</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Current Site Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 flex items-center gap-4 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-blue-400" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <p className="text-slate-400 text-xs font-medium mb-1">Current Site</p>
              <p className="text-white font-semibold text-base">github.com</p>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-green-200/50 rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-green-700 text-xs font-semibold">Status</p>
              </div>
              <p className="text-green-600 font-bold text-lg">Focused</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-3 h-3 text-blue-600" strokeWidth={2.5} />
                <p className="text-blue-700 text-xs font-semibold">Today</p>
              </div>
              <p className="text-blue-600 font-bold text-lg">{formatTodayTime(focusTime)}</p>
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-purple-200/50 rounded-2xl p-5">
            <p className="text-slate-600 text-sm font-semibold mb-3">Daily Goal Progress</p>

            <div className="relative h-3 bg-white rounded-full overflow-hidden shadow-inner mb-3">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-violet-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${dailyProgress}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse" />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-purple-600 font-bold text-lg">{dailyProgress}%</span>
              <span className="text-slate-500 text-xs font-medium">1h 45m remaining</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => {
                setFocusTime(0);
                setDailyProgress(0);
              }}
              className="flex items-center justify-center gap-2 px-5 py-3.5 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold transition-all duration-300 hover:border-slate-300 hover:bg-slate-50 hover:scale-[1.02] active:scale-95"
            >
              <RotateCcw className="w-4 h-4" strokeWidth={2.5} />
              <span>Reset</span>
            </button>

            <button
              onClick={() => setCurrentScreen('dashboard')}
              className="flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-blue-500 to-violet-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-95"
            >
              <BarChart3 className="w-4 h-4" strokeWidth={2.5} />
              <span>Dashboard</span>
            </button>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-3 border-t border-slate-100">
            <span className="text-slate-400 text-xs font-medium">Last sync: Just now</span>
            <button
              onClick={() => setCurrentScreen('dashboard')}
              className="text-blue-600 text-xs font-semibold hover:text-blue-700 transition-colors"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtensionPopup;