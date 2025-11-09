// frontend/src/components/LoadingSpinner.jsx
import React from 'react';
import { Loader } from 'lucide-react';

const LoadingSpinner = ({ text = 'Loading...', isDark }) => {
  const textColor = isDark ? 'text-blue-400' : 'text-blue-600';
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <Loader className={`w-8 h-8 animate-spin ${textColor} mb-3`} />
      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{text}</p>
    </div>
  );
};

export default LoadingSpinner;