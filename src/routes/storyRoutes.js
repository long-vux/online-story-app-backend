const express = require("express");
const { createStory, getStories, getStoryById, updateStory, deleteStory } = require("../controllers/storyController");
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", verifyToken, verifyAdmin, createStory); // Chỉ Admin mới có thể tạo truyện
router.get("/", getStories); // Ai cũng có thể xem danh sách truyện
router.get("/:id", getStoryById); // Ai cũng có thể xem truyện 
router.put("/:id", verifyToken, verifyAdmin, updateStory); // Chỉ Admin mới có thể sửa truyện
router.delete("/:id", verifyToken, verifyAdmin, deleteStory); // Chỉ Admin mới có thể xóa truyện

module.exports = router;