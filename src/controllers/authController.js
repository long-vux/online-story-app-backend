const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// [POST] api/user/register 
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Kiểm tra email hoặc username đã tồn tại chưa
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email đã được sử dụng!' });

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'Đăng ký thành công!', user });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server! ' + error.message });
  }
};

// [POST] api/user/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

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
      { expiresIn: '5h' }
    );

    res.json({ message: 'Đăng nhập thành công!', token });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server!' + error.message });
  }
}

// [GET] api/user/    Lấy danh sách người dùng (Admin only)
const getUsers = async (req, res) => {
  try {
    const requester = req.user; // Lấy thông tin user từ middleware auth

    // Kiểm tra quyền truy cập
    if (requester.role !== "Admin") {
      return res.status(403).json({ message: "Bạn không có quyền truy cập!" });
    }
    const users = await User.find().select("-password"); // Không trả về password
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// [GET] api/user/:id   (Chỉ Admin hoặc chính User đó được phép)
const getUserById = async (req, res) => {
  try {
    const { id } = req.params; // ID của user cần lấy
    const requester = req.user; // Lấy thông tin user từ middleware auth

    // Kiểm tra quyền truy cập
    if (requester.role !== "Admin" && requester.userId !== id) {
      return res.status(403).json({ message: "Bạn không có quyền truy cập!" });
    }

    // Tìm user trong database
    const user = await User.findById(id).select("-password"); // Không trả về password

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
}

// [PUT] api/user/:id
const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // ID của user cần cập nhật
    const { username, email, contact_info, member_level } = req.body;

    const requester = req.user

    // Kiểm tra quyền truy cập
    if (requester.role !== "Admin" && requester.id !== id) {
      return res.status(403).json({ message: "Bạn không có quyền truy cập!" });
    }

    // Kiểm tra xem user có tồn tại không
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }
    // Cập nhật thông tin user
    user.username = username || user.username;
    user.email = email || user.email;
    user.contact_info = contact_info || user.contact_info;
    user.member_level = member_level || user.member_level;

    await user.save();

    res.status(200).json({ message: "Cập nhật thông tin người dùng thành công!" });
  }
  catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
}

// [DELETE] api/user/:id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // ID của user cần xóa
    const requester = req.user; // Lấy thông tin user từ middleware auth
    // Kiểm tra quyền truy cập
    if (requester.role !== "Admin" && requester.id !== id) {
      return res.status(403).json({ message: "Bạn không có quyền truy cập!" });
    }
    // Kiểm tra xem user có tồn tại không
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }
    // Xóa user
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "Xóa người dùng thành công!" });
  }
  catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
}

// [PUT] api/user/change-password/:id
const changePassword = async (req, res) => {
  try {
    const { id } = req.params;  
    const { currentPassword, newPassword } = req.body;
    const requester = req.user; // Lấy thông tin user từ middleware auth

    // Kiểm tra quyền truy cập
    if (requester.userId !== id) {
      return res.status(403).json({ message: "Bạn không có quyền truy cập!" });
    }
    // Kiểm tra xem user có tồn tại không
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }
    // Kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng!' });
    }
    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Cập nhật mật khẩu mới
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Đổi mật khẩu thành công!" });
  }
  catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
}


module.exports = { loginUser, registerUser, getUsers, getUserById, updateUser, deleteUser, changePassword };