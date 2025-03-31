const Chapter = require('../models/Chapter');
const Story = require('../models/Story');

// [POST] /api/chapters
const addChapter = async (req, res) => {
  try {
    const { story_id, title, content, chapter_number } = req.body;
    const story = await Story.findById(story_id);

    if (!story) {
      return res.status(404).json({ message: 'Không tìm thấy truyện!' });
    }
    if (story.status === 'completed') {
      return res.status(400).json({ message: 'Truyện đã hoàn thành, không thể thêm chương mới!' });
    }
    // Kiểm tra chapter_number hợp lệ
    if (chapter_number > story.number_of_chapters) {
      return res.status(400).json({ message: `Chỉ có thể thêm tối đa ${story.number_of_chapters} chương!` });
    }

    // Kiểm tra xem chapter_number đã tồn tại chưa
    const existingChapter = await Chapter.findOne({ story_id, chapter_number });
    if (existingChapter) {
      return res.status(400).json({ message: `Chương ${chapter_number} đã tồn tại!` });
    }

    // Cập nhật latest_chapter nếu cần
    if (chapter_number > story.latest_chapter) {
      story.latest_chapter = chapter_number;
    }

    // Tạo chương mới
    const newChapter = new Chapter({ story_id, chapter_number, title, content });
    await newChapter.save();

    // Đếm số chương thực tế hiện có
    const actualChapterCount = await Chapter.countDocuments({ story_id });

    // Nếu đủ số chương thì đánh dấu là completed
    if (actualChapterCount === story.number_of_chapters) {
      story.status = 'completed';
    } 

    await story.save();

    res.status(201).json({ message: 'Thêm chương thành công!', chapter: newChapter });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server!', error: error.message });
  }
};


// [GET] /api/chapters/:id
const getChapterById = async (req, res) => {
  try {
    const { id } = req.params;
    const chapter = await Chapter.findById(id).populate('story_id', 'title');

    if (!chapter) {
      return res.status(404).json({ message: 'Không tìm thấy chương!' });
    }

    res.json(chapter);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server!', error: error.message });
  }
};

// [PUT] /api/chapters/:id
const updateChapter = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const updatedChapter = await Chapter.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );

    if (!updatedChapter) {
      return res.status(404).json({ message: 'Không tìm thấy chương!' });
    }

    res.json({ message: 'Cập nhật chương thành công!', chapter: updatedChapter });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server!', error: error.message });
  }
};

// [DELETE] /api/chapters/:id
const deleteChapter = async (req, res) => {
  try {
    const { id } = req.params;
    const chapter = await Chapter.findById(id);
    if (!chapter) {
      return res.status(404).json({ message: 'Không tìm thấy chương!' });
    }

    const deletedChapter = await Chapter.findByIdAndDelete(id);
    console.log("deletedChapter", deletedChapter);
    // Cập nhật trạng thái của story
    const story = await Story.findById(deletedChapter.story_id);
    if (!story) {
      return res.status(404).json({ message: 'Không tìm thấy truyện!' });
    }
    story.status = 'ongoing';
    await story.save(); // Lưu lại thay đổi

    res.json({ message: 'Xóa chương thành công!' });
  } catch (error) {
    console.error("Lỗi server:", error); // Debug: In lỗi ra console

    res.status(500).json({ message: 'Lỗi server!', error: error.message });
  }
};


module.exports = {
  addChapter,
  getChapterById,
  updateChapter,
  deleteChapter,
};
