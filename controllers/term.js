import { body } from 'express-validator';
import Term from '../models/Term.js';

export const validateTerm = [
    body('title').notEmpty().withMessage('Tiêu đề là bắt buộc.'),
    body('content').notEmpty().withMessage('Nội dung là bắt buộc.'),
];


// Route POST /terms
// Thêm một điều khoản mới
export const createTerm = async (req, res, next) => {
    try {
        const { title, content } = req.body;

        // Kiểm tra xem điều khoản đã tồn tại hay chưa
        const existingTerm = await Term.findOne({ title });
        if (existingTerm) {
            return res.status(409).json({
                status: 409,
                success: false,
                message: 'Điều khoản đã tồn tại.',
                data: []
            });
        }

        // Tạo một điều khoản mới
        const newTerm = new Term({
            title,
            content,
        });

        // Lưu điều khoản vào cơ sở dữ liệu
        const savedTerm = await newTerm.save();

        res.status(200).json({
            status: 409,
            success: true,
            message: 'Điều khoản đã được thêm thành công.',
            data: savedTerm,
        });
    } catch (error) {
        next();
    }
}

export const deleteTerm = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Tìm và xóa điều khoản
        const deletedTerm = await Term.findByIdAndRemove(id);

        if (!deletedTerm) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'Không tìm thấy điều khoản.',
                data: []
            });
        }

        return res.status(200).json({
            status: 200,
            success: true,
            message: 'Điều khoản đã được xóa thành công.',
            data: deletedTerm,
        });
    } catch (error) {
        next();
    }
}

export const updateTerm = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        // Tìm và cập nhật điều khoản
        const updatedTerm = await Term.findByIdAndUpdate(
            id,
            { title, content },
            { new: true }
        );

        if (!updatedTerm) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy điều khoản.',
            });
        }

        return res.status(200).json({
            status: 200,
            success: true,
            message: "Điều khoản đã được cập nhật thành công",
            data: updatedTerm
        })
    } catch (err) {
        next()
    }
}