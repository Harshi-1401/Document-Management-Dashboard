// Notification.js - Mongoose model for real-time notifications
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },   // notification text
  isRead: { type: Boolean, default: false },   // false = unread, true = read
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', notificationSchema);
