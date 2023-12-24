const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middleware/AuthMiddleware');

const {
    createComment,
    getComments,
    updateComment,
    likeComment,
    unlikeComment
} = require('../Controller/CommentController');

router.post('/comment/createComment', authMiddleware, createComment)
router.get('/comment/getComments/:id', authMiddleware, getComments)
router.put('/comment/:id', authMiddleware, updateComment)
router.put('/comment/:id/like', authMiddleware, likeComment)
router.put('/comment/:id/unlike', authMiddleware, unlikeComment)

module.exports = router