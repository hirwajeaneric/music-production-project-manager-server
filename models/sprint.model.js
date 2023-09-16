const mongoose = require('mongoose');

const sprintSchema = new mongoose.Schema({
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
        default: new Date().toISOString()
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
    issue: {
        type: String,
        required: true,
    },
    progress: {
        type: String, 
        required: true,
        enum: {
            values: ["Todo", "In Progress", "Completed"],
            message: '{VALUE} is not supported as a project type.'
        },
        default: "Todo"
    },
    materials: [
        {
            id: {
                type: String,
                required: false,
            },
            name: {
                type: String,
                required: false,
            },
            quantity: {
                type: Number,
                required: false,
            },
            used: {
                type: Number,
                required: false,
            },
            date: {
                type: Date, 
                required: false
            }
        }
    ]
}); 

module.exports = mongoose.model('sprint', sprintSchema);