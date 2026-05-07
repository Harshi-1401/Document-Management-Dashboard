// UploadSection.jsx - Drag & drop + file picker upload area
import React, { useState, useRef } from 'react';
import api from '../api/axios';
import FileProgress from './FileProgress';

function UploadSection({ onUploadComplete }) {
  const [fileProgresses, setFileProgresses] = useState([]); // tracks each file's progress
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  // Start uploading the selected files
  const handleUpload = (selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    const filesArray = Array.from(selectedFiles);

    // Only allow PDFs
    const pdfs = filesArray.filter((f) => f.type === 'application/pdf');
    if (pdfs.length === 0) {
      alert('Please select PDF files only.');
      return;
    }

    // Initialize progress state for each file
    const initial = pdfs.map((f) => ({
      name: f.name,
      progress: 0,
      status: 'uploading',
    }));
    setFileProgresses(initial);

    // Build FormData with all files under the key "files"
    const formData = new FormData();
    pdfs.forEach((f) => formData.append('files', f));

    api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      // onUploadProgress fires as bytes are sent
      onUploadProgress: (progressEvent) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        // Update all files with the same overall progress
        setFileProgresses((prev) =>
          prev.map((f) => ({ ...f, progress: percent }))
        );
      },
    })
      .then((res) => {
        // Mark all files as done
        setFileProgresses((prev) =>
          prev.map((f) => ({ ...f, progress: 100, status: 'done' }))
        );
        onUploadComplete(); // tell parent to refresh documents list
      })
      .catch((err) => {
        setFileProgresses((prev) =>
          prev.map((f) => ({ ...f, status: 'error' }))
        );
        console.error('Upload failed:', err);
      });
  };

  // Drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };
  const handleDragLeave = () => setDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleUpload(e.dataTransfer.files);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Upload Documents</h2>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors
          ${dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
      >
        <p className="text-gray-500 text-sm">
          Drag & drop PDF files here, or{' '}
          <span className="text-blue-600 font-medium">click to browse</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">PDF files only</p>
      </div>

      {/* Hidden file input — supports multiple */}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        multiple
        className="hidden"
        onChange={(e) => handleUpload(e.target.files)}
      />

      {/* Per-file progress bars */}
      {fileProgresses.length > 0 && (
        <div className="mt-4 space-y-2">
          {fileProgresses.map((f, i) => (
            <FileProgress key={i} name={f.name} progress={f.progress} status={f.status} />
          ))}
        </div>
      )}
    </div>
  );
}

export default UploadSection;
