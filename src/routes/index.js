import express from "express"
import contractRoutes from "./contract.route.js"
import jobRoutes from "./job.route.js"
import balanceRoutes from "./balances.route.js"

const router = express.Router()
router.use("/contracts", contractRoutes)
router.use("/jobs", jobRoutes)
router.use("/balances", balanceRoutes)

export default router;
