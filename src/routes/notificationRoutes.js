const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationController');

// Lấy danh sách thông báo
router.get('/', getNotifications);

// Đánh dấu một thông báo đã đọc
router.patch('/:id/read', markAsRead);

// Đánh dấu tất cả thông báo đã đọc
router.patch('/read-all', markAllAsRead);

module.exports = router;
