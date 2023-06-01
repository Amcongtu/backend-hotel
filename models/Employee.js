import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
    id: {
        type: Boolean,
        unique: true,
        required: true,

    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    salary: {
        type: Number,
        required: true,
    },
    hireDate: {
        type: Date,
        required: true,
    },
    contact: {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
    },

});

export default mongoose.model.Customer || mongoose.model('Employee', EmployeeSchema);