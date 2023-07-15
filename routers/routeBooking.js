import express  from "express";
import {createBooking, getAllBooking } from "../controllers/booking.js"
// import validateMidleware from "../middlewares/validates.js"

const router = express.Router()



router.post("/", createBooking )


router.get("/", getAllBooking )






export default router