import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
    idEmployee: {
        type: String,
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
    status:{
        type: String,
        enum: ['active', 'inActive'],
        default: 'active',
    }

});

export default mongoose.model.Employee || mongoose.model('Employee', EmployeeSchema);