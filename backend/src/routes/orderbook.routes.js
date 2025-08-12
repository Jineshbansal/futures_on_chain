import { Router } from "express";
import { depth, order } from "../controllers/orderbook.controller.js";

const router = Router();

router.route("/:Pair/order").post(order);
router.route("/:Pair/depth").get(depth);

export default router;
