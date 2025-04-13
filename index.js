const express = require('express');
// const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./src/config/db.js');
const readingProgressRoutes = require("./src/routes/readingProgressRoutes");
// const { saveProgressToDatabase } = require("./src/controllers/readingProgressController");
require('dotenv').config();

const app = express();
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));
// Middleware
app.use(cors());
app.use(express.json(), express.urlencoded({ extended: true }));

// Kết nối MongoDB
connectDB();

// Routes
app.use('/api/user', require('./src/routes/authRoutes'));
app.use('/api/stories', require('./src/routes/storyRoutes'));
app.use('/api/chapters', require('./src/routes/chapterRoutes'));
app.use('/api/genres', require('./src/routes/genreRoutes'));
app.use('/api/chapters', require('./src/routes/chapterRoutes'));
app.use('/api/chapter-image', require('./src/routes/chapterImageRoutes'));
app.use("/api/progress", readingProgressRoutes);

// // Gọi hàm lưu tiến trình đọc vào database mỗi 5 phút
// setInterval(saveProgressToDatabase, 5 * 60 * 1000);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));