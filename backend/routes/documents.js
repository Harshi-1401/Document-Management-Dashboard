// documents.js - Routes for upload and fetching documents
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const upload = require('../config/multer');

// POST /upload - Upload one or multiple PDF files
router.post('/upload', upload.array('files', 20), async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const insertedIds = [];

    // Insert each uploaded file into the documents table
    for (const file of files) {
      // If more than 3 files, mark as 'processing' initially
      const status = files.length > 3 ? 'processing' : 'uploaded';
      const [result] = await db.query(
        `INSERT INTO documents (filename, originalName, size, status, path)
         VALUES (?, ?, ?, ?, ?)`,
        [file.filename, file.originalname, file.size, status, file.path]
      );
      insertedIds.push(result.insertId);
    }

    // If more than 3 files — respond immediately, then process in background
    if (files.length > 3) {
      // Send response right away so the frontend doesn't wait
      res.json({
        message: `${files.length} files received. Processing in background...`,
        count: files.length,
        background: true,
      });

      // Simulate background processing with a 4 second delay
      const io = req.app.get('io');
      setTimeout(async () => {
        try {
          // Update all inserted documents to 'uploaded' after processing
          for (const id of insertedIds) {
            await db.query(`UPDATE documents SET status = 'uploaded' WHERE id = ?`, [id]);
          }

          // Save a notification to the database
          const message = `${files.length} files have been processed successfully.`;
          const [notifResult] = await db.query(
            `INSERT INTO notifications (message, isRead) VALUES (?, 0)`,
            [message]
          );

          // Emit real-time event to all connected frontend clients
          io.emit('notification', {
            id: notifResult.insertId,
            message,
            isRead: 0,
            createdAt: new Date(),
          });
        } catch (err) {
          console.error('Background processing error:', err);
        }
      }, 4000); // 4 second simulated delay

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

// GET /documents - Fetch all uploaded documents
router.get('/documents', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM documents ORDER BY createdAt DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('Fetch documents error:', err);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

module.exports = router;
