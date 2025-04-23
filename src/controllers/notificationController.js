const NotificationRepository = require('../repositories/notificationRepository');

// Lấy tất cả thông báo (có thể phân trang)
const getNotifications = async (req, res) => {
  try {
    const notifications = await NotificationRepository.findAll();
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách thông báo!', error: err.message });
  }
};

// Đánh dấu đã đọc
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await NotificationRepository.updateById(id, { isRead: true });

    if (!notification) {
      return res.status(404).json({ message: 'Không tìm thấy thông báo!' });
    }

    res.json({ message: 'Đã đánh dấu đã đọc' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi đánh dấu thông báo!', error: err.message });
  }
};

// Đánh dấu tất cả đã đọc
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id; // Lấy user từ token
    await NotificationRepository.updateMany({ user_id: userId, isRead: false }, { isRead: true });
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
