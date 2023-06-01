import express  from "express";
import {registerCustomer,validateLogin,validateRegister,loginCustomer} from "../controllers/customer.js"
import validateMidleware from "../middlewares/validates.js"

const router = express.Router()



router.post("/login",validateLogin,validateMidleware,loginCustomer )

router.post("/register",validateRegister,validateMidleware, registerCustomer)



export default router