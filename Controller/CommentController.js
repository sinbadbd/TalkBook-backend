const mongoose = require('mongoose');
const Posts = require('../Model/Post');
const Comment = require('../Model/Comment');
const User = require('../Model/User');
const validateMongoDbId = require('../Utils/validateMongodbId');


const createComment = async (req, res) => {
    
}

module.exports = {
    createComment
}