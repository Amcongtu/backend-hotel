import { body } from 'express-validator';
import Customer from '../models/Customer.js';
import bcrypt from 'bcryptjs';
import { responseHelper } from '../helpers/response.js';
import jwt from 'jsonwebtoken';

export const validateRegister = [
    body('username').notEmpty().withMessage('Tên đăng nhập không được bỏ trống'),
    body('password').notEmpty().withMessage('Mật khẩu không được bỏ trống'),
    body('name').notEmpty().withMessage('Tên không được bỏ trống'),
    body('email').notEmpty().withMessage('Email không được bỏ trống').isEmail().withMessage('Email không hợp lệ'),
    body('phone').notEmpty().withMessage('Số điện thoại không được bỏ trống'),
];

export const validateLogin = [
    body('username').notEmpty().withMessage('Tên đăng nhập không được bỏ trống'),
    body('password').notEmpty().withMessage('Mật khẩu không được bỏ trống'),
];


export const registerCustomer = async (req, res, next) => {

    const { username, password, name, email, phone, gender, dateOfBirth } = req.body;

    try {
        // Check if username or email already exists
        const existingCustomer = await Customer.findOne().or([{ username }, { email }]);
        if (existingCustomer) {
            return res.status(400).json({ message: 'Tên đăng nhập hoặc email đã tồn tại.' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new customer
        const newCustomer = new Customer({
            username,
            password: hashedPassword,
            name,
            email,
            phone,
            gender,
            dateOfBirth,
        });

        // Save the customer to the database
        await newCustomer.save();

        res.status(200).json(responseHelper(200, "Taọ tài khoản thành công."));
    } catch (error) {
        next()
    }
}




export const loginCustomer = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        // // Tìm kiếm khách hàng theo tên đăng nhập
        const user = await Customer.findOne({ username });

        // // Kiểm tra xem người dùng có tồn tại hay không
        if (!user) {
            return res.status(404).json(responseHelper(404, "Tài khoản không tồn tại tỏng hệ thống", false, []));
        }

        // // Kiểm tra mật khẩu
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json(responseHelper(400, "Sai tên đăng nhập hoặc mật khẩu.", false, []));
        }

        // // Tạo token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET
        );

        // Gửi token và thông tin khách hàng về client
        return res.status(200).json(responseHelper(200, "Đăng nhập thành công.", true, {
            token,
            user: {
                _id: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                phone: user.phone,
                gender: user.gender,
                dateOfBirth: user.dateOfBirth,
            }
        }));
    } catch (error) {
        next();
    }
};

