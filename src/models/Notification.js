// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // null nếu public
  story_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Story', required: true },
  chapter_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
