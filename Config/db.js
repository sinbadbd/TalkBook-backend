const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGODB_URL, {
            useCreateIndex: true,
            useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, err => {
            if (err) throw err;
            console.log('Connected to mongodb'.bgGreen.black)
            console.log(`Mongodb connected ${mongoose.connection.host}`.bgGreen.black);
        })
    } catch (error) {
        console.log(`Mongodb Server Issue ${error}`.bgRed.white);
    }
};

module.exports = connectDB;
