const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    senderName: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    senderId: {
        type: String,
        required: true,
    },
    issue: {
        type: String,
        require: false,
    },
    sprint: {
        type: String,
        required: false,
    },
    addDate: {
        type: Date,
        required: true,
        default: Date.now()
    },
    previousComment: {
        type: String,
        required: false,
    },
}); 

module.exports = mongoose.model('comment', commentSchema);