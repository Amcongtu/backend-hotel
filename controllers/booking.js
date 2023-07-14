import Booking from '../models/Booking.js';
import { responseHelper } from '../helpers/response.js';
import Room from '../models/Room.js';
import StatusRoom from '../models/StatusRoom.js';

const addStatusRoom = async(payload) =>
{
  let startDate = payload.checkInDate
  let endDate = payload.checkOutDate
  let room = payload._id
  let employee = payload.employee

  const unAvailableDates = [];
  const currentDate = new Date(startDate);
  const endDateLoop = new Date(endDate);

  const existingRoom = await Room.findById(room);
  if (!existingRoom) {
      return res.status(404).json({
          status: 404,
          message: 'Phòng không tồn tại trong hệ thống.',
          success: false,
          data: [],
      });
  }

  while (currentDate <= endDateLoop) {
      const currentDateCopy = new Date(currentDate);
      unAvailableDates.push(currentDateCopy);
      currentDate.setDate(currentDate.getDate() + 1);
  }

  existingRoom.unavailableDates = [...existingRoom.unavailableDates, ...unAvailableDates];
  await existingRoom.save();
  // Tạo mới trạng thái phòng
  const statusRoom = new StatusRoom({
      room,
      description: "Thêm từ đặt phòng",
      employee,
      startDate,
      endDate
  });
  await statusRoom.save();
}

export const createBooking = async (req, res, next) => {
  const {
    room,
    employeeId,
    name,
    email,
    phone,
    additionalServices,
  } = req.body;

  if (!employeeId)
  {
    employeeId = ""
  }

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

    if (room?.length == 0)
    {
      return res.status(400).json({
        status: 400,
        message: 'Phòng là bắt buộc nhập.',
        success: false
      });
    }


    for (let i = 0; i < room.length ; i++)
    {
      var _room = room[i];
      var existingRoom = await Room.findOne({_id: _room._id});

      if(!existingRoom)
      {
        return res.status(400).json({
          status: 400,
          message: 'Phòng không tồn tại trong hệ thông.',
          success: false
        });
      }
      
      var booking = new Booking({
          room: existingRoom._id,
          employee: employeeId,
          name,
          email,
          phone,
          checkInDate: _room.checkInDate,
          checkOutDate: _room.checkOutDate,
          additionalServices,
          price: existingRoom.price
      });
      await booking.save()
      const data = await addStatusRoom({checkInDate: _room.checkInDate, checkOutDate: _room.checkOutDate, _id: existingRoom._id, employee: employeeId})
      console.log(data)
    }
    // Kiểm tra xem các dịch vụ bổ sung có tồn tại không
    // const validAdditionalServices = await Service.find({ _id: { $in: additionalServices } });
    // if (validAdditionalServices.length !== additionalServices.length) {
    //   return res.status(400).json({
    //     status: 400,
    //     message: 'Có dịch vụ bổ sung không tồn tại.',
    //     success: false
    //   });
    // }



    return res.status(201).json({
      status: 201,
      message: 'Các đặt phòng đã được tạo thành công.',
      success: true,
      data: []
    });
  } catch (error) {
    next(error);
  }
};

// {
//   "room": [
//     "64aeac4e24a49e4656030129"
//   ],
//   "employee": "64847ca674c89b9749e256c1",
//   "name": "John Doe",
//   "email": "johndoe@example.com",
//   "phone": "123456789",
//   "checkInDate": "2023-08-01T00:00:00.000Z",
//   "checkOutDate": "2023-08-05T00:00:00.000Z",
//   "additionalServices": [
//   ],
//   "price": 5000000
// }
