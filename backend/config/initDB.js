// initDB.js - Creates the required MySQL tables if they don't exist
const db = require('./db');

async function initDB() {
  // Create documents table
  await db.query(`
    CREATE TABLE IF NOT EXISTS documents (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      originalName VARCHAR(255) NOT NULL,
      size INT NOT NULL,
      status VARCHAR(50) DEFAULT 'uploaded',
      path VARCHAR(500) NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create notifications table
  await db.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      message TEXT NOT NULL,
      isRead TINYINT(1) DEFAULT 0,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Database tables ready.');
}

module.exports = initDB;
