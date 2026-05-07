// FileProgress.jsx - Shows a single file's upload progress bar
import React from 'react';

function FileProgress({ name, progress, status }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
      <div className="flex justify-between items-center mb-1">
        {/* File name — truncate if too long */}
        <span className="text-sm text-gray-700 truncate max-w-xs">{name}</span>
        <span className={`text-xs font-medium ml-2 ${
          status === 'done' ? 'text-green-600' :
          status === 'error' ? 'text-red-500' : 'text-blue-500'
        }`}>
          {status === 'done' ? 'Done' : status === 'error' ? 'Failed' : `${progress}%`}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            status === 'error' ? 'bg-red-400' :
            status === 'done' ? 'bg-green-500' : 'bg-blue-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default FileProgress;
