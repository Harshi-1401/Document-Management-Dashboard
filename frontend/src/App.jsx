// App.jsx - Root component, renders the main dashboard layout
import React, { useState } from 'react';
import UploadSection from './components/UploadSection';
import DocumentsTable from './components/DocumentsTable';
import Toast from './components/Toast';
import NotificationBell from './components/NotificationBell';
import useSocket from './hooks/useSocket';

function App() {
  const [uploadTrigger, setUploadTrigger] = useState(0);
  const [toast, setToast] = useState(null);
  // Holds the latest real-time notification to pass to the bell
  const [latestNotification, setLatestNotification] = useState(null);

  // Listen for real-time notifications from Socket.IO
  useSocket((notification) => {
    setToast({ message: notification.message });
    setLatestNotification(notification); // push to bell dropdown
    setUploadTrigger((prev) => prev + 1); // refresh documents table
  });

  const handleUploadComplete = (isBackground) => {
    if (!isBackground) {
      setUploadTrigger((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-blue-600 text-white px-6 py-4 shadow flex items-center justify-between">
        <h1 className="text-xl font-semibold">Document Management Dashboard</h1>
        {/* Notification bell lives in the top-right of the navbar */}
        <NotificationBell newNotification={latestNotification} />
      </header>

      {/* Main content area */}
      <main className="max-w-5xl mx-auto p-6">
        <UploadSection onUploadComplete={handleUploadComplete} />
        <DocumentsTable uploadTrigger={uploadTrigger} />
      </main>

      {/* Toast pop-up for real-time events */}
      {toast && <Toast message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
}

export default App;
