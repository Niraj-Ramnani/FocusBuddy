// backend/routes/activity.js
import express from 'express';
import Activity from '../models/Activity.js';
import UserMetrics from '../models/UserMetrics.js'; // Import the new model
import protect from '../middleware/auth.js';

const router = express.Router();

/**
 * Utility function to update aggregated user metrics.
 * NOTE: In a production app, this would be an async job, not run directly on the API route.
 */
const updateMetrics = async (userId, timeSpent, date) => {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);

  const metrics = await UserMetrics.findOneAndUpdate(
    { userId },
    { $set: { lastUpdated: new Date() } },
    { upsert: true, new: true } // Upsert ensures the document is created if it doesn't exist
  );

  // Simple aggregation logic (Add new focus time to today's data)
  const todayIndex = metrics.dailyFocusData.findIndex(d => 
    new Date(d.date).toDateString() === dayStart.toDateString()
  );

  if (todayIndex > -1) {
    metrics.dailyFocusData[todayIndex].focusTime += timeSpent;
  } else {
    metrics.dailyFocusData.push({
      date: dayStart,
      focusTime: timeSpent,
      distractionCount: 0, // Simplified
      avgFocusScore: 8.5, // Simplified
    });
  }

  // Keep the array length manageable (e.g., last 30 days)
  metrics.dailyFocusData.sort((a, b) => a.date - b.date);
  metrics.dailyFocusData = metrics.dailyFocusData.slice(-30);
  
  // Recalculate total focus time
  metrics.totalFocusTimeSeconds = metrics.dailyFocusData.reduce((sum, d) => sum + d.focusTime, 0);

  await metrics.save();
};


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
    
    // Update user metrics asynchronously
    updateMetrics(userId, timeSpent, createdActivity.timestamp);

    res.status(201).json(createdActivity);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error: Failed to record activity' });
  }
});


// @route   GET /api/activity/mine
// @desc    Get all activity records for the logged-in user and current metrics
// @access  Private (Requires JWT token)
router.get('/mine', protect, async (req, res) => {
  const userId = req.userId; // Retrieved from the JWT token

  try {
    const activities = await Activity.find({ userId }).sort({ timestamp: -1 }).limit(20);
    const metrics = await UserMetrics.findOne({ userId });

    res.json({
        activities,
        metrics: metrics || { dailyFocusData: [], totalFocusTimeSeconds: 0 },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error: Failed to fetch activity' });
  }
});

// @route   GET /api/activity/optimization
// @desc    Get optimization feedback using simulated ML/Gemini API
// @access  Private (Requires JWT token)
router.get('/optimization', protect, async (req, res) => {
    const userId = req.userId;
    
    try {
        const metrics = await UserMetrics.findOne({ userId });

        if (!metrics || metrics.dailyFocusData.length === 0) {
            return res.json({
                feedback: "Start tracking your focus sessions to unlock personalized optimization feedback!",
                area: "Data Collection",
                action: "Record 5 sessions this week."
            });
        }

        // --- SIMULATED GEMINI API CALL (LLM/ML Analysis) ---
        
        const totalFocus = (metrics.totalFocusTimeSeconds / 3600).toFixed(1);
        const lastDayData = metrics.dailyFocusData.slice(-1)[0];
        const lastDayFocus = lastDayData ? (lastDayData.focusTime / 3600).toFixed(1) : 0;
        
        let feedback = "";
        let area = "";

        if (totalFocus > 5) {
            area = "Work-Life Balance";
            feedback = `Your total focus time this month (${totalFocus} hours) is excellent! However, we notice your activity often extends past 8 PM. Try using the Pomodoro technique to wrap up tasks before dinner to prevent burnout.`;
        } else if (lastDayFocus < 2) {
            area = "Morning Focus";
            feedback = `Your focus sessions today were short (${lastDayFocus} hours). Try scheduling a single 90-minute deep work block first thing in the morning to maximize your high-energy hours.`;
        } else {
            area = "Consistency";
            feedback = `You're making great progress! Your daily focus time averages ${lastDayFocus} hours. The next step is consistency: aim for at least 3 high-focus blocks every day this week.`;
        }


        res.json({
            feedback,
            area,
            action: "Apply feedback immediately.",
        });

    } catch (error) {
        console.error("Error fetching optimization:", error.message);
        res.status(500).json({ message: 'Server error: Failed to get optimization data' });
    }
});

export default router;