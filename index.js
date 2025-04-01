const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./src/config/db.js');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json(), express.urlencoded({ extended: true }));

// Kết nối MongoDB
connectDB();

// Routes
app.use('/api/user', require('./src/routes/authRoutes'));
// app.use('/api/admin', require('./src/routes/adminRoutes'));
app.use('/api/stories', require('./src/routes/storyRoutes'));
app.use('/api/chapters', require('./src/routes/chapterRoutes'));
app.use('/api/categories', require('./src/routes/categoryRoutes'));
app.use('/api/chapters', require('./src/routes/chapterRoutes'));
app.use('/api/chapter-image', require('./src/routes/chapterImageRoutes'));
// app.use('/api/bookmarks', require('./src/routes/bookmarkRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));