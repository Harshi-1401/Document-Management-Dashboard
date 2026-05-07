// App.jsx - Root component, renders the main dashboard layout
import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-blue-600 text-white px-6 py-4 shadow">
        <h1 className="text-xl font-semibold">Document Management Dashboard</h1>
      </header>

      {/* Main content area */}
      <main className="max-w-5xl mx-auto p-6">
        <p className="text-gray-500">Phase 1 complete — setup working.</p>
      </main>
    </div>
  );
}

export default App;
