import Booking from '../models/Booking.js';
import { responseHelper } from '../helpers/response.js';
import Room from '../models/Room.js';
import Service from '../models/Service.js';


export const createBooking = async (req, res, next) => {
  const {
    room,
    employeeId,
    name,
    email,
    phone,
    checkInDate,
    checkOutDate,
    additionalServices,
    price
  } = req.body;

  try {
    // Kiểm tra xem các phòng có tồn tại và có trạng thái "published" không
    const validRooms = await Room.find({ _id: { $in: room }, status: 'published' });
    if (validRooms.length !== room.length) {
      return res.status(400).json({
        status: 400,
        message: 'Có phòng không tồn tại hoặc không được công bố.',
        success: false
      });
    }

    // Kiểm tra xem các dịch vụ bổ sung có tồn tại không
    const validAdditionalServices = await Service.find({ _id: { $in: additionalServices } });
    // if (validAdditionalServices.length !== additionalServices.length) {
    //   return res.status(400).json({
    //     status: 400,
    //     message: 'Có dịch vụ bổ sung không tồn tại.',
    //     success: false
    //   });
    // }

    // Tạo booking mới
    const booking = new Booking({
      room: room,
      employee: employeeId,
      name,
      email,
      phone,
      checkInDate,
      checkOutDate,
      additionalServices,
      price
    });

    // Lưu booking
    const savedBooking = await booking.save();

    return res.status(201).json({
      status: 201,
      message: 'Booking đã được tạo thành công.',
      success: true,
      data: savedBooking
    });
  } catch (error) {
    next(error);
  }
};