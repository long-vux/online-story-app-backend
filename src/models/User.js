const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
    contact_info: { type: String },
    role: { type: String, enum: ['Reader', 'Admin'], default: 'Reader' },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);