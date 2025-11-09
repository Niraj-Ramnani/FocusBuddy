// backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import activityRoutes from './routes/activity.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from your React frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow cookies/authorization headers
}));
app.use(express.json()); // Body parser for JSON requests

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI ;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
// Authentication (Signup, Login, Logout)
app.use('/api/auth', authRoutes);

// User Activity Management (Protected)
app.use('/api/activity', activityRoutes);

// Simple root route
app.get('/', (req, res) => {
  res.send('Adaptive Focus Tracker Backend API is running.');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT}`);
});