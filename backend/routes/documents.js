// documents.js - Upload and fetch document routes using Mongoose
const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const Document = require('../models/Document');
const Notification = require('../models/Notification');

// POST /upload - Upload one or multiple PDF files
router.post('/upload', upload.array('files', 20), async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const isBackground = files.length > 3;
    const status = isBackground ? 'processing' : 'uploaded';

    // Save each file to MongoDB using Mongoose
    const savedDocs = await Promise.all(
      files.map((file) =>
        Document.create({
          filename: file.filename,
          originalName: file.originalname,
          size: file.size,
          status,
          path: file.path,
        })
      )
    );

    // If more than 3 files — respond immediately, process in background
    if (isBackground) {
      res.json({
        message: `${files.length} files received. Processing in background...`,
        count: files.length,
        background: true,
      });

      // Simulate background processing with a 4 second delay
      const io = req.app.get('io');
      setTimeout(async () => {
        try {
          // Update each document status to 'uploaded' after processing
          await Promise.all(
            savedDocs.map((doc) =>
              Document.findByIdAndUpdate(doc._id, { status: 'uploaded' })
            )
          );

          // Create a notification in MongoDB
          const message = `${files.length} files have been processed successfully.`;
          const notification = await Notification.create({ message });

          // Emit real-time event to all connected frontend clients
          io.emit('notification', {
            id: notification._id,
            message: notification.message,
            isRead: notification.isRead,
            createdAt: notification.createdAt,
          });
        } catch (err) {
          console.error('Background processing error:', err);
        }
      }, 4000);
    } else {
      res.json({
        message: `${files.length} file(s) uploaded successfully`,
        count: files.length,
        background: false,
      });
    }
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// GET /documents - Fetch all documents, newest first
router.get('/documents', async (req, res) => {
  try {
    const documents = await Document.find().sort({ createdAt: -1 });
    res.json(documents);
  } catch (err) {
    console.error('Fetch documents error:', err);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

module.exports = router;
