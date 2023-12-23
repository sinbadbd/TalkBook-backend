const mongoose = require('mongoose');
const Posts = require('../Model/Post');
const Comment = require('../Model/Comment');
const User = require('../Model/User');
const validateMongoDbId = require('../Utils/validateMongodbId');

class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    paginating() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 20
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const createPost = async (req, res) => {
    try {

        const { postContent, images, userId } = req.body

        const errors = {};

        if (!postContent || postContent.trim() === "") {
            errors.content = "content is required";
        }

        if (!userId) {
            errors.content = "userId is required";
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).send({
                code: 400,
                success: false,
                message: "Validation failed",
                errors,
            });
        }

        console.log("req.user:", req.user);

        const newPost = new Posts({
            postContent,
            images,
            user: userId
        });

        await newPost.save()

        console.log("CreatePost:", newPost);

        return res.status(201).send({
            code: 201,
            success: true,
            message: "Created post sucmesscessfully",
            newPost: {
                ...newPost._doc,
                //user: req.user
            }
        })

    } catch (error) {
        console.error("Error in createPost:", error);
        return res.status(500).send({
            code: 500,
            success: false,
            message: "Something went wrong! Please try again!",
            error: error.message
        })
    }
}

const getPosts = async (req, res) => {
    try {

        const features = new APIfeatures(Posts.find({
            user: [...req.user.following ?? [], req.user._id]
        }), req.query).paginating()

        const posts = await Posts.find({})
            .sort("-createdAt")
            // const posts = await features.query.sort('-createdAt') // Need to fixed 
            .populate("user likes", "avatar username fullname followers")
            .populate({
                path: "comment",
                populate: {
                    path: "user likes",
                    select: "-password"
                }
            })
        res.json({
            success: true,
            message: 'Success!',
            result: posts.length,
            posts
        })

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            code: 500,
            success: false,
            message: "Something went wrong! Please try again!",
            error: error.message
        })
    }
}

const updatePost = async (req, res) => {
    try {
        const { postContent, images } = req.body
        const posts = await Posts.findOneAndUpdate({ _id: req.params.id }, {
            postContent, images
        })
            .populate("user likes", "avatar username fullname")
            .populate({
                path: "comment",
                populate: {
                    path: "user likes",
                    select: "-password"
                }
            })
        console.log("posts-upate", posts)
        res.json({
            code: 200,
            success: true,
            message: "Updated Post!",
            posts: {
                ...posts._doc,
                postContent, images
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            code: 500,
            success: false,
            message: "Something went wrong! Please try again!",
            error: error.message
        })
    }
}

const likePost = async (req, res) => {
    try {
        const { userId } = req.body;
        validateMongoDbId(userId);
    
        const post = await Posts.findOne({ _id: req.params.id, 'likes.userId': userId });
    
        if (post) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "You already liked this post."
            });
        }
    
        // Update the post to add the user's like
        const updatedPost = await Posts.findOneAndUpdate(
            { _id: req.params.id },
            {
                $push: { likes: { userId: userId, liked: true } },
            },
            { new: true }
        );
    
        if (!updatedPost) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This post does not exist.'
            });
        }
    
        console.log("updatedPost:", updatedPost);
        res.json({
            code: 200,
            success: true,
            message: "You liked this post.",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            code: 500,
            success: false,
            message: "Something went wrong! Please try again!",
            error: error.message
        });
    }
    
};


const unLikePost = async (req, res) => {
    try {


         const { userId } = req.body
         validateMongoDbId(userId)

        // const post = await Posts.findOne({ _id: req.params.id });

        // console.log("post:", post);
        // if (post) {
        //     return res.status(400).json({
        //         code: 400,
        //         success: false,
        //         message: "You already Unliked this post."
        //     });
        // }

        // Update the post to add the user's like
        const updatedPost = await Posts.findOneAndUpdate(
            { _id: req.params.id },
            {
                $pull: { likes: userId },
                $set: { liked: false}
                // $push: { likes: { user: userId, liked: true } },
            },
            { new: true }
        )

        if (!updatedPost) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This post does not exist.'
            });
        }
        console.log("updatedPost:", updatedPost);

        res.json({
            code: 200,
            success: true,
            message: "You Unliked this post.",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            code: 500,
            success: false,
            message: "Something went wrong! Please try again!",
            error: error.message
        });
    }
};

const toggleLikePost = async (req, res) => {
    try {
        const { userId } = req.body;
        validateMongoDbId(userId);

        const post = await Posts.findOne({ _id: req.params.id, 'likes.user': userId });

        if (post) {
            // User has already liked the post, so unliking it
            const updatedPost = await Posts.findOneAndUpdate(
                { _id: req.params.id },
                {
                    $push: { likes: { user: userId, liked: true } },
                    //$set: { liked: false },
                },
                { new: true }
            );

            if (!updatedPost) {
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'This post does not exist.'
                });
            }

            console.log("updatedPost:", updatedPost);

            res.json({
                code: 200,
                success: true,
                message: "You unliked this post.",
            });
        } else {
            // User has not liked the post, so liking it
            const updatedPost = await Posts.findOneAndUpdate(
                { _id: req.params.id },
                {
                    $push: { likes: { userId: userId, liked: true } },
                    //$set: { liked: true },
                },
                { new: true }
            );

            if (!updatedPost) {
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'This post does not exist.'
                });
            }

            console.log("updatedPost:", updatedPost);

            res.json({
                code: 200,
                success: true,
                message: "You liked this post.",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            code: 500,
            success: false,
            message: "Something went wrong! Please try again!",
            error: error.message
        });
    }
};

const getPost = async (req, res) => { 
    try {
        const post = await Posts.findById(req.params.id)
        .populate("user likes", "avatar username fullname followers")
        .populate({
            path: "comment",
            populate: {
                path: "user likes",
                select: "-password"
            }
        })

        if (!post) {
            return res.status(400).json({ 
                code: 400,
                success: false,
                message: 'This post does not exist.'
            })
        }

        res.json({
            code: 200,
            success: true,
            message: "Success",
            post
            
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
    createPost,
    getPosts,
    updatePost,
    likePost,
    unLikePost,
    toggleLikePost,
    getPost
}