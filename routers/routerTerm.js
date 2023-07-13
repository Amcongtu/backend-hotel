import express from "express"
import { validateTerm, createTerm } from '../controllers/term.js'
import validateMidleware from "../middlewares/validates.js"
const router = express.Router()


router.post("/", validateTerm, validateMidleware, createTerm)



export default router