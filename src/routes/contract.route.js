import express from "express"
import { getByID, getAllNonTerminated } from "../controllers/contract.controller.js"

const router = express.Router()

router.route("/").get(getAllNonTerminated)
router.route("/:id").get(getByID)

export default router;
