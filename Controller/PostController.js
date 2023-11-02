const Posts = require('../Model/Post');

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
            content, images//, user: req.user._id
        })
        await newPost.save()

        console.log("CreatePost:", newPost);

        return res.status(201).send({
            code: 201,
            success: true,
            message: "Created post successfully",
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

module.exports = { createPost }