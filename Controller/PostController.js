const mongoose = require('mongoose');
const Posts = require('../Model/Post');
const Comment = require('../Model/Comment');
const User = require('../Model/User');

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
            postContent.content = "content is required";
        }

        if (!userId || userId.trim() === "") {
            userId.content = "userId is required";
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
            // const posts = await features.query.sort('-createdAt') // Need to fixed 
            .populate("user likes", "avatar username fullname followers")
            .populate({
                path: "comments",
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
        const post = await Posts.findOneAndUpdate({ _id: req.params.id }, {
            postContent, images 
        }).populate("user likes", "avatar username fullname")
        .populate({
            path: "comments",
            populate: {
                path: "user likes",
                select: "-password"
            }
        })

        res.json({
            code: 200,
            success: true,
            message: "Updated Post!",
            newPost: {
                ...post,
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

module.exports = {
    createPost,
    getPosts,
    updatePost
}