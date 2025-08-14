import { Router } from "express";
import { order } from "../controllers/order.controller.js";

const router = Router();

router.route("/:walletId").get(order);

export default router;
