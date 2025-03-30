const express = require('express');
const router = express.Router();
const { createChapter, getChaptersByStory, addChapterImage } = require('../src/controllers/chapterController');

router.post('/', createChapter);
router.get('/story/:story_id', getChaptersByStory);
router.post('/:chapter_id/images', addChapterImage);

module.exports = router;