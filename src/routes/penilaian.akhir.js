import express from "express";
import { hitungPenilaianAkhir, getAllPenilaianAkhir, deleteAllPenilaianAkhir } from "../controllers/penilaian.akhir.controllers.js";

import { verifyToken } from "../lib/auth.js";

const router = express.Router();

router.get("/getall", getAllPenilaianAkhir);
router.post("/hitung", verifyToken, hitungPenilaianAkhir);
router.delete("/delete", verifyToken, deleteAllPenilaianAkhir);

export default router;
