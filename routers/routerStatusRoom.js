import express from "express";
import { createStatusRoom, getAllStatusRooms, updateStatusRoom, validateStatusRoom } from "../controllers/statusRoom.js"
import  validateMidleware  from "../middlewares/validates.js"

const router = express.Router()

// validateStatusRoom
// validateMidleware
// Thêm phòng
router.post("/", createStatusRoom)
router.put("/:id",  updateStatusRoom)
router.delete("/:id" ,createStatusRoom)
router.get("/", getAllStatusRooms)
export default router