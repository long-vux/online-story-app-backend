const express = require('express');
const router = express.Router();
const { loginUser, registerUser, getUsers, getUserById, updateUser, deleteUser, changePassword, updateAvatar } = require('../controllers/authController');
const { verifyAdmin, verifyToken } = require('../middlewares/authMiddleware');
const avatarUpload = require('../middlewares/avatarUpload');

// [POST] api/user/login
router.post('/login', loginUser);

// [POST] api/user/register
router.post('/register', registerUser);

// [GET] api/user/
router.get('/', verifyToken, verifyAdmin, getUsers);

// [GET] api/user/:id
router.get('/:id', verifyToken, getUserById);

// [PUT] api/user/:id
router.put('/:id', verifyToken, updateUser);

// [DELETE] api/user/:id
router.delete('/:id', verifyToken, verifyAdmin, deleteUser);

// [POST] api/user/change-password/:id
router.put('/change-password/:id', verifyToken, changePassword);

// [POST] api/user/:id/avatar
router.put("/:id/avatar", verifyToken, avatarUpload.single("avatar"), updateAvatar);

module.exports = router;