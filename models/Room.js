import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    roomNumber: {
        type: String,
        required: true,
        unique: true,
    },
    roomType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RoomType',
        // required: true,
    },
    description:{
        type: String,
    },
    image_public_id: {
        type: String,
    },

    images: {
        type: String,
    },
    
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft',
    }
}, { timestamps: true });

// Xuất model để có thể sử dụng ở nơi khác trong ứng dụng
export default mongoose.model.Room || mongoose.model('Room', RoomSchema);