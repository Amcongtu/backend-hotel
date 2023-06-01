import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
    id:{
        type: Number,
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
}, { timestamps: true });

export default mongoose.model('Role', RoleSchema);