const express = require('express');
const router = express.Router();
const Chapter = require('../models/Chapter');
const ChapterImage = require('../models/ChapterImage');

// Tạo chương mới (Admin only)
router.post('/', async (req, res) => {
  try {
    const { story_id, chapter_number, title, content } = req.body;
    const chapter = new Chapter({ story_id, chapter_number, title, content });
    await chapter.save();
    res.status(201).json(chapter);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Lấy danh sách chương của một truyện
router.get('/story/:story_id', async (req, res) => {
  try {
    const chapters = await Chapter.find({ story_id: req.params.story_id });
    res.json(chapters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Thêm hình ảnh vào chương (Admin only)
router.post('/:chapter_id/images', async (req, res) => {
  try {
    const { image_url, image_order } = req.body;
    const chapterImage = new ChapterImage({
      chapter_id: req.params.chapter_id,
      image_url,
      image_order,
    });
    await chapterImage.save();
    res.status(201).json(chapterImage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;