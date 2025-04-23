// repositories/ChapterImageRepository.js
const ChapterImage = require('../models/ChapterImage');

class ChapterImageRepository {
  // Find images by chapter ID
  async findByChapterId(chapterId) {
    return ChapterImage.find({ chapter_id: chapterId }).sort('image_order');
  }

  // Find an image by ID
  async findById(id) {
    return ChapterImage.findById(id);
  }

  async findByIdPopulateChapterId(id) {
    return ChapterImage.findById(id).populate('chapter_id');
    }

  // Create a new chapter image
  async create(imageData) {
    const chapterImage = new ChapterImage(imageData);
    return chapterImage.save();
  }

  // Update an image by ID
  async updateById(id, updateData) {
    return ChapterImage.findByIdAndUpdate(id, updateData, { new: true });
  }

  // Delete an image by ID
  async deleteById(id) {
    return ChapterImage.findByIdAndDelete(id);
  }

  // Find the last image in a chapter
  async findLastImageByChapterId(chapterId) {
    return ChapterImage.findOne({ chapter_id: chapterId }).sort('-image_order');
  }
}

module.exports = new ChapterImageRepository();
