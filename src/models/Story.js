const mongoose = require('mongoose');
const Chapter = require('./Chapter');

const storySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    status: { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Admin quản lý truyện
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