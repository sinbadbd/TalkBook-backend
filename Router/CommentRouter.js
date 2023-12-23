const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middleware/AuthMiddleware');

const { createComment, getComments} = require('../Controller/CommentController');

router.post('/createComment', authMiddleware, createComment)
router.get('/getComments/:id', authMiddleware, getComments)

module.exports = router