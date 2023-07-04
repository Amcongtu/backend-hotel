import express  from "express";
import {addBooking, } from "../controllers/booking.js"
// import validateMidleware from "../middlewares/validates.js"

const router = express.Router()



router.post("/", addBooking )





export default router