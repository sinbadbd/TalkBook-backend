const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    postContent: String,
    images: {
        type: Array,
        required: true
    },
    likes: [{
        userId: { type: mongoose.Types.ObjectId, ref: 'user' },
        liked: { type: Boolean, default: false }
    }],
    liked: { type: Boolean, default: false },
    comments: [{ type: mongoose.Types.ObjectId, ref: 'comment' }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    userId: {
        type: String,
        ref: 'user',
        require: true
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('post', postSchema)