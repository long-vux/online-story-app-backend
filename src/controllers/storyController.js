const Story = require("../models/Story");
const Category = require("../models/Category");

// 🟢 [POST] /api/stories   ---- (Tạo truyện (Admin only))
const createStory = async (req, res) => {
  try {
    const { title, description, category_id, status } = req.body;
    const admin_id = req.user.userId; // Lấy ID của admin từ token

    const category = await Category.findById(category_id);
    if (!category) return res.status(404).json({ message: "Danh mục không tồn tại!" });

    const newStory = new Story({ title, description, category_id, status, admin_id });
    await newStory.save();

    res.status(201).json({ message: "Truyện đã được tạo thành công!", story: newStory });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// 🟢 [GET] /api/stories ----- (Lấy danh sách truyện)
const getStories = async (req, res) => {
  try {
    const stories = await Story.find()
      .populate("category_id", "name")
      .populate("admin_id", "username email");

    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// 🟢 [GET] /api/stories/:id ---- (Lấy truyện theo ID)
const getStoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const story = await Story.findById(id)
      .populate("category_id", "name")
      .populate("admin_id", "username email");

    if (!story) return res.status(404).json({ message: "Truyện không tồn tại!" });

    res.json(story);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// 🟢 [PUT] /api/stories/:id -------- Cập nhật truyện (Admin only)
const updateStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category_id, status } = req.body;
    const category = await Category.findById(category_id);
    if (!category) return res.status(404).json({ message: "Danh mục không tồn tại!" });

    const story = await Story.findById(id);
    if (!story) return res.status(404).json({ message: "Truyện không tồn tại!" });

    story.title = title || story.title;
    story.description = description || story.description;
    story.category_id = category_id || story.category_id;
    story.status = status || story.status;

    await story.save();
    res.json({ message: "Cập nhật truyện thành công!", story });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// 🟢 [DELETE] /api/stories/:id --------- Xóa truyện (Admin only)
const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;
    const story = await Story.findById(id);
    if (!story) return res.status(404).json({ message: "Truyện không tồn tại!" });

    await Story.findByIdAndDelete(id);
    res.json({ message: "Xóa truyện thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};


module.exports = { createStory, getStories, getStoryById, updateStory, deleteStory };
