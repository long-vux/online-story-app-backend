const path = require('path');
const createUploader = require('../config/multerStorage');

// Middleware upload ảnh cho chapter (Lấy storyTitle & chapterNumber tự động)
const chapterImageUpload = createUploader((req) => {
    return path.join(__dirname, '..', 'uploads/tmp'); // Lưu tạm, controller sẽ di chuyển về đúng thư mục
});

module.exports = chapterImageUpload;