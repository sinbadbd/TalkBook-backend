const express = require('express');
const router = express.Router();
const { createPost, getPosts, updatePost } = require('../Controller/PostController');
const authMiddleware = require('../Middleware/AuthMiddleware');

router.post('/createPost', authMiddleware, createPost);
router.get('/getPosts', authMiddleware, getPosts);
router.put('/updatePost', authMiddleware, updatePost);

module.exports = router