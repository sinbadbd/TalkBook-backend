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
   // try {
        // const userId = req.params.id
       //const userId = req.userId;
      // const currentUserPosts = await Posts.find({ userId: userId })

        
        //654464b208a9671957c1672d
        // const userId = req.userId; // Ensure req.user._id is correct
        // const { userId } = req.body
        // console.log("userId:", userId);

   

        // const features = new APIfeatures(Posts.find({
        //     user: [ userId]
        // }), req.query).paginating()

        // // const posts = await Posts.find({})
        // const posts = await features.query.sort('-createdAt')

        //     .populate("user likes", "avatar username fullname followers")
        //     .populate({
        //         path: "comments",
        //         populate: {
        //             path: "user likes",
        //             select: "-password"
        //         }
        //     })
        // console.log("Populated Posts:", posts);
        // console.log("Populated Posts:", features);
        // res.json({
        //     message: 'Success!',
        //     result: posts.length,
        //     posts
        // })


        const userId = req.params.id
    try {
        const currentUserPosts = await Posts.find({ userId: userId })
        const followingPosts = await User.aggregate(

            [

                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(userId),
                    },
                },
                {
                    $lookup: {
                        from: "post",
                        localField: "following",
                        foreignField: "userId",
                        as: "followingPosts",
                    },
                },
                {
                    $project: {
                        followingPosts: 1,
                        _id: 0,
                    },
                },
            ]
        )
        res.status(200).send({
            success: true,
            message: "Post successfully",
            timeLinePosts: currentUserPosts.concat(...followingPosts[0].followingPosts)
                .sort((a, b) => {
                    return b.createdAt - a.createdAt;
                })
        });

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
    getPosts
}