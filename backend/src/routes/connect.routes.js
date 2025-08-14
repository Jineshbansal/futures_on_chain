import { Router } from "express";
import { connect } from "../controllers/connect.controller.js";

const router = Router();

router.route("/:walletId").post(connect);

export default router;
