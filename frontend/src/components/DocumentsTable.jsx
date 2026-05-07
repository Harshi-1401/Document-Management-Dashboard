// DocumentsTable.jsx - Fetches and displays all uploaded documents
import React, { useEffect, useState } from 'react';
import api from '../api/axios';

function DocumentsTable({ uploadTrigger }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch documents whenever uploadTrigger changes (new upload completed)
  useEffect(() => {
    fetchDocuments();
  }, [uploadTrigger]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/documents');
      setDocuments(res.data);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    } finally {
      setLoading(false);
    }
  };

  // Convert bytes to a readable format (KB or MB)
  const formatSize = (bytes) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Format the date to a readable string
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Uploaded Documents</h2>

      {loading ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : documents.length === 0 ? (
        <p className="text-gray-400 text-sm">No documents uploaded yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-blue-50 text-blue-700 uppercase text-xs">
                <th className="px-4 py-3 rounded-tl-lg">#</th>
                <th className="px-4 py-3">File Name</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">Upload Date</th>
                <th className="px-4 py-3 rounded-tr-lg">Status</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, index) => (
                <tr
                  key={doc.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-400">{index + 1}</td>
                  <td className="px-4 py-3 text-gray-800 font-medium truncate max-w-xs">
                    {doc.originalName}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatSize(doc.size)}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(doc.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      doc.status === 'uploaded'
                        ? 'bg-green-100 text-green-700'
                        : doc.status === 'processing'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DocumentsTable;
