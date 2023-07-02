import Room from "../models/Room.js"
import RoomType from "../models/RoomType.js"
import { responseHelper } from "../helpers/response.js"
import { body } from "express-validator"

//validate phòng
export const validateRoom = [
    body('roomNumber').notEmpty().withMessage('Số phòng là bắt buộc.'),
    body('roomType').notEmpty().withMessage('Loại phòng là bắt buộc.'),
    body('image_public_id').notEmpty().withMessage('Image public ID là bắt buộc.'),
    body('images').isArray({ min: 1 }).withMessage('Ít nhất một hình ảnh phòng là bắt buộc.'),
]


//thêm phòng
export const createRoom = async (req, res, next) => {
    try {
        const { roomNumber, roomType } = req.body;

        const existingRoom = await Room.findOne({ roomNumber });
        if (existingRoom) {
            return res.status(404).json({
                status: 404,
                message: "Mã phòng đã tồn tại.",
                success: false
            });
        }

        const existingRoomType = await RoomType.findById(roomType);
        if (!existingRoomType) {
            return res.status(404).json({
                status: 404,
                message: "Loại phòng không tồn tại.",
                success: false
            });
        }

        const newRoom = new Room(req.body);
        const saveRoom = await newRoom.save();

        existingRoomType.rooms.push(saveRoom._id);
        await existingRoomType.save();

        return res.status(200).json({
            status: 200,
            message: "Thêm phòng thành công.",
            success: true,
            data: saveRoom
        });
    } catch (error) {
        next(error);
    }
};

export const deleteRoom = async (req, res, next) => {
    try {
        const { id } = req.params;

        const existingRoom = await Room.findById(id);
        if (!existingRoom) {
            return res.status(404).json({
                status: 404,
                message: "Phòng không tồn tại.",
                success: false
            });
        }

        const roomType = existingRoom.roomType;

        await Room.findByIdAndDelete(roomId);

        const roomTypeObject = await RoomType.findById(roomType);
        if (roomTypeObject) {
            roomTypeObject.rooms.pull(roomId);
            await roomTypeObject.save();
        }

        return res.status(200).json({
            status: 200,
            message: "Xóa phòng thành công.",
            success: true
        });
    } catch (error) {
        next(error);
    }
};


export const updateRoom = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedRoom = req.body;
        const roomNumber = updatedRoom.roomNumber;

        if (!roomNumber) {
            return res.status(400).json({
                status: 400,
                message: "Số phòng không được bỏ trống.",
                success: false,
            });
        }

        const existingRoom = await Room.findById(id);
        if (!existingRoom) {
            return res.status(404).json({
                status: 404,
                message: "Phòng không tồn tại.",
                success: false,
            });
        }

        if (roomNumber) {
            existingRoom.roomNumber = roomNumber;
        }
        if (updatedRoom.roomType) {
            const existingRoomType = await RoomType.findById(updatedRoom.roomType);
            if (!existingRoomType) {
                return res.status(404).json({
                    status: 404,
                    message: "Loại phòng không tồn tại.",
                    success: false,
                });
            }
            existingRoom.roomType = updatedRoom.roomType;
        }
        if (updatedRoom.description) {
            existingRoom.description = updatedRoom.description;
        }
        if (updatedRoom.image_public_id) {
            existingRoom.image_public_id = updatedRoom.image_public_id;
        }
        if (updatedRoom.images) {
            existingRoom.images = updatedRoom.images;
        }
        if (updatedRoom.status) {
            existingRoom.status = updatedRoom.status;
        }

        const savedRoom = await existingRoom.save();

        return res.status(200).json({
            status: 200,
            message: "Cập nhật phòng thành công.",
            success: true,
            data: savedRoom,
        });
    } catch (error) {
        next();
    }
};

export const getRoomByRoomNumber = async (req, res, next) => {
    try {
        const { id } = req.params;

        const room = await Room.findOne({ id });
        if (!room) {
            return res.status(404).json({
                status: 404,
                message: "Không tìm thấy phòng.",
                success: false,
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Lấy thông tin phòng thành công.",
            success: true,
            data: room,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllRooms = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 10;
        const skip = (pageNumber - 1) * limitNumber;

        const totalRooms = await Room.countDocuments();
        const totalPages = Math.ceil(totalRooms / limitNumber);

        const rooms = await Room.find()
            .skip(skip)
            .limit(limitNumber)
            .sort({ createdAt: "desc" })
            .populate("roomType");

        return res.status(200).json({
            status: 200,
            message: "Lấy danh sách phòng thành công.",
            success: true,
            data: rooms,
            pagination: {
                currentPage: pageNumber,
                totalPages: totalPages,
                totalItems: totalRooms,
            },
        });
    } catch (error) {
        next(error);
    }
};


export const filterRooms = async (req, res) => {
    const { startDate, endDate, capacity } = req.query;

    try {
        let query = {
            unavailableDates: {
                $not: {
                    $elemMatch: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate),
                    },
                },
            },
        };

        if (capacity) {
            query = {
                ...query,
                capacity: { $gte: parseInt(capacity) },
            };
        }

        const filteredRooms = await Room.find(query);
        const numberFilter = filteredRooms.length;

        return res.json(responseHelper(200, `Đã tìm được ${numberFilter} phòng`, true, filteredRooms));
    } catch (error) {
      
        next(error)
    }
};