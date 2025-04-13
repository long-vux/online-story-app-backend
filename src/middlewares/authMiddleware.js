const jwt = require('jsonwebtoken');

// Auth Middleware: Requires a valid token
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded; // Gắn thông tin user vào request
        next();
    } catch (error) {
        res.status(403).json({ message: "Token không hợp lệ!", error: error.message });
    }
};

// admin middleware
const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(401).json({ success: false, message: 'Unauthorized: Admin only' });
    }
}

module.exports = { verifyToken, verifyAdmin };