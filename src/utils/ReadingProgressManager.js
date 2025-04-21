const ReadingProgress = require('../models/ReadingProgress'); // Import model

class ReadingProgressManager {
  constructor() {
    if (ReadingProgressManager.instance) {
      console.log('Returning existing ReadingProgressManager instance');
      return ReadingProgressManager.instance; // Ensure only one instance
    }
    console.log('Creating new ReadingProgressManager instance');
    ReadingProgressManager.instance = this;
    Object.freeze(ReadingProgressManager.instance); // Ensure instance is immutable
  }

  // Kiểm tra xem có phải là Singleton instance không
  static isSingleton() {
    console.log('Checking if ReadingProgressManager is a singleton');
    return ReadingProgressManager.instance === this.instance;
  }

  // Lấy tiến trình đọc của user cho một câu chuyện
  async getProgress(userId, storyId) {
    const progress = await ReadingProgress.findOne({ userId, storyId })
      .populate('chapterId', 'chapter_number');
    return progress;
  }

  // Cập nhật tiến trình đọc
  async updateProgress(userId, storyId, chapterId) {
    const updatedProgress = await ReadingProgress.findOneAndUpdate(
      { userId, storyId },
      { chapterId },
      { upsert: true, new: true }
    );
    console.log('Updated progress:', updatedProgress);
  }

  // Xóa tiến trình đọc (nếu cần)
  async clearProgress(userId, storyId) {
    await ReadingProgress.deleteOne({ userId, storyId });
  }
}

// Đảm bảo Singleton Instance
const instance = new ReadingProgressManager();
Object.freeze(instance);

// ======= check singleton instance =======
// const instance1 = new ReadingProgressManager(); 
// const instance2 = new ReadingProgressManager(); 

// console.log(instance1 === instance2); 

module.exports = instance;
