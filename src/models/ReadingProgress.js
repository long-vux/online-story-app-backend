const mongoose = require("mongoose");

const ReadingProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  storyId: { type: String, required: true },
  chapterId: { type: Number, default: 1 },
  page: { type: Number, default: 1 },
}, { timestamps: true });

module.exports = mongoose.model("ReadingProgress", ReadingProgressSchema);
