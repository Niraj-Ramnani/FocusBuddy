// backend/routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// --- Utility function for creating JWT ---
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id),
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for user
    const user = await User.findOne({ email });

    // Check password
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
        message: 'Login successful',
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   POST /api/auth/logout
// @desc    Handle logout (client-side token removal)
// @access  Public (Logout is handled on the client by removing the token)
router.post('/logout', (req, res) => {
    // In a stateless JWT system, logout is purely a client-side action (deleting the token).
    // This route is a confirmation/placeholder for good practice.
    res.status(200).json({ message: 'Logout simulation successful (token should be removed client-side)' });
});


export default router;