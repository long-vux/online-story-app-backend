const mongoose = require('mongoose');
const Chapter = require('./Chapter');

const storySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    author: { type: String, required: true },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    number_of_chapters: { type: Number, default: 0 }, // Số chương hiện tại
    latest_chapter: { type: Number, default: 0 }, // Số thứ tự chương mới nhất
    status: { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
}, { timestamps: true });

storySchema.pre('findOneAndDelete', async function (next) {
    try {
        const story = await this.model.findOne(this.getQuery());

        const storyId = this._condition._id;
        await Chapter.deleteMany({ story_id: storyId });

        next();
    }
    catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Story', storySchema);