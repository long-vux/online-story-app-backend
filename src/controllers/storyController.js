const Story = require('../models/Story');

// Tạo truyện mới (Admin only)
const createStory = async (req, res) => {
  try {
    const { title, description, category_id, status, admin_id } = req.body;
    const story = new Story({ title, description, category_id, status, admin_id });
    await story.save();
    res.status(201).json(story);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Lấy danh sách truyện theo thể loại
const getStoriesByCategory = async (req, res) => {
  try {
    const stories = await Story.find({ category_id: req.params.category_id })
      .populate('category_id')
      .populate('admin_id');
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createStory, getStoriesByCategory };