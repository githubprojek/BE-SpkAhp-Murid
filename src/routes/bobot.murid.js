import express from "express";

import { hitungBobotMurid, getAllBobotMurid, deleteBobotMuridById } from "../controllers/bobot.murid.controllers.js";

import { verifyToken, guruOnly } from "../lib/auth.js";

const router = express.Router();

router.get("/getall", getAllBobotMurid);
router.post("/hitungbobot", verifyToken, hitungBobotMurid);
router.delete("/delete/:id", verifyToken, guruOnly, deleteBobotMuridById);

export default router;
