const Notification = require('../models/Notification');
const publisher = require('../services/publisher');

// Lấy tất cả thông báo (có thể phân trang)
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .populate('story_id', 'title')
      .populate('chapter_id', 'chapter_number title');
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách thông báo!', error: err.message });
  }
};

// Đánh dấu đã đọc
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { isRead: true });
    res.json({ message: 'Đã đánh dấu đã đọc' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi đánh dấu thông báo!', error: err.message });
  }
};

// Đánh dấu tất cả đã đọc
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id; // Lấy user từ token
    await Notification.updateMany({ user_id: userId, isRead: false }, { isRead: true });
    res.json({ message: 'Đã đánh dấu tất cả thông báo là đã đọc' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi đánh dấu thông báo!', error: err.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};
