import express from "express"
import { deposit } from "../controllers/balance.controller.js"

const router = express.Router()

router.route("/deposit/:userId").post(deposit)
export default router;
