const express = require("express");
const { createStory,
    getStories,
    getStoryById,
    updateStory,
    deleteStory,
    getChaptersByStory,
    createRating,
    createComment,
    updateComment,
    deleteComment,
    subscribeToStory,
    unsubscribeFromStory,
} = require("../controllers/storyController");
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");
const storyThumbnailUpload = require("../middlewares/storyThumbnailUpload");
const router = express.Router();

router.post("/", verifyToken, verifyAdmin, storyThumbnailUpload.single("thumbnail"), createStory); // Chỉ Admin mới có thể tạo truyện
router.get("/", getStories); // Ai cũng có thể xem danh sách truyện
router.get("/:id", getStoryById); // Ai cũng có thể xem truyện 
router.put("/:id", verifyToken, verifyAdmin, updateStory); // Chỉ Admin mới có thể sửa truyện
router.delete("/:id", verifyToken, verifyAdmin, deleteStory); // Chỉ Admin mới có thể xóa truyện
router.get("/:storyId/chapters", getChaptersByStory); // Lấy chapters theo story_id

// comment and rating
router.post("/:storyId/comment", verifyToken, createComment); // Tạo comment
router.put("/:storyId/comment/:commentId", verifyToken, updateComment); // Sửa comment
router.delete("/:storyId/comment/:commentId", verifyToken, deleteComment); // Xóa comment
router.post("/:storyId/rate", verifyToken, createRating); // Tạo rating

// [POST] /api/stories/:storyId/subscribe
router.post('/:storyId/subscribe', verifyToken, subscribeToStory);

// [DELETE] /api/stories/:storyId/unsubscribe
router.delete('/:storyId/unsubscribe', verifyToken, unsubscribeFromStory);

module.exports = router;