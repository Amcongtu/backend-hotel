import express  from "express";
import {createRoom,deleteRoom,filterRooms,getAllRooms,getRoomByRoomNumber,updateRoom,validateRoom} from "../controllers/room.js"
import validateMidleware from "../middlewares/validates.js"
import { verifyUser } from "../middlewares/auth.js";

const router = express.Router()


// Thêm phòng
router.post("/",verifyUser,validateRoom,validateMidleware, createRoom)

router.delete("/:id", verifyUser,validateMidleware, deleteRoom)


router.put("/:id", verifyUser,validateMidleware, updateRoom)

router.get("/:id", getRoomByRoomNumber)

router.get("/", getAllRooms)

router.get("/filter", filterRooms)



export default router