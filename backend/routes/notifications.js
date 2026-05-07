// notifications.js - Routes for fetching and marking notifications
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /notifications - Fetch all notifications
router.get('/notifications', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM notifications ORDER BY createdAt DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('Fetch notifications error:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// PATCH /notifications/:id/read - Mark a notification as read
router.patch('/notifications/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('UPDATE notifications SET isRead = 1 WHERE id = ?', [id]);
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error('Mark read error:', err);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

module.exports = router;
