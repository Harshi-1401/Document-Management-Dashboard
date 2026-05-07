// App.jsx - Root component, renders the main dashboard layout
import React, { useState } from 'react';
import UploadSection from './components/UploadSection';
import DocumentsTable from './components/DocumentsTable';
import Toast from './components/Toast';
import useSocket from './hooks/useSocket';

function App() {
  // Incrementing this triggers DocumentsTable to re-fetch after an upload
  const [uploadTrigger, setUploadTrigger] = useState(0);
  const [toast, setToast] = useState(null); // { message: string } or null

  // Listen for real-time notifications from Socket.IO
  useSocket((notification) => {
    setToast({ message: notification.message });
    // Refresh documents table when notification arrives (processing complete)
    setUploadTrigger((prev) => prev + 1);
  });

  const handleUploadComplete = (isBackground) => {
    // If not background processing, refresh immediately
    if (!isBackground) {
      setUploadTrigger((prev) => prev + 1);
    }
    // If background, we'll refresh when the socket notification arrives
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-blue-600 text-white px-6 py-4 shadow">
        <h1 className="text-xl font-semibold">Document Management Dashboard</h1>
      </header>

      {/* Main content area */}
      <main className="max-w-5xl mx-auto p-6">
        <UploadSection onUploadComplete={handleUploadComplete} />
        <DocumentsTable uploadTrigger={uploadTrigger} />
      </main>

      {/* Toast notification */}
      {toast && <Toast message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
}

export default App;
