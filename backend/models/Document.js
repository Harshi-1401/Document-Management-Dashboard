// Document.js - Mongoose model for uploaded PDF files
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  filename: { type: String, required: true },       // stored filename (with timestamp prefix)
  originalName: { type: String, required: true },   // original file name from user
  size: { type: Number, required: true },           // file size in bytes
  status: { type: String, default: 'uploaded' },    // 'uploaded' or 'processing'
  path: { type: String, required: true },           // local path on disk
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Document', documentSchema);
