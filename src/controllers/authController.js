const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// [POST] api/user/register 
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Kiểm tra email hoặc username đã tồn tại chưa
    let user = await User.findOne({ email, username });
    if (user) return res.status(400).json({ message: 'Email hoặc Username đã được sử dụng!' });

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'Đăng ký thành công!' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server!' + error.message });
  }
};


// [POST] api/user/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email)

    // Kiểm tra user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Tài khoản không tồn tại!' });

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Sai mật khẩu!' });

    // Tạo token JWT
    const payload = {
      userId: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar || null,
      contact_info: user.contact_info || '',
      member_level: user.member_level,
      role: user.role,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Đăng nhập thành công!', token });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server!' + error.message });
  }
}


// Lấy danh sách người dùng (Admin only)
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { loginUser, registerUser, getUsers };