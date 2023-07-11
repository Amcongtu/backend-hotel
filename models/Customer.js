import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
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
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: ""
  },
  image_id: {
    type: String,
    default: ""
  },
  
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    default:"male"
  },
  dateOfBirth: {
    type: Date,
    default:Date.now()
  },
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
  ],
}, { timestamps: true });

export default mongoose.model.Customer ||  mongoose.model('Customer', CustomerSchema);