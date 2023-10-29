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
const connectDB = require("./Config/db");

const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(morgan('dev'));

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
 

const port = process.env.PORT || 5000
app.listen(port, () => {
    // console.log('Server is running on port', port).bgBlue.white
    `Server Running in ${process.env.NODE_MODE} Mode on port ${port}`.bgBlue.white
})