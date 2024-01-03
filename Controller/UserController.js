const User = require('../Model/User');

const getUser = async(req, res) => {
    try {

        const user = await User.findById(req.params.id).select("-password")
            .populate("followers following", "-password")
        
        if (!user) {
            res.status(404).send({
                code: 404,
                success: false,
                message: "failld",
            })
        }

        res.status(200).send({
            code: 200,
            success: true,
            message: "Success",
            user: user
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
    getUser
}