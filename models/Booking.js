import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },

    checkInDate: {
        type: Date,
        required: true,
    },
    checkOutDate: {
        type: Date,
        required: true,
    },
    additionalServices: [{
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
        },
    }],
    stage: {
        type: String,
        enum: ['waitConfirm', 'confirmed', 'cancelled',  'notPaidFull', 'paid', 'checkedIn', 'checkedOut'],
        default: 'waitConfirm',
    },
    status:{
        type: String,
        enum: ['notPaidFull', 'paid'],
        default: 'notPaidFull',
    },
    price: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

export default mongoose.model('Booking', BookingSchema);