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

    // Insert each uploaded file into the documents table
    for (const file of files) {
      await db.query(
        `INSERT INTO documents (filename, originalName, size, status, path)
         VALUES (?, ?, ?, 'uploaded', ?)`,
        [file.filename, file.originalname, file.size, file.path]
      );
    }

    res.json({
      message: `${files.length} file(s) uploaded successfully`,
      count: files.length,
    });
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
