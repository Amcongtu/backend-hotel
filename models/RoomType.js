import mongoose from "mongoose";

const RoomTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
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

    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft',
    },

    // chứa tối da bao nhiêu người
    capacity: {
        type: Number,
        required: true,
    },

    //tiện nghi
    utilities: {
        type: [String],
    },

    // diện tích
    area: {
        type: Number,
    },

    
    image: {
        type: String,
        required:true,
    },
    image_id: {
        type: String,
        required:true,
    },
    rooms: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',
        },
    ],
}, { timestamps: true });


// Xuất model để có thể sử dụng ở nơi khác trong ứng dụng
export default  mongoose.model('RoomType', RoomTypeSchema)