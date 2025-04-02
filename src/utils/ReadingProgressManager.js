class ReadingProgressManager {
  constructor() {
    if (!ReadingProgressManager.instance) {
      this.userProgress = {}; // Lưu tiến trình đọc trên bộ nhớ server
      ReadingProgressManager.instance = this;
    }
    return ReadingProgressManager.instance;
  }

  // Lấy tiến trình đọc từ cache
  getProgress(userId, storyId) {
    const key = `${userId}-${storyId}`;
    return this.userProgress[key] || { chapter: 1 };
  }

  // Cập nhật tiến trình đọc vào cache
  updateProgress(userId, storyId, chapter) {
    const key = `${userId}-${storyId}`;
    this.userProgress[key] = { chapter };
  }

  // Lưu tiến trình đọc từ cache vào database (gọi định kỳ)
  async saveProgressToDatabase(db) {
    for (const key in this.userProgress) {
      const [userId, storyId] = key.split("-");
      const progress = this.userProgress[key];

      await db.findOneAndUpdate(
        { userId, storyId },
        { chapter: progress.chapter},
        { upsert: true }
      );
    }
    console.log("Progress saved to database.");
  }
}

// Đảm bảo Singleton Instance
const instance = new ReadingProgressManager();
Object.freeze(instance);

export default instance;
