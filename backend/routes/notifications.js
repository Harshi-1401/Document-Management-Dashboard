// notifications.js - Fetch and mark notifications using Mongoose
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// GET /notifications - Fetch all notifications, newest first
router.get('/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error('Fetch notifications error:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// PATCH /notifications/:id/read - Mark a notification as read
router.patch('/notifications/:id/read', async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error('Mark read error:', err);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

module.exports = router;
