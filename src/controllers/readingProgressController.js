const ReadingProgress = require("../models/ReadingProgress");
const ReadingProgressManager = require("../utils/ReadingProgressManager").default;

// Lấy tiến trình đọc từ Singleton
const getProgress = async (req, res) => {
  const { userId, storyId } = req.params;
  const progress = ReadingProgressManager.getProgress(userId, storyId);
  res.json(progress);
};

// Cập nhật tiến trình đọc vào Singleton
const updateProgress = async (req, res) => {
  const { userId, storyId, chapter } = req.body;
  ReadingProgressManager.updateProgress(userId, storyId, chapter);
  res.json({ message: "Progress updated in memory", progress: { chapter } });
};

// Hàm lưu cache vào database (gọi định kỳ)
const saveProgressToDatabase = async () => {
  await ReadingProgressManager.saveProgressToDatabase(ReadingProgress);
};

export { getProgress, updateProgress, saveProgressToDatabase };