const mongoose = require('mongoose');
const Post = require('../Model/Post');
const Comment = require('../Model/Comment');
const User = require('../Model/User');
const validateMongoDbId = require('../Utils/validateMongodbId');


const createComment = async (req, res) => {
    try {
        const { postId, content, tag, reply, postUserId } = req.body
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(400).send({
                code: 400,
                success: false,
                message: "This post does not exist."
            })
        }
        // if (reply) {
        //     const cm = await Comment.findById(reply)
        //     if (!cm) {
        //         return res.status(400).send({
        //             code: 400,
        //             success: false,
        //             message: "This comment does't exist."
        //         })
        //     }
        // }
        const newComment = new Comment({
            user: req.user._id, content, tag, reply, postUserId, postId
        })
        await Post.findOneAndUpdate({ _id: postId }, {
            $push: { comments: newComment._id}
        }, { new: true })
        await newComment.save()

        return res.status(200).send({
            code: 200,
            success: true,
            message: "Success comment"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            code: 500,
            success: false,
            message: "Something went wrong! Please try again!",
            error: error.message
        });
    }
}

module.exports = {
    createComment
}