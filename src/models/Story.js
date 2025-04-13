const mongoose = require('mongoose');
const Chapter = require('./Chapter');

const storySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    author: { type: String, required: true },
    genre: { type: String },
    thumbnail: { type: String },
    number_of_chapters: { type: Number, default: 0 }, // Số chương hiện tại
    latest_chapter: { type: Number, default: 0 }, // Số thứ tự chương mới nhất
    status: { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
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

module.exports = mongoose.model('Story', storySchema);