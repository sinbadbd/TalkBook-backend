const User = require('../Model/User');

const getUser = (req, res) => {
    try {

        console.log("Loading")
        
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