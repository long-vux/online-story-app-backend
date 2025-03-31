// routes/bookmarkRoutes.js
const express = require("express");
const router = express.Router();
const { saveBookmark, getBookmark } = require("../controllers/bookmarkController");

router.post("/", saveBookmark);
router.get("/user/:user_id", getBookmark);

module.exports = router;