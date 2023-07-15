import { body } from "express-validator";
import Employee from "../models/Employee.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { getPosition } from "../middlewares/auth.js";

export const validateEmployee = [
    body("idEmployee").notEmpty().withMessage("ID nhân viên không được bỏ trống"),
    body("username").notEmpty().withMessage("Tên đăng nhập không được bỏ trống"),
    body("password").notEmpty().withMessage("Mật khẩu không được bỏ trống"),
    body("name").notEmpty().withMessage("Tên nhân viên không được bỏ trống"),
    body("position").notEmpty().withMessage("Vị trí không được bỏ trống"),
    body("department").notEmpty().withMessage("Bộ phận không được bỏ trống"),
    body("salary").notEmpty().withMessage("Lương không được bỏ trống"),
    body("hireDate")
        .notEmpty()
        .withMessage("Ngày tuyển dụng không được bỏ trống")
        .isISO8601()
        .toDate(),
    body("contact.email")
        .notEmpty()
        .withMessage("Email không được bỏ trống")
        .isEmail()
        .withMessage("Email không hợp lệ"),
    body("contact.phone").notEmpty().withMessage("Số điện thoại không được bỏ trống"),
    body("contact.address").notEmpty().withMessage("Địa chỉ không được bỏ trống"),
];

export const createEmployee = async (req, res, next) => {
    const { idEmployee, username, password, name, position, department, salary, hireDate, contact } = req.body;

    try {
        // Check if username already exists
        const existingEmployee = await Employee.findOne({ username });
        if (existingEmployee) {
            return res.status(400).json({ message: "Tên đăng nhập đã tồn tại." });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new employee
        const newEmployee = new Employee({
            idEmployee,
            username,
            password: hashedPassword,
            name,
            position,
            department,
            salary,
            hireDate,
            contact,
        });

        // Save the employee to the database
        await newEmployee.save();

        return res.status(200).json({ message: "Thêm nhân viên thành công." });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi lưu nhân viên." });
    }
};

export const loginEmployee = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Chuyển đổi tên người dùng thành chữ thường
        const lowercaseUsername = username.toLowerCase();

        // Tìm kiếm nhân viên theo tên đăng nhập
        const employee = await Employee.findOne({ username: lowercaseUsername });
        // Kiểm tra xem nhân viên có tồn tại hay không
        if (!employee) {
            return res.status(404).json({
                status: 404,
                message: 'Tài khoản không tồn tại trong hệ thống.',
                data: [],
                error: null,
            });
        }

        // Kiểm tra mật khẩu
        const isPasswordCorrect = await bcrypt.compare(password, employee.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                status: 400,
                message: 'Sai tên đăng nhập hoặc mật khẩu.',
                data: [],
                error: null,
            });
        }

        // Tạo token
        const token = jwt.sign(
            {
                id: employee._id,
                username: employee.username,
                position: employee.position,
                name: employee.name,
                department: employee.department,
                salary: employee.salary,
                hireDate: employee.hireDate,
                contact: employee.contact,
            },
            process.env.JWT_SECRET
        );

        // Gửi token và thông tin nhân viên về client
        return res.status(200).json({
            status: 200,
            message: 'Đăng nhập thành công.',
            data: {
                token,
                employee: {
                    _id: employee._id,
                    name: employee.name,
                    department: employee.department,
                    salary: employee.salary,
                    hireDate: employee.hireDate,
                    contact: employee.contact,
                },
            },
            error: null,
        });
    } catch (error) {
        next(error);
    }
};

export const getPositionEmployee = async(req, res, next)=>{
    try{
        getPosition(req,res,next)
    }
    catch (error) {
        next(error);
    }
}



export const getAllEmployees = async (req, res, next) => {
    try {
      const employees = await Employee.find().select('-password');
  
      return res.status(200).json({
        status: 200,
        message: 'Lấy danh sách nhân viên thành công.',
        success: true,
        data: employees,
      });
    } catch (error) {
      next(error);
    }
  };