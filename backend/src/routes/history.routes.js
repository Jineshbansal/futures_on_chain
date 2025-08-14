import { Router } from "express";
import { history } from "../controllers/history.controller.js";

const router = Router();

router.route("/:walletId").get(history);

export default router;
