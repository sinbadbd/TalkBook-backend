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
        /*
        if (reply) {
            const cm = await Comment.findById(reply)
            if (!cm) {
                return res.status(400).send({
                    code: 400,
                    success: false,
                    message: "This comment does't exist."
                })
            }
        }*/
        const newComment = new Comment({
            user: req.user._id, content, tag, reply, postUserId, postId
        })
        await Post.findOneAndUpdate({ _id: postId }, {
            $push: { comments: newComment._id }
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

const getComments = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("user", "avatar username");

        if (!post) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This post does not exist.'
            });
        }

        // Assuming Comment is the model for comments
        const comments = await Comment.find({ postId: req.params.id })
            .populate("user", "avatar username");

        // Fetch user details for each comment based on postUserId
        const enrichedComments = await Promise.all(comments.map(async comment => {
            const user = await User.findById(comment.postUserId)
                .select("avatar username fullname");
            return {
                ...comment.toObject(),
                user: user ? user.toObject() : null,
            };
        }));

        return res.status(200).json({
            success: true,
            message: "Comments retrieved successfully.",
            comments: enrichedComments,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            success: false,
            message: "Something went wrong! Please try again!",
            error: error.message,
        });
    }
};

const updateComment = async (req, res) => {
    try {
        const { content } = req.body
        await Comment.findOneAndUpdate({
            _id: req.params.id, user: req.user._id,
        }, { content })
        return res.status(200).json({
            success: true,
            message: "Comment  Updated Successfully",
            // comments: comments,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            code: 500,
            success: false,
            message: "Something went wrong! Please try again!",
            error: error.message,
        });
    }
}

const likeComment = async (req, res) => {
    try {
        const { userId } = req.body

        const comment = await Comment.findOne({ _id: req.params.id, likes: userId })

        if (comment) {
            return res.status(400).json({
                success: false,
                message: "You already liked this comment",
            });
        }
        await Comment.findOneAndUpdate({ _id: req.params.id }, {
            $push: { likes: userId }
        }, { new: true })

        return res.status(200).json({
            success: true,
            message: "Like comment successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            code: 500,
            success: false,
            message: "Something went wrong! Please try again!",
            error: error.message,
        });
    }
}

const unlikeComment = async (req, res) => {
    try {
        const { userId } = req.body

        // const comment = await Comment.findOne({ _id: req.params.id, likes: userId })

        // if (comment) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "You already liked this comment",
        //     });
        // }
        await Comment.findOneAndUpdate({ _id: req.params.id }, {
            $pull: { likes: userId }
        }, { new: true })

        return res.status(200).json({
            success: true,
            message: "UnLike comment successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            code: 500,
            success: false,
            message: "Something went wrong! Please try again!",
            error: error.message,
        });
    }
}

module.exports = {
    createComment,
    getComments,
    updateComment,
    likeComment,
    unlikeComment
}