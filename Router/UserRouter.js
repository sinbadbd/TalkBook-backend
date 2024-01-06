const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middleware/AuthMiddleware');

const { getUser, updateUser } = require('../Controller/UserController');

router.get('/user/:id', authMiddleware, getUser);
router.put('/user', authMiddleware, updateUser);


module.exports = router