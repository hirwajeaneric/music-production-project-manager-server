const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    description: { 
        type: String, 
        required: [true, 'Description is required'] 
    },
    attachment: {
        type: String,
        required: false,
    },
    amount: { 
        type: Number, 
        required: true, 
    },
    approved: { 
        type: Boolean, 
        required: false,
        default: false, 
    },
    user: { 
        type: String, 
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    project: { 
        type: String, 
        required: true 
    },
    entryDate: { 
        type: Date, 
        required: true,
        default: new Date().toISOString() 
    }
}) 

module.exports = mongoose.model('payment', paymentSchema);