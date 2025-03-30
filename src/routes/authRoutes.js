const express = require('express');
const router = express.Router();
const {loginUser, registerUser, getUsers } = require('../controllers/authController');

// [POST] api/user/login
router.post('/login', loginUser);

// [POST] api/user/register
router.post('/register', registerUser);
router.get('/', getUsers);

module.exports = router;