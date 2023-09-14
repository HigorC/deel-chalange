import express from "express"
import { getAll, getAllUnpaid, pay } from "../controllers/job.controller.js"

const router = express.Router()

router.route("/").get(getAll)
router.route("/unpaid").get(getAllUnpaid)
router.route("/:id/pay").post(pay)

export default router;
