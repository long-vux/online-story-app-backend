const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  story_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Story', required: true },
  chapter_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
});

module.exports = mongoose.model('Bookmark', bookmarkSchema);