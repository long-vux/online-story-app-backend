const ReadingProgress = require("../models/ReadingProgress");
const ReadingProgressManager = require('../utils/ReadingProgressManager');

// Lấy tiến trình đọc
const getProgress = async (req, res) => {
  try {
    const { userId, storyId } = req.params;
    const progress = await ReadingProgressManager.getProgress(userId, storyId);
    res.json({ progress });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching progress', error });
  }
};

// Cập nhật tiến trình đọc
const updateProgress = async (req, res) => {
  try {
    const { userId, storyId, chapterId } = req.body;
    const updatedProgress = await ReadingProgressManager.updateProgress(userId, storyId, chapterId);
    res.status(200).json({ message: 'Progress updated successfully!', progress: updatedProgress }); // Send a single response
  } catch (error) {
    res.status(500).json({ message: 'Error updating progress', error });
  }
};

const createProgress = async (req, res) => {
  try {
    const { userId, storyId, chapterId } = req.body;
    const progress = new ReadingProgress({ userId, storyId, chapterId });
    await progress.save();
    res.status(201).json({ message: 'Progress created successfully!' });
  }
  catch (error) {
    res.status(500).json({ message: 'Error creating progress', error });
  }
};
module.exports = { getProgress, updateProgress, createProgress };

