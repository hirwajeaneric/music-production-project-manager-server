const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    number: {
        type: Number,
        require: true,
    },
    creationDate: {
        type: Date,
        required: true,
        default: Date.now()
    },
    startDate: {
        type: Date,
        required: false,
    },
    endDate: {
        type: Date,
        required: false,
    },
    duration: {
        type: String, 
        required: false,
    },
    project: {
        type: String,
        required: true,
    },
    materials: [
        {
            materialId: { type: String },
            quantity: { type: Number }      
        }
    ],
    progress: {
        type: String, 
        required: true,
        enum: {
            values: ["Todo", "In Progress", "Completed"],
            message: '{VALUE} is not supported as a project type.'
        },
        default: "Todo"
    }
}); 

module.exports = mongoose.model('issue', issueSchema);