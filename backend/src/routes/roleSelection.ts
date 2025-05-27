import { Router } from "express";
import { getRoleOptions } from "../controllers/roleSelection.controller.js";

const router = Router();

router.get("/roles", getRoleOptions);

export default router;