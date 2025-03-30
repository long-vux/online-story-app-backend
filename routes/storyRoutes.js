const express = require('express');
const router = express.Router();
const { createStory, getStoriesByCategory } = require('../src/controllers/storyController');

router.post('/', createStory);
router.get('/category/:category_id', getStoriesByCategory);

module.exports = router;