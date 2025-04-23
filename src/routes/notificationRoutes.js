const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Lấy danh sách thông báo
router.get('/', getNotifications);

// Đánh dấu một thông báo đã đọc
router.patch('/:id/read',verifyToken,  markAsRead);

// Đánh dấu tất cả thông báo đã đọc
router.patch('/read-all',verifyToken,  markAllAsRead);

module.exports = router;
