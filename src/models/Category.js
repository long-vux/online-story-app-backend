const mongoose = require('mongoose');
const Story = require('./Story'); // Import model Story

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
}, { timestamps: true });

// Middleware: Xóa tất cả truyện thuộc category trước khi xóa category
categorySchema.pre("findOneAndDelete", async function (next) {
  try {
    const categoryId = this._conditions._id;
    await Story.deleteMany({ category_id: categoryId });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Category', categorySchema);