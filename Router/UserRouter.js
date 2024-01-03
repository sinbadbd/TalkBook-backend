const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middleware/AuthMiddleware');

const { getUser } = require('../Controller/UserController');

router.get('/user/:id', authMiddleware, getUser);


module.exports = router