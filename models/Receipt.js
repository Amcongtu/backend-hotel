import mongoose from "mongoose";

const ReceiptSchema = new mongoose.Schema({
    invoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice',
        required: true,
    },
    amountReceived: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export const Receipt = mongoose.model('Receipt', ReceiptSchema);