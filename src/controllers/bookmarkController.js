// controllers/bookmarkController.js
const Bookmark = require("../models/Bookmark");

class BookmarkManager {
  static instance = null;
  progress = {};

  static getInstance() {
    if (!BookmarkManager.instance) {
      BookmarkManager.instance = new BookmarkManager();
    }
    return BookmarkManager.instance;
  }

  async setProgress(userId, storyId, chapterId) {
    this.progress[userId] = { storyId, chapterId };
    // Lưu vào database
    await Bookmark.findOneAndUpdate(
      { user_id: userId, story_id: storyId },
      { chapter_id: chapterId },
      { upsert: true }
    );
  }

  async getProgress(userId) {
    const bookmark = await Bookmark.findOne({ user_id: userId });
    return bookmark || this.progress[userId] || null;
  }
}

const bookmarkManager = BookmarkManager.getInstance();

const saveBookmark = async (req, res) => {
  const { user_id, story_id, chapter_id } = req.body;
  await bookmarkManager.setProgress(user_id, story_id, chapter_id);
  res.status(201).json({ message: "Bookmark saved" });
};

const getBookmark = async (req, res) => {
  const progress = await bookmarkManager.getProgress(req.params.user_id);
  res.json(progress);
};

module.exports = { saveBookmark, getBookmark };

