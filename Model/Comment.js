const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    tag: Object,
    reply: mongoose.Types.ObjectId,
    likes: [{type: mongoose.Types.ObjectId, ref: 'user'}],
    user: {type: mongoose.Types.ObjectId, ref: 'user'},
    postId: mongoose.Types.ObjectId,
    postUserId: mongoose.Types.ObjectId,
    userId: {
        type: mongoose.Types.ObjectId, // Change the type to mongoose.Types.ObjectId
        ref: 'user',
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('comment', commentSchema)