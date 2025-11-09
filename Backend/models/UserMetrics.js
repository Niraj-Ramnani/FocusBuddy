// backend/models/UserMetrics.js
import mongoose from 'mongoose';

const UserMetricsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // Only one metrics document per user
  },
  totalFocusTimeSeconds: {
    type: Number,
    default: 0,
  },
  lastWeekFocusHours: {
    type: Number,
    default: 0,
  },
  // Simple representation of data points for ML input
  dailyFocusData: {
    type: [
      {
        date: Date,
        focusTime: Number, // seconds
        distractionCount: Number,
        avgFocusScore: Number,
      }
    ],
    default: [],
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const UserMetrics = mongoose.model('UserMetrics', UserMetricsSchema);
export default UserMetrics;