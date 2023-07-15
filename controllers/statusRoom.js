import { body } from 'express-validator';
import StatusRoom from "../models/StatusRoom.js"
import Employee from "../models/Employee.js"
import Room from "../models/Room.js"
export const validateStatusRoom = [
    body('room').notEmpty().withMessage('Phòng không được bỏ trống'),
    body('description').optional().notEmpty().withMessage('Mô tả không được bỏ trống'),
    body('customer').optional().notEmpty().withMessage('Khách hàng không được bỏ trống'),
    body('employee').optional().notEmpty().withMessage('Nhân viên không được bỏ trống'),
    body('unAvailableDates')
        .notEmpty().withMessage('Danh sách ngày không khả dụng không được bỏ trống')
        .isArray({ min: 1 }).withMessage('Danh sách ngày không khả dụng, phải là một mảng có ít nhất một phần tử'),
    body('status').notEmpty().withMessage('Trạng thái không được bỏ trống').isIn(['pending', 'confirmed', 'cancelled', 'maintenance'])
        .withMessage('Trạng thái không hợp lệ'),
];

export const createStatusRoom = async (req, res, next) => {
    try {
        const { room, description, employee, startDate, endDate, status } = req.body;
        // Kiểm tra phòng có tồn tại trong hệ thống
        const existingRoom = await Room.findById(room);
        if (!existingRoom) {
            return res.status(404).json({
                status: 404,
                message: 'Phòng không tồn tại trong hệ thống.',
                success: false,
                data: [],
            });
        }

        // Kiểm tra nhân viên có tồn tại trong hệ thống
        // const existingEmployee = await Employee.findById(employee);
        // if (!existingEmployee) {
        //     return res.status(404).json({
        //         status: 404,
        //         message: 'Nhân viên không tồn tại trong hệ thống.',
        //         success: false,
        //         data: [],
        //     });
        // }

        const unAvailableDates = [];
        const currentDate = new Date(startDate);
        const endDateLoop = new Date(endDate);

        while (currentDate <= endDateLoop) {
            const currentDateCopy = new Date(currentDate);
            unAvailableDates.push(currentDateCopy);
            currentDate.setDate(currentDate.getDate() + 1);
        }


        // Thêm các ngày không khả dụng vào bảng Room
        existingRoom.unavailableDates = [...existingRoom.unavailableDates, ...unAvailableDates];
        await existingRoom.save();
        // Tạo mới trạng thái phòng
        const newStatusRoom = new StatusRoom({
            room,
            description,
            employee,
            unAvailableDates,
            status,
            startDate,
            endDate
        });

        // Lưu trạng thái phòng vào cơ sở dữ liệu
        const savedStatusRoom = await newStatusRoom.save();

        return res.status(200).json({
            status: 200,
            message: 'Thêm trạng thái phòng thành công.',
            success: true,
            data: savedStatusRoom,
        });
    } catch (error) {
        next();
    }
};

export const updateStatusRoom = async (req, res, next) => {
    try {
        const { statusRoomId } = req.params;
        const { room, description, customer, employee, unAvailableDates, status } = req.body;

        const existingStatusRoom = await StatusRoom.findById(statusRoomId);
        if (!existingStatusRoom) {
            return res.status(404).json({
                status: 404,
                message: "Trạng thái phòng không tồn tại.",
                success: false,
                data: [],
            });
        }

        if (room) {
            existingStatusRoom.room = room;
        }
        if (description) {
            existingStatusRoom.description = description;
        }
        if (customer) {
            existingStatusRoom.customer = customer;
        }
        if (employee) {
            const existingEmployee = await Employee.findById(employee);
            if (!existingEmployee) {
                return res.status(404).json({
                    status: 404,
                    message: 'Nhân viên không tồn tại trong hệ thống.',
                    success: false,
                    data: [],
                });
            }
            existingStatusRoom.employee = employee;
        }
        if (unAvailableDates) {
            existingStatusRoom.unAvailableDates = unAvailableDates;
        }
        if (status) {
            existingStatusRoom.status = status;
        }

        const updatedStatusRoom = await existingStatusRoom.save();

        res.status(200).json({
            status: 200,
            message: "Cập nhật trạng thái phòng thành công.",
            success: true,
            data: updatedStatusRoom,
        });
    } catch (error) {
        next(error);
    }
};


export const deleteStatusRoom = async (req, res, next) => {
    try {
        const { statusRoomId } = req.params;

        const existingStatusRoom = await StatusRoom.findById(statusRoomId);
        if (!existingStatusRoom) {
            return res.status(404).json({
                status: 404,
                message: "Trạng thái phòng không tồn tại.",
                success: false,
                data: [],
            });
        }

        await existingStatusRoom.remove();

        res.status(200).json({
            status: 200,
            message: "Xóa trạng thái phòng thành công.",
            success: true,
            data: [],
        });
    } catch (error) {
        next(error);
    }
};

export const getStatusRoom = async (req, res, next) => {
    try {
        const { statusRoomId } = req.params;

        const statusRoom = await StatusRoom.findById(statusRoomId);

        if (!statusRoom) {
            return res.status(404).json({
                status: 404,
                message: "Trạng thái phòng không tồn tại.",
                success: false,
                data: [],
            });
        }

        res.status(200).json({
            status: 200,
            message: "Lấy trạng thái phòng thành công.",
            success: true,
            data: statusRoom,
        });
    } catch (error) {
        next(error);
    }
};


export const getAllStatusRooms = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 10;
        const skip = (pageNumber - 1) * limitNumber;

        const totalStatusRooms = await StatusRoom.countDocuments();
        const totalPages = Math.ceil(totalStatusRooms / limitNumber);

        const statusRooms = await StatusRoom.find()
            .skip(skip)
            .limit(limitNumber)
            .sort({ createdAt: "desc" });

        res.status(200).json({
            status: 200,
            message: "Lấy danh sách trạng thái phòng thành công.",
            success: true,
            data: statusRooms,
            pagination: {
                currentPage: pageNumber,
                totalPages: totalPages,
                totalItems: totalStatusRooms,
            },
        });
    } catch (error) {
        next(error);
    }
};
