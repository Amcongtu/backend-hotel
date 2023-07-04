import Booking from '../models/Booking.js';
import { responseHelper } from '../helpers/response.js';


export const addBooking = async (req, res, next) => {
  const {
    room,
    customer,
    employee,
    checkInDate,
    checkOutDate,
    additionalServices,
    price,
  } = req.body;

  try {
    const booking = new Booking({
      room,
      customer,
      employee,
      checkInDate,
      checkOutDate,
      additionalServices,
      price,
    });

    await booking.save();

    return res.json(responseHelper(200, 'Đặt phòng thành công', true, booking));
  } catch (error) {
    next(error);
  }
};