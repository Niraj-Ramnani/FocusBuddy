// frontend/src/screens/DashboardScreen.jsx
import React from 'react';
import Header from '../components/Header';
import DashboardStats from '../components/DashboardStats';
import ChartsSection from '../components/ChartsSection';
import LoadingSpinner from '../components/LoadingSpinner';
import { Clock, Zap } from 'lucide-react'; // Added Zap for Optimization
import { recordSampleActivityApi } from '../api/auth';

const DashboardScreen = ({
  userName,
  darkMode,
  setDarkMode,
  setCurrentScreen,
  focusTime,
  dailyProgress,
  activityData,
  userMetrics, // New prop
  optimizationFeedback, // New prop
  isLoading,
  message,
  setMessage,
  fetchUserActivity,
}) => {
  const bgClass = darkMode ? 'bg-slate-900' : 'bg-gray-50';
  const textClass = darkMode ? 'text-gray-50' : 'text-gray-900';
  const cardBg = darkMode ? 'bg-slate-800' : 'bg-white';

  const handleRecordActivity = async () => {
    setMessage(null);
    try {
        await recordSampleActivityApi();
        setMessage({ type: 'success', text: 'Sample focus session recorded and metrics updated!' });
        fetchUserActivity(); // Use fetchData to refresh list AND optimization feedback
    } catch (error) {
        const msg = error.response?.data?.message || 'Failed to record activity.';
        setMessage({ type: 'error', text: msg });
    }
  };

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300`}>
      <Header 
        userName={userName}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        setCurrentScreen={setCurrentScreen}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className={`text-3xl font-bold ${textClass} mb-8`}>Focus Analytics Dashboard</h2>
        
        {/* State Messages (Success/Error) */}
        {message && (
          <div className={`p-3 rounded-xl mb-6 text-sm font-medium ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message.text}
          </div>
        )}

        {/* --- ML/Optimization Feedback Card (NEW) --- */}
        <div className={`p-6 rounded-2xl shadow-xl mb-8 border-2 ${darkMode ? 'bg-slate-700 border-blue-400/50' : 'bg-blue-50 border-blue-300'}`}>
            <div className="flex items-start gap-4">
                <Zap className={`w-8 h-8 flex-shrink-0 ${darkMode ? 'text-yellow-400' : 'text-blue-600'}`} />
                <div>
                    <h3 className={`text-xl font-bold ${textClass} mb-1 flex items-center`}>
                        Optimization Feedback <span className={`ml-2 text-xs font-semibold uppercase px-2 py-0.5 rounded-full ${optimizationFeedback?.area === "System Error" ? 'bg-red-500 text-white' : 'bg-yellow-500 text-slate-900'}`}>{optimizationFeedback?.area || 'Loading...'}</span>
                    </h3>
                    {optimizationFeedback ? (
                        <>
                            <p className={`${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                                {optimizationFeedback.feedback}
                            </p>
                            <p className="text-sm font-semibold text-blue-500">
                                Action Plan: {optimizationFeedback.action}
                            </p>
                        </>
                    ) : (
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {isLoading ? 'Analyzing data for personalized tips...' : 'No feedback yet. Record some focus activity!'}
                        </p>
                    )}
                </div>
            </div>
        </div>
        {/* --- END ML/Optimization Feedback Card --- */}


        <DashboardStats focusTime={focusTime} dailyProgress={dailyProgress} darkMode={darkMode} />

        {/* Charts will now use userMetrics.dailyFocusData for realistic charting */}
        <ChartsSection darkMode={darkMode} userMetrics={userMetrics} /> 

        {/* Activity Feed and Actions */}
        <div className="mt-8">
            <h3 className={`text-2xl font-bold ${textClass} mb-4 flex items-center`}>
                <Clock className="w-5 h-5 mr-2 text-blue-500" /> Recent Activity Feed
            </h3>
            
            <div className={`p-6 rounded-2xl shadow-lg ${cardBg}`}>
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={handleRecordActivity}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition duration-150 disabled:opacity-50 shadow-md hover:shadow-lg"
                    >
                        {isLoading ? 'Recording...' : 'Record Sample Focus Session'}
                    </button>
                    <button
                        onClick={fetchUserActivity}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 bg-gray-700 text-white font-semibold rounded-xl hover:bg-gray-800 transition duration-150 disabled:opacity-50 shadow-md hover:shadow-lg"
                    >
                        {isLoading ? 'Refreshing...' : 'Refresh Activity Data'}
                    </button>
                </div>

                <div className={`p-4 rounded-xl shadow-inner h-64 overflow-y-auto ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                    {isLoading ? (
                        <LoadingSpinner text="Fetching data..." isDark={darkMode} />
                    ) : activityData.length === 0 ? (
                        <p className={`text-center py-10 italic ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            No activity recorded yet. Click 'Record Sample Focus Session' or connect your extension!
                        </p>
                    ) : (
                        <ul className="space-y-3">
                            {activityData.slice(0, 10).map((activity, index) => (
                                <li key={activity._id || index} className={`p-4 rounded-lg shadow-sm text-sm border ${darkMode ? 'bg-slate-600 border-slate-500' : 'bg-white border-gray-200'}`}>
                                    <div className="flex justify-between items-center">
                                        <span className={`font-bold uppercase text-xs ${activity.activityType === 'focus_session' ? 'text-blue-400' : 'text-orange-400'}`}>
                                            {activity.activityType.replace('_', ' ')}
                                        </span>
                                        <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                            {new Date(activity.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <p className={`${darkMode ? 'text-gray-200' : 'text-gray-700'} mt-1`}>
                                        Time Spent: <span className="font-mono">{activity.timeSpent}s</span>
                                        {activity.attributes?.score && (
                                            <span className="ml-4">| Focus Score: <span className="font-mono text-indigo-400">{activity.attributes.score}</span></span>
                                        )}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>

        {/* Extension Preview Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setCurrentScreen('extension')}
            className="bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/40"
          >
            Preview Extension Popup UI
          </button>
        </div>
      </main>
    </div>
  );
};

export default DashboardScreen;