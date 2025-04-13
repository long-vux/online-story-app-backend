// src/middleware/uploadAvatar.js
const path = require('path');
const createUploader = require('../config/multerStorage');

const storyThumbnailUpload = createUploader(() => {
  return path.join(__dirname, '..', 'uploads', 'tmp');
});

module.exports = storyThumbnailUpload;
