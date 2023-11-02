const Users = require('../Model/User');
const JWT = require('jsonwebtoken')

const authMiddleware = async (req, res, next) => {

    try {
        const token = req.headers["authorization"].split(" ")[1];
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decode) => {
            if (error) {
                return res.status(400).send({
                    code: 400,
                    message: "Authorization Fialed",
                    success: false,
                });
            } else {
                // req.body.userId = decode.id;
                // next();
                const user = Users.findOne({ _id: decode.id })
                req.user = user
                next()
            }
        });
    } catch (error) {
        console.log(error);
        res.status(401).send({
            message: "Authorization Fialed",
            success: false,
        });
    }
}

module.exports = authMiddleware

