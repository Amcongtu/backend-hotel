import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },

    image: [{
        type: String,
        required: true,
    }],

    
    image_id: [{
        type: String,
        required: true,
    }],
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
}, { timestamps: true });

export default mongoose.model('Service', ServiceSchema);