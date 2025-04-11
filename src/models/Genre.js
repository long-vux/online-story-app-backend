const mongoose = require('mongoose');
const Story = require('./Story'); // Import model Story

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
}, { timestamps: true });

// Middleware: Xóa tất cả truyện thuộc genre trước khi xóa genre
genreSchema.pre("findOneAndDelete", async function (next) {
  try {
    const genreId = this._conditions._id;
    await Story.deleteMany({ genre_id: genreId });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Genre', genreSchema);