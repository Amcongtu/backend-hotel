import express  from "express";
import { addService, getAllServices, getAllServicesPublish } from "../controllers/service.js"

const router = express.Router()



router.post("/", addService )


router.get("/", getAllServices )

router.get("/publish", getAllServicesPublish )

export default router