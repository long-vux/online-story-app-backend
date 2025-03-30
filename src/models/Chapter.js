const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  story_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Story', required: true },
  chapter_number: { type: Number, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
});

module.exports = mongoose.model('Chapter', chapterSchema);