const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const Story = require('../models/Story');

// [POST] api/user/register 
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Kiểm tra email đã tồn tại chưa
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      if (user.email === email) {
        return res.status(400).json({ message: 'Email đã được sử dụng!' });
      } else {
        return res.status(400).json({ message: 'Username đã được sử dụng!' });
      }
    }

    // Kiểm tra email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email không hợp lệ!" });
    }

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

    // Kiểm tra email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email không hợp lệ!" });
    }
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
    const { username, email, contact_info } = req.body;

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
      return res.status(403).json({ message: "Access denied!" });
    }
    // Kiểm tra xem user có tồn tại không
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Invalid user!" });
    }
    // Kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Wrong current password!' });
    }
    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Cập nhật mật khẩu mới
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Change password successfully!" });
  }
  catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
}


const updateAvatar = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!req.file) return res.status(400).json({ message: 'Chưa có ảnh được tải lên!' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User không tồn tại!' });

    // Nếu user đã có avatar -> xóa file cũ
    if (user.avatar) {
      const oldAvatarPath = path.join(__dirname, '..', 'uploads', 'avatars', user.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // Lấy file mới từ thư mục tạm
    const tmpPath = req.file.path;
    const filename = req.file.filename;

    const destDir = path.join(__dirname, '..', 'uploads', 'avatars');
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

    const destPath = path.join(destDir, filename);
    console.log(destPath);
    fs.renameSync(tmpPath, destPath);

    // Cập nhật user với avatar mới
    user.avatar = filename;
    await user.save();

    res.status(200).json({ message: 'Cập nhật avatar thành công!', avatar: filename });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const subscribeStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId);

    // Kiểm tra xem người dùng đã subscribe chưa
    if (story.subscribers.includes(req.user.userId)) {
      return res.status(400).json({ message: "You have already subscribed to this story." });
    }

    // Thêm user vào mảng subscribers của câu chuyện
    story.subscribers.push(req.user.userId);
    await story.save();

    res.status(201).json({ message: 'Subscribed to the story successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while subscribing.' });
  }
}

const unsubscribeStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId);

    // Kiểm tra xem người dùng có đang subscribe không
    if (!story.subscribers.includes(req.user.userId)) {
      return res.status(400).json({ message: "You are not subscribed to this story." });
    }

    // Xóa user khỏi mảng subscribers của câu chuyện
    story.subscribers = story.subscribers.filter(userId => userId.toString() !== req.user.userId.toString());
    await story.save();  // Lưu lại thay đổi trong database

    res.status(204).json({ message: 'Unsubscribed from the story successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while unsubscribing.', error: error.message });
  }
}

const isSubscribed = async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId);
    
    // Kiểm tra xem user đã subscribe chưa
    const isSubscribed = story.subscribers.includes(req.user.userId);
    
    res.json({ isSubscribed });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error checking subscription status', error: error.message });
  }
}


module.exports = { 
  loginUser, 
  registerUser, 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  changePassword, 
  updateAvatar, 
  subscribeStory, 
  unsubscribeStory, 
  isSubscribed 
};