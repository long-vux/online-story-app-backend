const express = require("express");
const { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory, getStoriesByCategory } = require("../controllers/categoryController");
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware"); // Middleware xác thực

const router = express.Router();

router.post("/", verifyToken, verifyAdmin, createCategory); // Chỉ admin tạo được danh mục
router.get("/", getCategories); // Lấy danh sách danh mục (ai cũng có thể xem)
router.get("/:id", getCategoryById); // Lấy danh mục theo ID
router.put("/:id", verifyToken, verifyAdmin, updateCategory); // Chỉ admin cập nhật
router.delete("/:id", verifyToken, verifyAdmin, deleteCategory); // Chỉ admin có thể xóa
router.get("/:categoryId/stories", getStoriesByCategory); // Lấy truyện theo danh mục

module.exports = router;