// backend/routes/activity.js
import express from 'express';
import Activity from '../models/Activity.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/activity/record
// @desc    Record a new user activity event
// @access  Private (Requires JWT token)
router.post('/record', protect, async (req, res) => {
  const { timeSpent, activityType, attributes } = req.body;
  const userId = req.userId; // Retrieved from the JWT token via 'protect' middleware

  if (!timeSpent || !activityType) {
    return res.status(400).json({ message: 'Please provide timeSpent and activityType' });
  }

  try {
    const activity = new Activity({
      userId,
      timeSpent,
      activityType,
      attributes,
    });

    const createdActivity = await activity.save();
    res.status(201).json(createdActivity);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error: Failed to record activity' });
  }
});


// @route   GET /api/activity/mine
// @desc    Get all activity records for the logged-in user
// @access  Private (Requires JWT token)
router.get('/mine', protect, async (req, res) => {
  const userId = req.userId; // Retrieved from the JWT token

  try {
    // Find activities, sort by timestamp descending
    const activities = await Activity.find({ userId }).sort({ timestamp: -1 });

    res.json(activities);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error: Failed to fetch activity' });
  }
});

export default router;