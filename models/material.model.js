const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Material is required'] 
    },
    picture: {
        type: String,
        required: false,
    },
    description: { 
        type: String, 
        required: false, 
    },
    type: { 
        type: String, 
        required: true, 
    },
    quantity: { 
        type: Number, 
        required: true, 
    },
    assigned: { 
        type: Number, 
        required: true,
        default: 0, 
    },
    used: { 
        type: Number, 
        required: true,
        default: 0, 
    },
    measurementUnit: { 
        type: String, 
        required: true,
        enum: {
            values: ["Piece(s)", "Personnel(s)"],
            message: '{VALUE} is not supported as a measurement unit' 
        }
    },
    unitPrice: { 
        type: Number,
        required: true,
        defaut: 0 
    },
    currency: {
        type: String,
        required: true,
    },
    totalPrice: { 
        type: Number, 
        required: false 
    },
    project: { 
        type: String, 
        required: true 
    },
    entryDate: { 
        type: Date, 
        required: true,
        default: Date.now() 
    }
}) 

module.exports = mongoose.model('material', materialSchema);