import express  from "express";
import { createEmployee,loginEmployee,validateEmployee,getPositionEmployee} from "../controllers/employee.js"
import validateMidleware from "../middlewares/validates.js"

const router = express.Router()



router.post("/register",validateEmployee,validateMidleware, createEmployee )
router.post("/login", loginEmployee )
router.get("/get-position", getPositionEmployee )





export default router