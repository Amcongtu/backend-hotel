import express  from "express";
import { addService, getAllServices } from "../controllers/service.js"

const router = express.Router()



router.post("/", addService )


router.get("/", getAllServices )
export default router