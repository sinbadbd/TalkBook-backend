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

        const { content, images } = req.body

        // if(images.length === 0){
        //     return res.status(400).json({
        //         code: 400,
        //         success: false,
        //         message: "Please add images",
        //     })
        // }

        const newPost = new Posts({
            content, images, user: req.user._id
        })
        await newPost.save()

        console.log("CreatePost:", newPost);

        return res.status(201).send({
            code: 201,
            success: true,
            message: "Created post sucmesscessfully",
            newPost: {
                ...newPost._doc
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
        
        const posts = await Posts.find({ })
            //.select("images")
            // .select("comments")
            // .select("likes")
            .select( "game")
        // .populate({ path: "user", select: "_id" })
    //    .populate({ path: "comments", select: "_id" })
       // .exec();

        res.json({
            code: 200,
            success: true,
            message: "Get posts successfully",
            //page_result: posts.length,
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

module.exports = {
    createPost,
    getPosts
}