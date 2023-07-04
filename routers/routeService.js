import express  from "express";
import { addService } from "../controllers/service.js"

const router = express.Router()



router.post("/", addService )


export default router