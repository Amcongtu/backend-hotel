import express  from "express";
import {createRoomType,updateRoomType,deleteRoomType,getAllRoomTypes,validateRoomType, getRoomType, getRoomTypePublish} from "../controllers/roomtype.js"
import validateMidleware from "../middlewares/validates.js"
import { verifyUser } from "../middlewares/auth.js";

const router = express.Router()


router.get("/publish", getRoomTypePublish)

// router.post("/", createRoomType)
router.post("/",verifyUser,validateRoomType,validateMidleware, createRoomType)

router.put("/:id",verifyUser,validateRoomType,validateMidleware, updateRoomType)

router.delete("/:id",verifyUser ,deleteRoomType)

router.get("/", getAllRoomTypes)





router.get("/:id", getRoomType)

export default router