const Chapter = require('../models/Chapter');
const Story = require('../models/Story');
const Notification = require('../models/Notification');
const publisher = require('../services/publisher'); // Import publisher
const ChapterRepository = require('../repositories/chapterRepository');
const StoryRepository = require('../repositories/storyRespository');

// [POST] /api/chapters
const addChapter = async (req, res) => {
  try {
    const { story_id, title, content, chapter_number } = req.body;
    const story = await StoryRepository.findById(story_id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found!' });
    }
    if (story.status === 'completed') {
      return res.status(400).json({ message: 'Story completed, can not add new chapter!' });
    }
    // Kiểm tra chapter_number hợp lệ
    if (chapter_number > story.number_of_chapters) {
      return res.status(400).json({ message: `Chỉ có thể thêm tối đa ${story.number_of_chapters} chương!` });
    }

    // Kiểm tra xem chapter_number đã tồn tại chưa
    const existingChapter = await ChapterRepository.findOne({ story_id, chapter_number });
    if (existingChapter) {
      return res.status(400).json({ message: `Chapter ${chapter_number} exist!` });
    }

    // Cập nhật latest_chapter nếu cần
    if (chapter_number > story.latest_chapter) {
      story.latest_chapter = chapter_number;
    }

    // Tạo chương mới
    const newChapter = new Chapter({ story_id, chapter_number, title, content });
    await ChapterRepository.create(newChapter);

    // Đếm số chương thực tế hiện có
    const actualChapterCount = await Chapter.countDocuments({ story_id });

    // Nếu đủ số chương thì đánh dấu là completed
    if (actualChapterCount === story.number_of_chapters) {
      story.status = 'completed';
    }

    await StoryRepository.update(story_id, story);

    // lưu vào notification rằng có chapter mới
    const notification = new Notification({
      story_id,
      chapter_id: newChapter._id,
      message: `Truyện "${story.title}" vừa cập nhật chương ${chapter_number}!`
    });
    const savedNotification = await notification.save();

    // 🔥 Gửi thông báo đến các subscriber
    await publisher.notify(story_id, savedNotification);

    // // 🔥 Emit socket event để client biết có chương mới
    // const io = req.app.get('io'); // Lấy io từ app (đã gắn ở server.js)
    // io.emit('new-chapter', savedNotification);
    // console.log('📢 Emit socket new-chapter:', savedNotification);

    res.status(201).json({ message: 'Thêm chương thành công!', chapter: newChapter });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server!', error: error.message });
  }
};


// [GET] /api/chapters/:id
const getChapterById = async (req, res) => {
  try {
    const { id } = req.params;
    const chapter = await ChapterRepository.findById(id).populate('story_id', 'title');

    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found!' });
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

    const updatedChapter = await ChapterRepository.update(id, { title, content });

    if (!updatedChapter) {
      return res.status(404).json({ message: 'Không tìm thấy chương!' });
    }

    const story = await StoryRepository.findById(updatedChapter.story_id);
    if (story) {
      const latestChapter = await ChapterRepository.findSorted(
        { story_id: story._id },
        { chapter_number: -1 },
        1
      );
      story.latest_chapter = latestChapter.length > 0 ? latestChapter[0].chapter_number : 0;
      await StoryRepository.update(story._id, story);
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
    const chapter = await ChapterRepository.findById(id);
    if (!chapter) {
      return res.status(404).json({ message: 'Không tìm thấy chương!' });
    }

    const deletedChapter = await ChapterRepository.delete(id);

    const story = await StoryRepository.findById(deletedChapter.story_id);
    if (story) {
      const latestChapter = await ChapterRepository.findSorted(
        { story_id: story._id },
        { chapter_number: -1 },
        1
      );
      story.latest_chapter = latestChapter.length > 0 ? latestChapter[0].chapter_number : 0;
      story.status = 'ongoing';
      await StoryRepository.update(story._id, story);
    }

    res.json({ message: 'Xóa chương thành công!' });
  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({ message: 'Lỗi server!', error: error.message });
  }
};


module.exports = {
  addChapter,
  getChapterById,
  updateChapter,
  deleteChapter,
};
