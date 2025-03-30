const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
    contact_info: { type: String },
    member_level: { type: Number, default: 0 },
    role: { type: String, enum: ['Reader', 'Admin'], default: 'Reader' },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);