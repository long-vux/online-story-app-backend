const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    status: { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Admin quản lý truyện
});

module.exports = mongoose.model('Story', storySchema);