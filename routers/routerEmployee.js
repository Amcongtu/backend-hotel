import express  from "express";
import { createEmployee,loginEmployee,validateEmployee} from "../controllers/employee.js"
import validateMidleware from "../middlewares/validates.js"

const router = express.Router()



router.post("/register",validateEmployee,validateMidleware, createEmployee )
router.post("/login", loginEmployee )




export default router