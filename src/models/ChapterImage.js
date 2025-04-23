// models/ChapterImage.js
const mongoose = require('mongoose');

const ChapterImageSchema = new mongoose.Schema({
  chapter_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
  image_order: {
    type: Number,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Compound index for unique image_order within each chapter_id
ChapterImageSchema.index({ chapter_id: 1, image_order: 1 }, { unique: true });

const ChapterImage = mongoose.model('ChapterImage', ChapterImageSchema);
module.exports = ChapterImage;
