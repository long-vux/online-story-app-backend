const path = require('path');
const ChapterImage = require('../models/ChapterImage');
const fs = require('fs');
const Chapter = require('../models/Chapter');
const Story = require('../models/Story');


// 📌 Thêm hình ảnh vào Chapter (tự động lấy storyTitle và tăng image_order)
exports.uploadChapterImages = async (req, res) => {
  try {
    const { chapter_id } = req.body;

    // Lấy chapter và story tương ứng
    const chapter = await Chapter.findById(chapter_id);
    if (!chapter) return res.status(404).json({ message: 'Chapter không tồn tại!' });

    const story = await Story.findById(chapter.story_id);
    if (!story) return res.status(404).json({ message: 'Story không tồn tại!' });

    const storyTitle = story.title.trim().replace(/\s+/g, '_'); // Format lại title (bỏ khoảng trắng)
    const chapterNumber = chapter.chapter_number;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Chưa có hình ảnh nào được tải lên!' });
    }

    // Tạo thư mục đích nếu chưa có: /uploads/storyTitle/chapterNumber
    const destDir = path.join(__dirname, '..', 'uploads', storyTitle, String(chapterNumber));
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // Lấy số thứ tự ảnh lớn nhất trong chapter
    const lastImage = await ChapterImage.findOne({ chapter_id }).sort('-image_order');
    let nextOrder = lastImage ? lastImage.image_order + 1 : 1;

    // Lưu vào DB và chuyển file từ thư mục tạm sang đích
    const uploadedImages = [];
    for (const file of req.files) {
      // Đường dẫn file hiện tại (thư mục tạm)
      const tmpPath = file.path;
      // Đường dẫn đích
      const destPath = path.join(destDir, file.filename);

      // Chuyển file từ thư mục tạm sang thư mục đích
      fs.renameSync(tmpPath, destPath);

      // Lưu thông tin ảnh với đường dẫn tương đối theo format /uploads/storyTitle/chapterNumber/filename
      const newImage = new ChapterImage({
        chapter_id,
        image_url: `/uploads/${storyTitle}/${chapterNumber}/${file.filename}`,
        image_order: nextOrder++,
      });
      await newImage.save();
      uploadedImages.push(newImage);
    }

    res.status(201).json({ message: 'Tải ảnh lên thành công!', images: uploadedImages });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server!', error: error.message });
  }
};

// 📌 Lấy danh sách ảnh của một Chapter
exports.getChapterImages = async (req, res) => {
  try {
    const { chapter_id } = req.params;
    const images = await ChapterImage.find({ chapter_id }).sort('image_order');
    res.json({ images });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server!', error: error.message });
  }
};

// 📌 Cập nhật ảnh (chỉ 1 ảnh, giữ nguyên image_order)
exports.updateChapterImage = async (req, res) => {
  try {
    const { id } = req.params;
    const newFile = req.file;

    if (!newFile) {
      return res.status(400).json({ message: 'Chưa có hình ảnh mới!' });
    }

    const chapterImage = await ChapterImage.findById(id).populate('chapter_id');
    if (!chapterImage) {
      return res.status(404).json({ message: 'Không tìm thấy ảnh!' });
    }

    // Lấy storyTitle và chapterNumber
    const chapter = chapterImage.chapter_id;
    const story = await Story.findById(chapter.story_id);
    const storyTitle = story.title.trim().replace(/\s+/g, '_');
    const chapterNumber = chapter.chapter_number;

    // Tạo thư mục đích nếu chưa có
    const destDir = path.join(__dirname, '..', 'uploads', storyTitle, String(chapterNumber));
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // Xóa ảnh cũ
    const oldImagePath = path.join(__dirname, '..', chapterImage.image_url);
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }

    // Di chuyển file từ thư mục tạm sang thư mục đích
    const tmpPath = newFile.path;
    const destPath = path.join(destDir, newFile.filename);
    fs.renameSync(tmpPath, destPath);

    // Cập nhật lại đường dẫn ảnh mới
    chapterImage.image_url = `/uploads/${storyTitle}/${chapterNumber}/${newFile.filename}`;
    await chapterImage.save();

    res.json({ message: 'Cập nhật ảnh thành công!', image: chapterImage });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server!', error: error.message });
  }
};

// 📌 Xóa một ảnh
exports.deleteChapterImage = async (req, res) => {
  try {
    const { id } = req.params;
    const chapterImage = await ChapterImage.findById(id);
    if (!chapterImage) {
      return res.status(404).json({ message: 'Không tìm thấy ảnh!' });
    }

    // Xóa ảnh trên hệ thống
    const imagePath = path.join(__dirname, '..', chapterImage.image_url);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Xóa khỏi database
    await ChapterImage.findByIdAndDelete(id);

    res.json({ message: 'Xóa ảnh thành công!' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server!', error: error.message });
  }
};
