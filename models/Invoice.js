import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    employee:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    
    paymentStatus: {
        type: String,
        enum: ['paid', 'unpaid'],
        default: 'unpaid',
    },
}, { timestamps: true });

export const Invoice = mongoose.model('Invoice', InvoiceSchema);