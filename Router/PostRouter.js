const express = require('express');
const router = express.Router();
const { createPost } = require('../Controller/PostController');
const authMiddleware = require('../Middleware/AuthMiddleware');

router.post('/createPost', authMiddleware, createPost);

module.exports = router