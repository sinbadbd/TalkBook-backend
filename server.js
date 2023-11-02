const dotenv = require("dotenv");
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
//const SocketServer = require('./socketServer')
//const { ExpressPeerServer } = require('peer')
const path = require('path')
const morgan = require("morgan");
const colors = require("colors");
var bodyParser = require('body-parser')
const connectDB = require("./Config/db");

const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));

//dotenv conig
dotenv.config();

//mongodb connection
connectDB();


// Socket
/*
const http = require('http').createServer(app)
const io = require('socket.io')(http)
io.on('connection', socket => {
    SocketServer(socket)
})
// Create peer server
ExpressPeerServer(http, { path: '/' })
*/
 
// Router 
const AuthRouter = require("./Router/AuthRouter");
const PostRouter = require("./Router/PostRouter");

app.use('/api/auth', AuthRouter);
app.use('/api/post', PostRouter);

const port = process.env.PORT || 2000
app.listen(port, () => {
    const bgPort = port.bgRed
    const mode = process.env.NODE_MODE_DEV.magenta
    console.log(`Server Running in ${mode} Mode on port: ${bgPort}`.bgBlue)
})