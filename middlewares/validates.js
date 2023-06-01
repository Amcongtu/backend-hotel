import { validationResult } from 'express-validator';

const validateMidleware = (req, res, next) => {
    // Kiểm tra validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(
            {
                status: 400,
                message: errors.array(),
                success: false,
                data: [],
            }
        );
    }
    next();
};

export default validateMidleware