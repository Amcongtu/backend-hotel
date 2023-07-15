import Booking from '../models/Booking.js';
// import { responseHelper } from '../helpers/response.js';
import Room from '../models/Room.js';
import StatusRoom from '../models/StatusRoom.js';
// import sgMail from '@sendgrid/mail';
import nodemailer from "nodemailer"


// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'phamminhquan12c1@gmail.com',
//     pass: '0763639045'
//   }
// });

const mailConfig = (to, from, subject, text, )=>{
  return {
    to: to,
    from: from, // Use the email address or domain you verified above
    subject: subject,
    text: text,
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  }
}

const addStatusRoom = async(payload) =>
{
  let startDate = payload.checkInDate
  let endDate = payload.checkOutDate
  let room = payload._id

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
      startDate,
      endDate
  });
  await statusRoom.save();
  return 
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
    // console.log(process.env.SENDGRID_API_KEY)
    // await sgMail.setApiKey("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");
    // let testAccount = await nodemailer.createTestAccount()

    let transporter = nodemailer.createTransport({
      host:"smtp.gmail.com",
      port: 587,
            secure: false, // true for 465, false for other ports
            auth:{
              user: "phamminhquan12c1@gmail.com", // generated ethereal user
              pass: "yeyzouxjuswhwcxu" // generated ethereal password
            }
    })


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
       await addStatusRoom({checkInDate: _room.checkInDate, checkOutDate: _room.checkOutDate, _id: existingRoom._id})
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


    try {
      //  await sgMail.send(mailConfig("lebaonhi12c!@gmail.com", email, "XÁC NHẬN ĐẶT PHÒNG TẠI Q&N HOTEL", "ĐẶT PHÒNG THÀNH CÔNG"))
      await transporter.sendMail(mailConfig(email,"phamminhquan12c1@gmail.com", "XÁC NHẬN ĐẶT PHÒNG TẠI Q&N HOTEL", "ĐẶT PHÒNG THÀNH CÔNG"))
    }
    catch(error)
    {
      await transporter.sendMail(mailConfig(email,"phamminhquan12c1@gmail.com", "XÁC NHẬN ĐẶT PHÒNG TẠI Q&N HOTEL", "ĐẶT PHÒNG KHÔNG THÀNH CÔNG, CHÚNG TÔI SẼ HOÀN TIỀN LẠI CHO BẠN TRONG ÍT PHÚT."))
    }
    
    return res.status(201).json({
      status: 201,
      message: 'Các đặt phòng đã được tạo thành công. Email xác nhận đã được gửi về email mà bạn đăng ký.',
      success: true,
      data: []
    });
  } catch (error) {
    await transporter.sendMail(mailConfig(email,"phamminhquan12c1@gmail.com", "ĐẶT PHÒNG THẤT BẠI, TẠI Q&N HOTEL", "ĐẶT PHÒNG KHÔNG THÀNH CÔNG, CHÚNG TÔI SẼ HOÀN TIỀN LẠI CHO BẠN TRONG ÍT PHÚT."))

    return res.status(500).json({
      status: 500,
      message: 'Đặt phòng không thành công, chúng tôi sẽ hoàn tiền cho bạn trước 7 ngày. Cám ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi.',
      success: false,
      data: []
    });
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


export const getAllBooking = async (req, res, next) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: 'desc' }).populate('room').select('-unavailableDates');

    return res.status(200).json({
      status: 200,
      message: 'Lấy danh sách đặt phòng thành công.',
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};


export const updateBooking = async (req, res, next) => {
  const { bookingId } = req.params;
  const {
    room,
    employeeId,
    name,
    email,
    phone,
    additionalServices,
    checkInDate,
    checkOutDate,
    status,
    stage
  } = req.body;

  try {
    // Kiểm tra xem đơn đặt phòng tồn tại hay không
    const existingBooking = await Booking.findById(bookingId);
    if (!existingBooking) {
      return res.status(404).json({
        status: 404,
        message: 'Đơn đặt phòng không tồn tại.',
        success: false,
      });
    }

    // Kiểm tra xem phòng được chọn có tồn tại và có trạng thái "published" không
    const existingRoom = await Room.findOne({
      _id: room,
      status: 'published',
    });
    if (!existingRoom) {
      return res.status(400).json({
        status: 400,
        message: 'Phòng không tồn tại hoặc không được công bố.',
        success: false,
      });
    }

    // Cập nhật thông tin đơn đặt phòng
    existingBooking.status = status;
    existingBooking.stage = stage;
    existingBooking.employee = employeeId;
    existingBooking.name = name;
    existingBooking.email = email;
    existingBooking.phone = phone;
    existingBooking.additionalServices = additionalServices;
    existingBooking.checkInDate = checkInDate;
    existingBooking.checkOutDate = checkOutDate;

    await existingBooking.save();

    // Cập nhật trạng thái phòng
    const existingStatusRoom = await StatusRoom.findOne({ room, startDate: checkInDate, endDate: checkOutDate });
    if (existingStatusRoom) {
      
      if ( stage == "cancelled") {
        existingStatusRoom.status = "cancelled";
      }

      if ( stage == "checkedOut") {
        existingStatusRoom.status = "done";

      }

      existingStatusRoom.description = 'Cập nhật từ đặt phòng';
      existingStatusRoom.employee = employeeId;
      await existingStatusRoom.save();
    }

    return res.status(200).json({
      status: 200,
      message: 'Đơn đặt phòng đã được cập nhật thành công.',
      success: true,
      data: existingBooking,
    });
  } catch (error) {
    next(error);
  }
};