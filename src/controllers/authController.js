const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const Story = require('../models/Story');
const UserRepository = require('../repositories/UserRepository');

// [POST] api/user/register 
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Kiểm tra email đã tồn tại chưa
    let user = await UserRepository.findOne({ $or: [{ email }, { username }] });
    if (user) {
      if (user.email === email) {
        return res.status(400).json({ message: 'Email is already in use!' });
      } else {
        return res.status(400).json({ message: 'Username is already in use!' });
      }
    }

    // Kiểm tra email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email không hợp lệ!" });
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    user = await UserRepository.create({ username, email, password: hashedPassword });

    res.status(201).json({ message: 'Register successfully!', user });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server! ' + error.message });
  }
};

// [POST] api/user/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra user
    const user = await UserRepository.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email does not exist!' });

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Wrong password!' });

    // Kiểm tra email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email is not valid!" });
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
      return res.status(403).json({ message: "Access denied!" });
    }
    const users = await UserRepository.findAll();
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
      return res.status(403).json({ message: "Access denied!" });
    }

    // Tìm user trong database
    const user = await UserRepository.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
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
      return res.status(403).json({ message: "Access denied!" });
    }

    // Kiểm tra xem user có tồn tại không
    const user = await UserRepository.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    await UserRepository.update(id, { username, email, contact_info });

    res.status(200).json({ message: "User updated successfully!" });
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
      return res.status(403).json({ message: "Access denied!" });
    }
    // Kiểm tra xem user có tồn tại không
    const user = await UserRepository.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    // Xóa user
    await UserRepository.delete(id);
    res.status(200).json({ message: "User deleted successfully!" });
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

    // Validate required parameters
    if (!id || !currentPassword || !newPassword) {
      return res.status(400).json({ message: "Missing required parameters!" });
    }

    // Log the parameters for debugging
    console.log('User ID:', id);
    console.log('Current Password:', currentPassword);
    console.log('New Password:', newPassword);

    // Check if user exists
    const user = await UserRepository.exists(id);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Wrong current password!' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    await UserRepository.update(id, { password: hashedPassword });

    res.status(200).json({ message: "Password changed successfully!" });
  } catch (error) {
    console.error('Error:', error); // Log the error for debugging
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!req.file) return res.status(400).json({ message: 'No file uploaded!' });

    const user = await UserRepository.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found!' });

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
    fs.renameSync(tmpPath, destPath);

    // Cập nhật user với avatar mới qua UserRepository
    const updatedUser = await UserRepository.updateAvatar(userId, filename);

    if (updatedUser) {
      res.status(200).json({ message: 'Avatar updated successfully!', avatar: filename });
    } else {
      res.status(400).json({ message: 'Failed to update avatar.' });
    }

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


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
  isSubscribed 
};