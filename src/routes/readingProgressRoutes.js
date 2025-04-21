const express = require('express');
const router = express.Router();
const { getProgress, updateProgress, createProgress } = require('../controllers/readingProgressController');
const { verifyToken } = require('../middlewares/authMiddleware');


// [GET] /api/progress/:userId/:storyId
router.get('/:userId/:storyId',verifyToken, getProgress);

// [POST] /api/progress
router.post('/',verifyToken, updateProgress);

// [DELETE] /api/progress
router.delete('/',verifyToken, createProgress);

module.exports = router;
