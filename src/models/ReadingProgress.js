const mongoose = require("mongoose");

const ReadingProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  storyId: { type: String, required: true },
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true }, // Tham chiếu đến Chapter
}, { timestamps: true });

module.exports = mongoose.model("ReadingProgress", ReadingProgressSchema);
