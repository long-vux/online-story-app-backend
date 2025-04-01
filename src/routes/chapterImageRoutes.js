const express = require('express');
const createUploader = require('../config/multerStorage');
const chapterImageController = require('../controllers/chapterImageController.js');
const path = require('path');
const router = express.Router();

// Middleware upload ảnh cho chapter (Lấy storyTitle & chapterNumber tự động)
const chapterImageUpload = createUploader((req) => {
    return path.join(__dirname, '..', 'uploads/tmp'); // Lưu tạm, controller sẽ di chuyển về đúng thư mục
});

// 📌 API Upload ảnh cho Chapter (có thể up nhiều ảnh)
// [POST] /api/chapter-image/
router.post('/', chapterImageUpload.array('images', 10), chapterImageController.uploadChapterImages);

// 📌 API Cập nhật 1 ảnh
// [PUT] /api/chapter-image/
router.put('/:id', chapterImageUpload.single('image'), chapterImageController.updateChapterImage);

// 📌 API Lấy danh sách ảnh của Chapter
// [GET] /api/chapter-image/:chapter_id
router.get('/:chapter_id', chapterImageController.getChapterImages);

// 📌 API Xóa 1 ảnh
// [DELETE] /api/chapter-image/:id
router.delete('/:id', chapterImageController.deleteChapterImage);

module.exports = router;
