const express = require('express');
const router = express.Router();
const { addChapter, getChapterById, updateChapter, deleteChapter } = require('../controllers/chapterController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

// [POST] /api/chapters
router.post('/', verifyToken, verifyAdmin, addChapter);

// [GET] /api/chapters/:id
router.get('/:id', getChapterById);

// [PUT] /api/chapters/:id
router.put('/:id',verifyToken, verifyAdmin, updateChapter);

// [DELETE] /api/chapters/:id
router.delete('/:id',verifyToken, verifyAdmin, deleteChapter);

module.exports = router;
