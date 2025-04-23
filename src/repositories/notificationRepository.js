// repositories/NotificationRepository.js
const Notification = require('../models/Notification');

class NotificationRepository {
  // Get all notifications
  async findAll(query = {}, sort = { createdAt: -1 }) {
    return Notification.find(query)
      .sort(sort)
      .populate('story_id', 'title')
      .populate('chapter_id', 'chapter_number title');
  }

  // Get a notification by its ID
  async findById(id) {
    return Notification.findById(id);
  }

  // Update a notification by its ID
  async updateById(id, updateData) {
    return Notification.findByIdAndUpdate(id, updateData, { new: true });
  }

  // Update many notifications
  async updateMany(query, updateData) {
    return Notification.updateMany(query, updateData);
  }

  // Create a new notification
  async create(notificationData) {
    const notification = new Notification(notificationData);
    return notification.save();
  }
}

module.exports = new NotificationRepository();
