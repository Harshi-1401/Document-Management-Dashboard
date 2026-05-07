// App.jsx - Root component, renders the main dashboard layout
import React, { useState } from 'react';
import UploadSection from './components/UploadSection';

function App() {
  // This counter triggers a re-fetch in the documents table when a new upload completes
  const [uploadTrigger, setUploadTrigger] = useState(0);

  const handleUploadComplete = () => {
    setUploadTrigger((prev) => prev + 1);
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
      </main>
    </div>
  );
}

export default App;
