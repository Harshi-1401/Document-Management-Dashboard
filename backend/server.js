// server.js - Main entry point for the Express backend
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const connectDB = require('./config/db');
const documentRoutes = require('./routes/documents');
const notificationRoutes = require('./routes/notifications');

const app = express();
const server = http.createServer(app); // wrap express with http for socket.io

// Setup Socket.IO with CORS allowed for React dev server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files statically from /uploads folder
app.use('/uploads', express.static('uploads'));

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Document Dashboard API is running' });
});

// Mount routes
app.use('/', documentRoutes);
app.use('/', notificationRoutes);

// Socket.IO connection event
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io accessible inside route handlers
app.set('io', io);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB first, then start the server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
