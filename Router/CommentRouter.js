const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middleware/AuthMiddleware');

const { createComment} = require('../Controller/CommentController');

router.post('/createComment', authMiddleware, createComment)

module.exports = router