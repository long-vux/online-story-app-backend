const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead } = require('../controllers/notificationController');

// Lấy danh sách thông báo
router.get('/', getNotifications);

// Đánh dấu một thông báo đã đọc
router.patch('/:id/read', markAsRead);

module.exports = router;
