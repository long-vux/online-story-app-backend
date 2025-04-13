const express = require("express");
const { createStory, getStories, getStoryById, updateStory, deleteStory, getChaptersByStory } = require("../controllers/storyController");
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");
const storyThumbnailUpload = require("../middlewares/storyThumbnailUpload");
const router = express.Router();

router.post("/", verifyToken, verifyAdmin, storyThumbnailUpload.single("thumbnail"), createStory); // Chỉ Admin mới có thể tạo truyện
router.get("/", getStories); // Ai cũng có thể xem danh sách truyện
router.get("/:id", getStoryById); // Ai cũng có thể xem truyện 
router.put("/:id", verifyToken, verifyAdmin, updateStory); // Chỉ Admin mới có thể sửa truyện
router.delete("/:id", verifyToken, verifyAdmin, deleteStory); // Chỉ Admin mới có thể xóa truyện
router.get("/:storyId/chapters", getChaptersByStory); // Lấy chapters theo story_id

module.exports = router;