import { Router } from "express";
import {
  marketorder,
  limitorder,
  depth,
  recent,
} from "../controllers/orderbook.controller.js";

const router = Router();

router.route("/:pair/marketorder").post(marketorder);
router.route("/:pair/limitorder").post(limitorder);
router.route("/:pair/depth").get(depth);
router.route("/:pair/recent").get(recent);

export default router;
