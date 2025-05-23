const Story = require('../models/Story');
const Chapter = require('../models/Chapter');
const fs = require('fs');
const path = require('path');

class StoryRepository {
  // Find all stories
  static async findAll() {
    try {
      return await Story.find();
    } catch (error) {
      throw new Error('Error in findAll: ' + error.message);
    }
  }

  // Find a story by ID and populate relevant fields
  static async findById(id) {
    try {
      return await Story.findById(id)
        .populate('comments')
        .populate('ratings.userId', 'username')
        .populate({
          path: 'comments',
          populate: {
            path: 'userId',
            select: 'username'
          }
        });
    } catch (error) {
      throw new Error('Error in findById: ' + error.message);
    }
  }

  // Create a new story
  static async create(storyData) {
    try {
      const newStory = new Story(storyData);
      await newStory.save();
      return newStory;
    } catch (error) {
      throw new Error('Error in create: ' + error.message);
    }
  }

  // Update a story by its ID
  static async update(id, updateData) {
    try {
      return await Story.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      throw new Error('Error in update: ' + error.message);
    }
  }

  // Delete a story by its ID
  static async delete(id) {
    try {
      return await Story.findByIdAndDelete(id);
    } catch (error) {
      throw new Error('Error in delete: ' + error.message);
    }
  }

  // Find chapters of a story by its ID
  static async findChaptersByStoryId(storyId) {
    try {
      return await Chapter.find({ story_id: storyId }).populate('story_id', 'title');
    } catch (error) {
      throw new Error('Error in findChaptersByStoryId: ' + error.message);
    }
  }

  static async updateRating(storyId, userId, rating) {
    const story = await this.findById(storyId);
    if (!story) return null;

    // Kiểm tra nếu user đã đánh giá trước đó
    const existingRating = story.ratings.find(r => r.userId._id === userId);
    if (existingRating) {
      existingRating.rating = rating; // Cập nhật rating
    } else {
      story.ratings.push({ userId, rating });
    }

    // Tính toán lại averageRating
    const totalRatings = story.ratings.reduce((acc, r) => acc + r.rating, 0);
    story.averageRating = totalRatings / story.ratings.length;

    await story.save();
    return story;
  }

  // Handle story thumbnail (file management)
  static handleThumbnail(req, data) {
    if (req.file) {
      const tmpPath = req.file.path;
      const filename = req.file.filename;

      const destDir = path.join(__dirname, '..', 'uploads', 'thumbnails');
      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

      const destPath = path.join(destDir, filename);
      fs.renameSync(tmpPath, destPath);

      data.thumbnail = filename;
    }
    return data;
  }

  async countDocuments(query) {
    return Story.countDocuments(query);
  }
}

module.exports = StoryRepository;
