const express = require("express");
const router = express.Router();
const { getProgress, updateProgress } = require("../controllers/readingProgressController");

// [GET] /api/progress/:userId/:bookId
router.get("/:userId/:bookId", getProgress);

// [POST] /api/progress
router.post("/", updateProgress);

