const Users = require('../Model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('email-validator');

const register = async (req, res) => {
    try {
        const errors = {};

        const { fullname, username, email, password, gender } = req.body
        let newUserName = username.toLowerCase().replace(/ /g, '');
        const user_name = await Users.findOne({ username: newUserName });


        let user_email = await Users.findOne({ email });

        const isValidEmail = validator.validate(email);

        if (user_name) {
            return res.status(400).send({
                code: 400,
                success: false,
                message: "This username already registered"
            })
        }
        if (user_email) {
            return res.status(400).send({
                code: 400,
                success: false,
                message: "This email already registered"
            })
        }

        if (!username || username.trim() === "" || username.length < 6) {
            errors.username = "Username is required must be at least 6 characters";
        }

        if (!password || password.trim() === "" || password.length < 6) {
            errors.password = "Password is required and must be at least 6 characters";
        }

        if (!fullname || fullname.trim() === "") {
            errors.fullname = "Fullname is required";
        }

        if (!isValidEmail) {
            errors.email = "Valid email is required";
        }

        if (!gender || gender.trim() === "") {
            errors.gender = "Gender is required";
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).send({
                code: 400,
                success: false,
                errors,
            });
        }



        const salt = await bcrypt.genSalt(12);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = await Users({
            fullname, username: newUserName, email, password: hashPassword, gender
        })

        const access_token = createAccessToken({ id: newUser._id })
        const refresh_token = createRefreshToken({ id: newUser._id })

        res.cookie('refreshtoken', refresh_token, {
            httpOnly: true,
            path: '/api/refresh_token',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30days
        })
        await newUser.save()
        res.status(200).send({
            code: 200,
            success: true,
            message: "Register succcess!",
            access_token,
            user: {
                ...newUser._doc,
                password: ''
            }
        })

    } catch (error) {
        return res.status(500).send({
            code: 400,
            success: false,
            message: "Server not responding",
            error: error.message
        });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await Users.findOne({ email })
        //.populate("followers following", "avatar username fullname followers following")

        if (!user) {
            return res.status(400).send({
                code: 400,
                success: false,
                message: "This email does not exist.",
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).send({
                code: 400,
                success: false,
                message: "Password is incorrect.",
            })
        }
        const access_token = createAccessToken({ id: user._id })
        const refresh_token = createRefreshToken({ id: user._id })

        res.cookie('refreshtoken', refresh_token, {
            httpOnly: true,
            path: '/api/refresh_token',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30days
        })

        return res.status(200).send({
            code: 200,
            success: true,
            message: "Login successful",
            access_token,
            user: {
                ...user._doc,
                password: ''
            }
        })
    } catch (error) {
        return res.status(500).send({
            code: 400,
            success: false,
            message: "Something went wrong! Please try again!",
            error: error.message
        });
    }
}
const logout = async (req, res) => {
    try {
        res.clearCookie('refreshtoken', { path: '/api/refresh_token' })
        return res.status(200).send({
            code: 200,
            success: true,
            message: "Login successfull",
        });
    } catch (error) {
        return res.status(500).send({
            code: 500,
            success: false,
            message: "Something went wrong! Please try again!",
            error: error.message
        });
    }
}
const generateAccessToken = async (req, res) => { }


const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
}
const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' })
}

module.exports = {
    register,
    login,
    logout,
    generateAccessToken
}