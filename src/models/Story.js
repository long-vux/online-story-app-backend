const mongoose = require('mongoose');
const Chapter = require('./Chapter');

const storySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    author: { type: String, required: true },
    genre: { type: String },
    thumbnail: { type: String },
    ratings: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            rating: { type: Number, required: true, min: 1, max: 5 },
        },
    ],
    averageRating: { type: Number, default: 0 },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    number_of_chapters: { type: Number, default: 0 }, // Số chương hiện tại
    latest_chapter: { type: Number, default: 0 }, // Số thứ tự chương mới nhất
    status: { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
    subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

storySchema.pre('findOneAndDelete', async function (next) {
    try {
        const story = await this.model.findOne(this.getQuery());

        if (!story) return next(); // Tránh lỗi nếu không tìm thấy

        await Chapter.deleteMany({ story_id: story._id }); // ✅ Dùng story._id

        next();
    }
    catch (error) {
        next(error);
    }
});

storySchema.pre('save', function (next) {
    // Tính trung bình rating trước khi lưu
    if (this.ratings.length > 0) {
      const total = this.ratings.reduce((sum, r) => sum + r.rating, 0);
      this.averageRating = total / this.ratings.length;
    } else {
      this.averageRating = 0;
    }
    next();
  });

module.exports = mongoose.model('Story', storySchema);