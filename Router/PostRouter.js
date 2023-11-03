const express = require('express');
const router = express.Router();
const { createPost, getPosts } = require('../Controller/PostController');
const authMiddleware = require('../Middleware/AuthMiddleware');

router.post('/createPost', authMiddleware, createPost);
router.get('/getPosts', authMiddleware, getPosts);

module.exports = router