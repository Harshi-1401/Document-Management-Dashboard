// Toast.jsx - Temporary pop-up notification shown at bottom-right
import React, { useEffect } from 'react';

function Toast({ message, onClose }) {
  // Auto-dismiss after 5 seconds
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-bounce-in">
      {/* Bell icon */}
      <span className="text-xl">🔔</span>
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-2 text-white opacity-70 hover:opacity-100 text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
}

export default Toast;
