import express from "express";
import { createStatusRoom, updateStatusRoom, validateStatusRoom } from "../controllers/statusRoom.js"
import { validateMidleware } from "../middlewares/validates.js"

const router = express.Router()


// Thêm phòng
router.post("/", validateStatusRoom, validateMidleware, createStatusRoom)
router.put("/:id",  updateStatusRoom)
router.delete("/:id" ,createStatusRoom)

export default router