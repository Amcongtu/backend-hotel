import mongoose from "mongoose";

const StatusRoomSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    description: {
        type: String,
        default: "No destination."
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
    },

    startDate: {
        required: true,
        type: Date,
    },

    endDate: {
        required: true,
        type: Date,
    },

    unAvailableDates: [
        {
            type: Date,
            required: true,
        }
    ],
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled',"maintenance"],
        default: 'pending',
    }
}, { timestamps: true });

// Xuất model để có thể sử dụng ở nơi khác trong ứng dụng
export default mongoose.model.StatusRoom || mongoose.model('StatusRoom', StatusRoomSchema);