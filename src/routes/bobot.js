import express from "express";

import { hitungBobotKriteria, getBobotKriteria, deleteBobotById, getKonsistensiStatus } from "../controllers/bobot.controllers.js";
import { verifyToken, adminOnly } from "../lib/auth.js";
const router = express.Router();

router.get("/getall", getBobotKriteria);
router.get("/konsistensi", getKonsistensiStatus);
router.post("/hitungbobot", verifyToken, adminOnly, hitungBobotKriteria);
router.delete("/delete/:id", verifyToken, adminOnly, deleteBobotById);

export default router;
