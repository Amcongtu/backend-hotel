import { body} from "express-validator"
import RoomType from "../models/RoomType.js"


export const validateRoomType = [
    body('name').notEmpty().withMessage('Tên loại phòng không được bỏ trống'),
    body('code').notEmpty().withMessage('Mã loại phòng không được bỏ trống'),
    body('image').notEmpty().withMessage('Hình ảnh loại phòng không được bỏ trống'),
    body('image_id').notEmpty().withMessage('Hình ảnh loại phòng không được bỏ trống'),
    body('price').notEmpty().withMessage('Giá loại phòng không được bỏ trống').isNumeric().withMessage('Giá loại phòng phải là một số'),
    body('capacity').notEmpty().withMessage('Sức chứa không được bỏ trống').isInt({ min: 1 }).withMessage('Sức chứa phải là một số nguyên dương'),
]

export const createRoomType = async (req, res, next) => {
    try {
        const newRoomType = new RoomType(req.body)
        // const roomType = await RoomType.find({})
        const existingRoomType = await RoomType.findOne({ code:req.body.code });
        if (existingRoomType) {
            return res.status(409).json(
                {
                    status: 409,
                    message: "Loại phòng đã tồn tại",
                    success: false,
                    data: [],
                }
                );
            }
            
            const saveRoomType = await newRoomType.save();
            console.log("toie" +saveRoomType)
            
        return res.status(200).json({
            status: 200,
            message: "Thêm loại phòng thành công.",
            success: true,
            data: saveRoomType
        });

    } catch (error) {
        next()
    }
}

export const updateRoomType = async (req, res, next) => {
    try {
        const { code } = req.params;
        const updatedRoomTypeData = req.body;

        // Kiểm tra xem loại phòng có tồn tại hay không
        const existingRoomType = await RoomType.findOne({ code });
        if (!existingRoomType) {
            return res.status(404).json(
                {
                    status: 404,
                    message: "Không tìm thấy loại phòng.",
                    success: false,
                    data: [],
                }
            );
        }

        // Cập nhật thông tin loại phòng
        existingRoomType.set(updatedRoomTypeData);
        const updatedRoomType = await existingRoomType.save();

        return res.status(200).json({
            status: 200,
            message: 'Cập nhật loại phòng thành công.',
            success: true,
            data: updatedRoomType,
        });
    } catch (error) {
        next();
    }
};

export const deleteRoomType = async (req, res, next) => {
    try {
        const { code } = req.params;

        // Kiểm tra xem loại phòng có tồn tại hay không
        const existingRoomType = await RoomType.findOne({ code });
        if (!existingRoomType) {
            return res.status(404).json({
                status: 404,
                message: 'Không tìm thấy loại phòng',
                success: false,
                data: [],
            });
        }

        // Xóa loại phòng
        await existingRoomType.remove();

        return res.status(200).json({
            status: 200,
            message: 'Xóa loại phòng thành công',
            success: true,
            data: [],
        });
    } catch (error) {
        next();
    }
};

export const getAllRoomTypes = async (req, res, next) => {
    try {
      const roomTypes = await RoomType.find().sort({ createdAt: 'desc' }).populate('rooms');
  
      return res.status(200).json({
        status: 200,
        message: 'Lấy danh sách loại phòng thành công',
        success: true,
        data: roomTypes,
      });
    } catch (error) {
      next(error);
    }
  };

export const getRoomType = async (req, res, next) => {
    try {
        const { id } = req.params;

        const roomType = await RoomType.find({status: 'published', _id: id}).populate('rooms');
        if (!roomType) {
            return res.status(404).json({
                status: 404,
                message: "Loại phòng không tồn tại.",
                success: false
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Lấy thông tin loại phòng thành công.",
            success: true,
            data: roomType
        });
    } catch (error) {
        next();
    }
};


export const getRoomTypePublish = async (req, res, next) => {
    try {
        const roomTypes = await RoomType.find({status: 'published'})
            .sort({ createdAt: "desc" })
            .populate('rooms');
  
        return res.status(200).json({
                status: 200,
                message: 'Lấy danh sách loại phòng thành công',
                success: true,
                data: roomTypes,
        });
    } catch (error) {
        next();
    }
};
