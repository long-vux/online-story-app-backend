const express = require('express');
// const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./src/config/db.js');
// const readingProgressRoutes = require("./src/routes/readingProgressRoutes");
// const { saveProgressToDatabase } = require("./src/controllers/readingProgressController");
require('dotenv').config();


const app = express();
const path = require('path');

// web socket.io
const http = require('http'); // 👈 NEW
const { Server } = require('socket.io'); // 👈 NEW
// Tạo HTTP server từ Express app
const server = http.createServer(app); // 👈 NEW

// Tạo instance Socket.IO trên cùng server
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // React app
        methods: ['GET', 'POST']
    }
});
app.set('io', io);

const publisher = require('./src/services/publisher'); // Import publisher

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
app.use('/api/notifications', require('./src/routes/notificationRoutes'));
// app.use("/api/progress", readingProgressRoutes);

// Gọi hàm lưu tiến trình đọc vào database mỗi 5 phút
// setInterval(saveProgressToDatabase, 1 * 60 * 1000);

// Khi có client kết nối socket
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Lắng nghe sự kiện join room
    socket.on('subscribe', (userId) => {
        socket.join(userId); // Tham gia room theo userId
        console.log(`User ${userId} joined their room`);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Pass io instance to publisher
publisher.setIO(io);

const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
server.listen(PORT, () => console.log(`🚀 Server + Socket.IO running on port ${PORT}`));
