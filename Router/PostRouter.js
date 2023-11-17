const express = require('express');
const router = express.Router();
const {
    createPost,
    getPosts,
    updatePost,
    likePost,
    unLikePost,
    toggleLikePost,
    getPost
} = require('../Controller/PostController');
const authMiddleware = require('../Middleware/AuthMiddleware');

router.post('/post/createPost', authMiddleware, createPost);
router.get('/post/getPosts', authMiddleware, getPosts);
router.put('/post/:id', authMiddleware, updatePost);
router.put('/post/:id/like', authMiddleware, likePost);
router.put('/post/:id/unlike', authMiddleware, unLikePost);
router.put('/post/:id/toggleLikePost', authMiddleware, toggleLikePost);
router.get('/post/:id', authMiddleware, getPost);
module.exports = router

//:id/like
//unLikePost