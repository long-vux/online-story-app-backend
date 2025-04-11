const express = require("express");
const { createGenre, getGenres, getGenreById, updateGenre, deleteGenre, getStoriesByGenre } = require("../controllers/genreController");
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware"); // Middleware xác thực

const router = express.Router();

router.post("/", verifyToken, verifyAdmin, createGenre); // Chỉ admin tạo được danh mục
router.get("/", getGenres); // Lấy danh sách danh mục (ai cũng có thể xem)
router.get("/:id", getGenreById); // Lấy danh mục theo ID
router.put("/:id", verifyToken, verifyAdmin, updateGenre); // Chỉ admin cập nhật
router.delete("/:id", verifyToken, verifyAdmin, deleteGenre); // Chỉ admin có thể xóa
router.get("/:genreName/stories", getStoriesByGenre); // Lấy truyện theo danh mục

module.exports = router;