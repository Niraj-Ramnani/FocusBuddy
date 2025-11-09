// backend/models/Activity.js
import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Time spent in seconds on a specific session or task
  timeSpent: {
    type: Number,
    required: true,
  },
  // Type of activity (e.g., 'focus_session', 'distraction', 'break')
  activityType: {
    type: String,
    required: true,
    enum: ['focus_session', 'distraction', 'break', 'tab_switch'],
  },
  // Attributes about the activity, such as the URL, window title, or focus score
  attributes: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  // Timestamp of when the activity was recorded
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, {
  // Automatically add createdAt and updatedAt timestamps
  timestamps: true,
});

const Activity = mongoose.model('Activity', ActivitySchema);
export default Activity;